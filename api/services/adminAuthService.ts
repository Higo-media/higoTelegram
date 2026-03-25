import { supabase, supabaseAuth } from '../lib/supabase';

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
