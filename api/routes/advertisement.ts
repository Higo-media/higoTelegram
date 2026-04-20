import { Router } from 'express';
import { validateTelegramData } from '../middleware/auth';
import { verifyAdmin } from '../middleware/adminAuth';
import * as advController from '../controllers/advController';

const router = Router();

// 客户端接口（Telegram 用户使用）
// 如果在 index.ts 中挂载到了 /api/adv，那么这里的 '/' 实际上就是 /api/adv/
// router.get('/adv/list', validateTelegramData, advController.getAdvData);

// 管理后台接口（需要 Admin 认证）
router.get('/admin/list', verifyAdmin, advController.getAdvertisementList);
router.get('/admin/:id', verifyAdmin, advController.getAdvertisementById);
router.post('/admin/add', verifyAdmin, advController.createAdvertisement);
router.put('/admin/:id', verifyAdmin, advController.updateAdvertisement);
router.delete('/admin/:id', verifyAdmin, advController.deleteAdvertisement);
// router.delete('/admin/batch', verifyAdmin, advController.deleteAdvertisements);
router.patch('/admin/:id/toggle', verifyAdmin, advController.toggleAdvertisementStatus);

export default router;
