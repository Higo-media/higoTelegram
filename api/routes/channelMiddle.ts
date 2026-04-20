import { Router } from 'express';
import { validateTelegramData } from '../middleware/auth';
import * as channelMiddleController from '../controllers/channelMiddleController';

const router = Router();

// 客户端调用，通常也需要校验 Telegram 数据以防被恶意刷接口
router.get('/channelMiddle/postback', channelMiddleController.handlePostback);

export default router;
