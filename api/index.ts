import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { validateTelegramData } from './middleware/auth'; // 确保路径正确

const app = express();
app.use(cors());
app.use(express.json());
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// 示例接口
app.get('/api/user-data', validateTelegramData, async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`本地调试服务器已启动: http://localhost:${PORT}`);
});

export default app;
