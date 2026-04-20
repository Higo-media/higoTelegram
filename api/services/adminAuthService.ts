import { supabase, supabaseAuth } from '../lib/supabase';
import axios from 'axios';

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password
    });

    if (error) return { success: false, message: error.message };

    return {
        success: true,
        data: {
            username: data.user?.email,
            // 可以在此处添加 role 逻辑，比如 email 是你的，就给 admin
            roles: ["admin"],
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
            expires: data.session?.expires_at
                ? new Date(data.session.expires_at * 1000)
                : null
        }
    };
};

export const refreshToken = async (refreshToken: string) => {
    const { data, error } = await supabaseAuth.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return { success: false, message: error.message };

    return {
        success: true,
        data: {
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token
        }
    };
};

/**
 * 转发 Postback 请求到外部广告平台
 * @param params 包含 aid, tid, visitor_id 的对象
 */
export const sendPostbackProxy = async (params: { aid: string; tid: string; visitor_id: string }) => {
    const postbackBase = "http://ad.propellerads.com/conversion.php";

    try {
        const response = await axios.get(postbackBase, {
            params,
            timeout: 10000 // 设置超时保护
        });

        console.log('channelMiddleService.responseStatus:', response.status)
        return response.data;
    } catch (error: any) {
        // 抛出错误供 Controller 捕获
        throw new Error(`External API Error: ${error.message}`);
    }
};
