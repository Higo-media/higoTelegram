import { supabase } from '../lib/supabase';

export const findAdvList = async () => {
    const { data, error } = await supabase
        .from('advertisement')
        .select('id, link, name, probability')
    if (error) throw error;
    return data;
};
