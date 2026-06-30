import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { languagesTable } from "@workspace/db";
import { ListLanguagesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/languages", async (_req, res): Promise<void> => {
  const languages = await db.select().from(languagesTable).orderBy(languagesTable.name);
  res.json(ListLanguagesResponse.parse(languages));
});

export default router;
