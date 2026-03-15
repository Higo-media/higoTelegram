import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import advRoutes from './routes/advertisement';
import authRoutes from './routes/adminAuth';
import { errorHandler } from './middleware/error';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/adv', advRoutes);
app.use("/api", authRoutes); // 这样访问路径就是 /api/login
app.use(cors({
    origin: "https://higo-admin.vercel.app", // 你的管理后台地址
    credentials: true
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`本地调试服务器已启动: http://localhost:${PORT}`);
});

// 必须放在最后
app.use(errorHandler);
export default app;
