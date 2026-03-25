import { createClient } from '@supabase/supabase-js';

// 默认客户端（使用 service role key，用于数据库操作）
export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Auth 客户端（使用 anon key，用于用户认证相关操作）
export const supabaseAuth = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);
