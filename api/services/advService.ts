import { supabase } from '../lib/supabase';

// 广告数据类型定义
export interface Advertisement {
    id?: string;
    name_en: string;
    name_pt_br: string;
    name_id: string;
    name_ur: string;
    link: string;
    probability: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

// 分页查询参数
export interface QueryParams {
    page?: number;
    pageSize?: number;
    is_active?: boolean;
}

// 查询结果
export interface QueryResult {
    data: Advertisement[];
    total: number;
    page: number;
    pageSize: number;
}


/**
 * 查询广告列表（不带分页）
 */
export const findAdvList = async (lang: string) => {
    // 定义语言与数据库字段的映射
    const langMap: Record<string, string> = {
        'pt-br': 'name_pt_br',
        'id': 'name_id',
        'ur': 'name_ur',
        'en': 'name_en'
    };

    // 匹配字段，默认用英文
    const titleField = langMap[lang] || 'name_en';
    const { data, error } = await supabase
        .from('advertisement')
        .select(`id, link, name:${titleField}, imgLink, probability, is_active`)
    if (error) throw error;
    return data;
};

/**
 * 查询广告列表（带分页）
 */
export const getAdvertisementList = async (params: QueryParams = {}) => {
    const { page = 1, pageSize = 10, is_active } = params;

    // 计算分页
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 构建查询
    let query = supabase
        .from('advertisement')
        .select('*', { count: 'exact' });

    if (is_active !== undefined) {
        query = query.eq('is_active', is_active);
    }

    query = query.order('created_at', { ascending: false })
        .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data: data || [],
        total: count || 0,
        page,
        pageSize
    };
};

/**
 * 根据ID查询单条广告
 */
export const getAdvertisementById = async (id: string) => {
    const { data, error } = await supabase
        .from('advertisement')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

/**
 * 新增广告
 */
export const createAdvertisement = async (adv: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
        .from('advertisement')
        .insert({
            ...adv,
            is_active: adv.is_active ?? true,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * 更新广告
 */
export const updateAdvertisement = async (id: string, adv: Partial<Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
        .from('advertisement')
        .update(adv)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * 删除广告
 */
export const deleteAdvertisement = async (id: string) => {
    const { error } = await supabase
        .from('advertisement')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { success: true };
};

/**
 * 批量删除广告
 */
export const deleteAdvertisements = async (ids: string[]) => {
    const { error } = await supabase
        .from('advertisement')
        .delete()
        .in('id', ids);

    if (error) throw error;
    return { success: true, count: ids.length };
};

/**
 * 切换广告启用状态
 */
export const toggleAdvertisementStatus = async (id: string) => {
    // 先获取当前状态
    const current = await getAdvertisementById(id);
    if (!current) throw new Error('Advertisement not found');

    const { data, error } = await supabase
        .from('advertisement')
        .update({ is_active: !current.is_active })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};
