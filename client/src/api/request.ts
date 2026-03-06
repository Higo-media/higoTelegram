import axios from 'axios';

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

/*// 请求拦截器：自动带上 Telegram 的 initData
request.interceptors.request.use((config) => {
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) {
        config.headers['Authorization'] = `tma ${initData}`;
    }
    return config;
});*/

export default request;
