import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 全局错误捕获:', err.stack);

    // 如果是 Supabase 或业务逻辑抛出的错误
    const statusCode = err.status || 500;
    const message = err.message || '服务器内部错误';

    res.status(statusCode).json({
        success: false,
        error: message,
        // 开发环境下返回堆栈信息，方便排查；生产环境隐藏
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
