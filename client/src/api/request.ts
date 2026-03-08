import axios from 'axios';

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// 请求拦截器：自动带上 Telegram 的 initData
request.interceptors.request.use((config) => {
    const initData = (window as any)?.Telegram?.WebApp?.initData;
    if (initData) {
        config.headers['Authorization'] = `tma ${initData}`;
    } else {
        // 开发环境下，如果本地调试需要，你可以暂时hardcode一个有效的initData
        // 但千万不要提交到 git 仓库！
        console.warn('未检测到 Telegram 环境，API 请求可能因无权限被拦截');
    }
    return config;
});

export default request;
