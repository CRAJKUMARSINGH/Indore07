import { Router, type IRouter } from "express";
import healthRouter from "./health";
import evaluationRouter from "./evaluation";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/evaluation", evaluationRouter);

export default router;
