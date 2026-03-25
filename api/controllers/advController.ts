import { Request, Response } from 'express';
import * as advService from '../services/advService';
import { asyncHandler } from '../lib/asyncHandler';

/**
 * 获取广告列表（客户端使用，支持多语言）
 */
export const getAdvData = asyncHandler(async (req: Request, res: Response) => {
    const lang = (req.headers['accept-language'] as string) || 'en';
    const data = await advService.findAdvList(lang);
    res.json({ success: true, data });
});

/**
 * 管理后台 - 获取广告列表（带分页）
 */
export const getAdvertisementList = asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize, is_active } = req.query;

    const params = {
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 10,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
    };

    const result = await advService.getAdvertisementList(params);
    res.json({ success: true, data: result });
});

/**
 * 管理后台 - 根据 ID 获取广告详情
 */
export const getAdvertisementById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await advService.getAdvertisementById(id as string);
    res.json({ success: true, data });
});

/**
 * 管理后台 - 新增广告
 */
export const createAdvertisement = asyncHandler(async (req: Request, res: Response) => {
    const data = await advService.createAdvertisement(req.body);
    res.json({ success: true, data });
});

/**
 * 管理后台 - 更新广告
 */
export const updateAdvertisement = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await advService.updateAdvertisement(id as string, req.body);
    res.json({ success: true, data });
});

/**
 * 管理后台 - 删除广告
 */
export const deleteAdvertisement = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await advService.deleteAdvertisement(id as string);
    res.json({ success: true, message: '删除成功' });
});

/**
 * 管理后台 - 批量删除广告
 */
export const deleteAdvertisements = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ success: false, message: '缺少 ids 参数' });
    }
    const result = await advService.deleteAdvertisements(ids);
    res.json({ success: true, message: `成功删除 ${result.count} 条记录` });
});

/**
 * 管理后台 - 切换广告启用状态
 */
export const toggleAdvertisementStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await advService.toggleAdvertisementStatus(id as string);
    res.json({ success: true, data });
});
