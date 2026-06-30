import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const languagesTable = pgTable("languages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  code: text("code").notNull(),
  flag: text("flag").notNull(),
  learnerCount: integer("learner_count").notNull().default(0),
});

export const insertLanguageSchema = createInsertSchema(languagesTable);
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languagesTable.$inferSelect;
