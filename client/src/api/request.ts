import axios from 'axios';

const request = axios.create({
    timeout: 10000,
});

// 请求拦截器：自动带上 Telegram 的 initData
request.interceptors.request.use((config) => {
    const isDev = import.meta.env.DEV;
    if (isDev) {
        config.headers['x-dev-bypass'] = 'true';
        // 【添加这行确认代码】
        console.log('Header x-dev-bypass 已添加:', config.headers['x-dev-bypass']);
    }
    console.log((window as any)?.Telegram?.WebApp);
    const initData = (window as any)?.Telegram?.WebApp?.initData;
    console.log('initData:',initData);
    if (initData) {
        // 首次加载，保存到本地缓存
        sessionStorage.setItem('tg_init_data', initData);
        config.headers['Authorization'] = `tma ${initData}`;
    } else {
        // 页面刷新后，如果 tg.initData 为空，尝试从缓存获取
        const cachedData = sessionStorage.getItem('tg_init_data');
        if (cachedData) {
            config.headers['Authorization'] = `tma ${cachedData}`;
        } else {
            console.warn('未检测到 Telegram 环境，API 请求可能因无权限被拦截');
        }
    }
    return config;
});

export default request;
