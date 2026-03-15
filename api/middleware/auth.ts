import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// telegram认证
export const validateTelegramData = (req: Request, res: Response, next: NextFunction) => {
    // 【新增】本地开发绕过逻辑
    if (process.env.NODE_ENV === 'development' && req.headers['x-dev-bypass'] === 'true') {
        console.warn('⚠️ 警告：已触发后端开发后门，跳过 Telegram 校验');
        // 模拟一个固定的开发用户对象
        (req as any).user = {
            id: 7284934842,
            first_name: 'DevUser',
            username: 'nanachc'
        };
        return next();
    }
    // 从 Header 获取 initData
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('tma ')) {
        return res.status(401).json({ error: '请通过 Telegram 小程序打开' });
    }

    const initData = authHeader.split(' ')[1];
    const botToken = process.env.BOT_TOKEN; // 确保在 .env 中配置了你的 Bot Token

    if (!botToken) {
        return res.status(500).json({ error: '后端未配置 Bot Token' });
    }

    // 校验逻辑
    const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

    const searchParams = new URLSearchParams(initData);
    const hash = searchParams.get('hash');
    searchParams.delete('hash');

    const dataCheckString = Array.from(searchParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

    if (hash !== calculatedHash) {
        return res.status(401).json({ error: '身份校验失败' });
    }

    // 校验通过，把用户信息挂载到 req 上，方便后续接口使用
    const user = JSON.parse(searchParams.get('user') || '{}');
    (req as any).user = user;

    next();
};
