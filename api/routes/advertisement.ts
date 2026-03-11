import { Router } from 'express';
import { validateTelegramData } from '../middleware/auth';
import * as advController from '../controllers/advController';
const router = Router();

// 注意：这里的路径是相对路径
// 如果在 index.ts 中挂载到了 /api/adv，那么这里的 '/' 实际上就是 /api/adv/
router.get('/list', validateTelegramData, advController.getAdvData);

export default router;
