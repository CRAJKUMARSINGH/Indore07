import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  type: text("type").notNull().default("multiple_choice"),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull().default([]),
  correctAnswer: text("correct_answer").notNull(),
  audioHint: text("audio_hint"),
  transliteration: text("transliteration"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
