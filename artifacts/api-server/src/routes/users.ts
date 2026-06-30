import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { GetMeResponse, UpdateMeBody, UpdateMeResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULT_USER_ID = 1;

async function ensureUser() {
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (existing) return existing;
  const [user] = await db.insert(usersTable).values({ name: "Learner" }).returning();
  return user;
}

router.get("/users/me", async (_req, res): Promise<void> => {
  const user = await ensureUser();
  res.json(GetMeResponse.parse(user));
});

router.patch("/users/me", async (req, res): Promise<void> => {
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = await ensureUser();
  const updateData: Partial<typeof usersTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.currentLanguageId !== undefined) updateData.currentLanguageId = parsed.data.currentLanguageId;
  if (parsed.data.goals !== undefined) updateData.goals = parsed.data.goals;

  const [updated] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json(UpdateMeResponse.parse(updated));
});

export default router;
export { ensureUser, DEFAULT_USER_ID };
