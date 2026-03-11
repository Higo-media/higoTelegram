import { Request, Response, NextFunction } from 'express';

// Express 默认无法捕获异步函数（async/await）里的错误，必须包裹一层。这样你就不用在 Controller 里写 try...catch
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
