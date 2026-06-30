import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  score: integer("score").notNull().default(100),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  completedDate: text("completed_date").notNull(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, completedAt: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;
