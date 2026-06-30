import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { GetLeaderboardResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";
import { DEFAULT_USER_ID } from "./users";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.weeklyXp))
    .limit(20);

  const entries = users.map((user, idx) => ({
    rank: idx + 1,
    userId: user.id,
    userName: user.name,
    xp: user.xp,
    weeklyXp: user.weeklyXp,
    isCurrentUser: user.id === DEFAULT_USER_ID,
  }));

  const currentUserRank = entries.find((e) => e.isCurrentUser)?.rank ?? entries.length + 1;

  res.json(GetLeaderboardResponse.parse({ entries, currentUserRank }));
});

export default router;
