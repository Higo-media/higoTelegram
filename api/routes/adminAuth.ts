// api/routes/auth.ts
import { Router } from "express";
import * as authController from "../controllers/adminAuthController";
import {verifyAdmin} from "../middleware/adminAuth";

const router = Router();

// 对应前端的 login 路径
router.get("/login",  (req, res) => res.send('Server is running'))
router.post("/login", authController.login);
router.post("/refresh-token", authController.handleRefreshToken);

export default router;
