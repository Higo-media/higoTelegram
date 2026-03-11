import {Request, Response} from 'express';
import * as advService from '../services/advService';
import {asyncHandler} from '../lib/asyncHandler';

export const getAdvData = asyncHandler(async (req: Request, res: Response) => {
        const data = await advService.findAdvList(); // 调用 Service
        res.json({success: true, data});
    }
)
