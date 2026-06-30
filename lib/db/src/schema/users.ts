import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Learner"),
  xp: integer("xp").notNull().default(0),
  weeklyXp: integer("weekly_xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  level: integer("level").notNull().default(1),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  dailyXp: integer("daily_xp").notNull().default(0),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(50),
  currentLanguageId: text("current_language_id").notNull().default("hindi"),
  goals: text("goals").array().notNull().default([]),
  lastActiveDate: text("last_active_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
