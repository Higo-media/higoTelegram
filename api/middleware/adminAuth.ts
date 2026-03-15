import { supabase } from '../lib/supabase';
import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("收到请求头:", req.headers.authorization); // 看看这里是不是空的
    if (!token) return res.status(401).send("Access Denied");

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return res.status(401).send("Invalid Token");

    // 将用户信息挂载到 req 方便后续使用
    req.user = user;
    next();
};
