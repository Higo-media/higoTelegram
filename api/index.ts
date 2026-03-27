import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import advRoutes from './routes/advertisement';
import authRoutes from './routes/adminAuth';
import { errorHandler } from './middleware/error';
const app = express();

// CORS 必须在所有中间件之前配置
app.use(cors({
    origin: "https://higo-admin.vercel.app", // 你的管理后台地址
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.get('/api/test', (req, res) => res.send('Server is running'));
app.use('/api', advRoutes);
app.use("/api", authRoutes); // 这样访问路径就是 /api/login

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`本地调试服务器已启动: http://localhost:${PORT}`);
});

// 必须放在最后
app.use(errorHandler);
export default app;
