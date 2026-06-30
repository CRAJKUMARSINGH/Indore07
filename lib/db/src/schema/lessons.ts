import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  languageId: text("language_id").notNull(),
  title: text("title").notNull(),
  unit: integer("unit").notNull().default(1),
  unitTitle: text("unit_title").notNull().default("Basics"),
  xpReward: integer("xp_reward").notNull().default(10),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
