import { supabase } from '../lib/supabase';

export const findAdvList = async (lang: string) => {
    // 定义语言与数据库字段的映射
    const langMap: Record<string, string> = {
        'zh-hans': 'name_zh',
        'pt-br': 'name_pt-br',
        'id': 'name_id',
        'ur': 'name_ur',
        'en': 'name_en'
    };

    // 匹配字段，默认用英文
    const titleField = langMap[lang] || 'name_en';
    const { data, error } = await supabase
        .from('advertisement')
        .select(`id, link, name:${titleField}, probability`)
    if (error) throw error;
    return data;
};
