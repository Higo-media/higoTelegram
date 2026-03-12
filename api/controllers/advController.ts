import {Request, Response} from 'express';
import * as advService from '../services/advService';
import {asyncHandler} from '../lib/asyncHandler';

export const getAdvData = asyncHandler(async (req: Request, res: Response) => {
        // 1. 获取前端通过 Header 传递过来的语言标识
        // 如果没有传，默认设为 'en'
        const lang = (req.headers['accept-language'] as string) || 'en';
        const data = await advService.findAdvList(lang); // 调用 Service
        res.json({success: true, data});
    }
)
