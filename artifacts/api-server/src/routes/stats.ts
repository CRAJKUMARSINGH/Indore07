import { Router, type IRouter } from "express";
import { GetStatsResponse } from "@workspace/api-zod";
import { DEFAULT_USER_ID, ensureUser } from "./users";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const user = await ensureUser();

  res.json(
    GetStatsResponse.parse({
      xp: user.xp,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lessonsCompleted: user.lessonsCompleted,
      weeklyXp: user.weeklyXp,
      level: user.level,
      languagesStarted: 1,
      dailyGoalXp: user.dailyGoalXp,
      dailyXp: user.dailyXp,
    })
  );
});

export default router;
