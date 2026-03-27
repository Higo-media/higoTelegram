import axios from 'axios';
import { showToast } from '@nutui/nutui';
import i18n from '@/i18n';
import { useLoadingStore } from '@/store/loading';
const request = axios.create({
    baseURL: '/api', // 建议通过环境变量管理
    timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
    // 开启全局 Loading
    const loadingStore = useLoadingStore();
    loadingStore.show();
    const isDev = import.meta.env.DEV;

    // 1. 本地开发绕过逻辑
    if (isDev) {
        config.headers['x-dev-bypass'] = 'true';
    }

    // 2. 注入多语言标识 (关键修改)
    // 从 vue-i18n 中获取当前激活的语言，并放入 accept-language Header
    const currentLang = i18n.global.locale.value;
    config.headers['accept-language'] = currentLang;

    // 3. Telegram 认证逻辑处理
    let initData = (window as any)?.Telegram?.WebApp?.initData;

    if (initData && initData.includes('user')) {
        sessionStorage.setItem('tg_init_data', initData);
    } else {
        initData = sessionStorage.getItem('tg_init_data') || '';
    }

    if (initData) {
        config.headers['Authorization'] = `tma ${initData}`;
    }

    return config;
}, (error) => Promise.reject(error));

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 关闭全局 Loading
        const loadingStore = useLoadingStore();
        loadingStore.hide();
        const res = response.data;

        // 对应后端返回格式：{ success: boolean, data: any, error?: string }
        if (res.success) {
            return res.data; // 成功则直接抛出业务数据
        } else {
            // 业务级错误处理 (例如：积分不足、验证失败)
            const errorMsg = res.error || '业务请求失败';
            showToast.warn(errorMsg);
            return Promise.reject(new Error(errorMsg));
        }
    },
    (error) => {
        // 关闭全局 Loading
        const loadingStore = useLoadingStore();
        loadingStore.hide();
        // 网络/系统级错误处理 (例如：404, 500, 网络断开)
        let message = '';
        const status = error.response?.status;

        switch (status) {
            case 401: message = '身份验证过期，请重新进入小程序'; break;
            case 403: message = '拒绝访问'; break;
            case 404: message = '请求资源不存在'; break;
            case 500: message = '服务器内部错误'; break;
            default: message = error.message || '网络连接异常';
        }

        showToast.fail(message);
        return Promise.reject(error);
    }
);

export default request;
