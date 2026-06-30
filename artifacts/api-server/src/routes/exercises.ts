import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { exercisesTable } from "@workspace/db";
import { CheckAnswerParams, CheckAnswerBody, CheckAnswerResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/exercises/:id/answer", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CheckAnswerParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CheckAnswerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [exercise] = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.id, params.data.id));

  if (!exercise) {
    res.status(404).json({ error: "Exercise not found" });
    return;
  }

  const correct =
    body.data.answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

  res.json(
    CheckAnswerResponse.parse({
      correct,
      correctAnswer: exercise.correctAnswer,
      xpAwarded: correct ? 5 : 0,
    })
  );
});

export default router;
