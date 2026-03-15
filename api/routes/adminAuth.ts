import { Router } from "express";
import * as authController from "../controllers/adminAuthController";

const router = Router();

// 对应前端的 login 路径
router.post("/login", authController.login);
router.post("/refresh-token", authController.handleRefreshToken);

export default router;
