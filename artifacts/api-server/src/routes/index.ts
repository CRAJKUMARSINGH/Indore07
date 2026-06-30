import { Router, type IRouter } from "express";
import healthRouter from "./health";
import evaluationRouter from "./evaluation";
import languagesRouter from "./languages";
import usersRouter from "./users";
import lessonsRouter from "./lessons";
import exercisesRouter from "./exercises";
import leaderboardRouter from "./leaderboard";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/evaluation", evaluationRouter);
router.use(languagesRouter);
router.use(usersRouter);
router.use(lessonsRouter);
router.use(exercisesRouter);
router.use(leaderboardRouter);
router.use(statsRouter);

export default router;
