import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import advRoutes from './routes/advertisement';
import { errorHandler } from './middleware/error';
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/adv', advRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`本地调试服务器已启动: http://localhost:${PORT}`);
});

// 必须放在最后
app.use(errorHandler);
export default app;
