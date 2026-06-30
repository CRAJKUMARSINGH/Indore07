import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { lessonsTable, progressTable, exercisesTable, usersTable } from "@workspace/db";
import {
  ListLessonsQueryParams,
  ListLessonsResponse,
  GetLessonParams,
  GetLessonResponse,
  CompleteLessonParams,
  CompleteLessonBody,
  CompleteLessonResponse,
} from "@workspace/api-zod";
import { eq, and } from "drizzle-orm";
import { DEFAULT_USER_ID, ensureUser } from "./users";

const router: IRouter = Router();

router.get("/lessons", async (req, res): Promise<void> => {
  const qp = ListLessonsQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.languageId, qp.data.languageId))
    .orderBy(lessonsTable.unit, lessonsTable.sortOrder);

  const completedRows = await db
    .select({ lessonId: progressTable.lessonId })
    .from(progressTable)
    .where(eq(progressTable.userId, DEFAULT_USER_ID));
  const completedIds = new Set(completedRows.map((r) => r.lessonId));

  // Get exercise counts in bulk
  const allExercises = await db.select().from(exercisesTable);
  const exerciseCountMap: Record<number, number> = {};
  for (const ex of allExercises) {
    exerciseCountMap[ex.lessonId] = (exerciseCountMap[ex.lessonId] ?? 0) + 1;
  }

  let foundFirstAvailable = false;
  const result = lessons.map((lesson) => {
    const isCompleted = completedIds.has(lesson.id);
    let status = "locked";
    if (isCompleted) {
      status = "completed";
    } else if (!foundFirstAvailable) {
      status = "available";
      foundFirstAvailable = true;
    }
    return {
      id: lesson.id,
      title: lesson.title,
      unit: lesson.unit,
      unitTitle: lesson.unitTitle,
      xpReward: lesson.xpReward,
      status,
      exerciseCount: exerciseCountMap[lesson.id] ?? 0,
      languageId: lesson.languageId,
    };
  });

  res.json(ListLessonsResponse.parse(result));
});

router.get("/lessons/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetLessonParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.id));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lesson.id))
    .orderBy(exercisesTable.sortOrder);

  const completedRows = await db
    .select({ lessonId: progressTable.lessonId })
    .from(progressTable)
    .where(and(eq(progressTable.userId, DEFAULT_USER_ID), eq(progressTable.lessonId, lesson.id)));
  const status = completedRows.length > 0 ? "completed" : "available";

  res.json(
    GetLessonResponse.parse({
      id: lesson.id,
      title: lesson.title,
      unit: lesson.unit,
      unitTitle: lesson.unitTitle,
      xpReward: lesson.xpReward,
      status,
      exercises: exercises.map((e) => ({
        id: e.id,
        lessonId: e.lessonId,
        type: e.type,
        prompt: e.prompt,
        options: e.options,
        correctAnswer: e.correctAnswer,
        audioHint: e.audioHint ?? null,
        transliteration: e.transliteration ?? null,
      })),
    })
  );
});

router.post("/lessons/:id/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CompleteLessonParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CompleteLessonBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.id));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const user = await ensureUser();
  const today = new Date().toISOString().split("T")[0];

  const existing = await db
    .select()
    .from(progressTable)
    .where(and(eq(progressTable.userId, user.id), eq(progressTable.lessonId, lesson.id)));

  const isNew = existing.length === 0;

  if (isNew) {
    await db.insert(progressTable).values({
      userId: user.id,
      lessonId: lesson.id,
      xpEarned: lesson.xpReward,
      score: body.data.score,
      completedDate: today,
    });
  }

  const xpGain = isNew ? lesson.xpReward : 0;
  const newXp = user.xp + xpGain;
  const newWeeklyXp = user.weeklyXp + xpGain;
  const newDailyXp = user.dailyXp + xpGain;
  const newLessonsCompleted = user.lessonsCompleted + (isNew ? 1 : 0);
  const newLevel = Math.floor(newXp / 100) + 1;

  let newStreak = user.streak;
  let streakUpdated = false;
  if (user.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (user.lastActiveDate === yesterdayStr) {
      newStreak = user.streak + 1;
    } else {
      newStreak = 1;
    }
    streakUpdated = true;
  }

  const newLongestStreak = Math.max(user.longestStreak, newStreak);

  const [updated] = await db
    .update(usersTable)
    .set({
      xp: newXp,
      weeklyXp: newWeeklyXp,
      dailyXp: newDailyXp,
      lessonsCompleted: newLessonsCompleted,
      level: newLevel,
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
    })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json(
    CompleteLessonResponse.parse({
      xpAwarded: xpGain,
      newTotal: newXp,
      streakUpdated,
      newStreak,
      levelUp: updated.level > user.level,
    })
  );
});

export default router;
