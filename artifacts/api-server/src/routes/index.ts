import { Router, type IRouter } from "express";
import healthRouter from "./health";
import proposalsRouter from "./proposals/index";
import aiRouter from "./ai/index";
import authRouter from "./auth/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/proposals", proposalsRouter);
router.use("/ai", aiRouter);

export default router;
