import {Request, Response} from "express";
import * as authService from "../services/adminAuthService";
import {asyncHandler} from "../lib/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
        const {username, password} = req.body;
    console.log("login", username, password);
        // 调用 service 处理具体逻辑
        const result = await authService.signIn(username, password);

        if (!result.success) {
            return res.status(401).json({success: false, message: result.message === "Invalid login credentials" ? "账号或密码错误" : result.message});
        }

        // 返回 vue-pure-admin 需要的标准格式
        return res.json({
            success: true,
            data: result.data
        });
    }
)

export const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    // 前端通常通过 body 传过来 refreshToken
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(400).json({success: false, message: "缺少 refreshToken"});
    }

    const result = await authService.refreshToken(refreshToken);

    if (!result.success) {
        return res.status(401).json({success: false, message: result.message});
    }

    // 返回新 token，vue-pure-admin 会自动保存并更新后续请求的 Header
    return res.json({
        success: true,
        data: result.data
    });
})
