import { Request, Response } from 'express';
import * as channelMiddleService from '../services/channelMiddleService';
import { asyncHandler } from '../lib/asyncHandler';

/**
 * 转发广告回传请求
 */
export const handlePostback = asyncHandler(async (req: Request, res: Response) => {
    const { aid, tid, visitor_id } = req.query;

    if (!visitor_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameter: visitor_id'
        });
    }

    // 调用 Service 进行中转
    const result = await channelMiddleService.sendPostbackProxy({
        aid: aid as string,
        tid: tid as string,
        visitor_id: visitor_id as string
    });
    res.json({
        success: true,
        message: 'Postback forwarded successfully',
        data: result
    });
});
