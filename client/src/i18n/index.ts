import { createI18n } from 'vue-i18n';

// 1. 扩展语言包定义
const messages = {
    'en': {
        btnText: {
            turn: 'Draw',
            mainBtn: 'Draw Now'
        }
    },
    'zh-hans': {
        btnText: {
            turn: '抽奖',
            mainBtn: '立即抽奖'
        }
    },
    'pt-br': { // 巴西葡萄牙语
        btnText: {
            turn: 'Sortear',
            mainBtn: 'Sortear agora'
        }
    },
    'id': { // 印尼语
        btnText: {
            turn: 'Undian',
            mainBtn: 'Undian sekarang'
        }
    },
    'ur': { // 乌尔都语（巴基斯坦）
        btnText: {
            turn: 'قرعہ اندازی',
            mainBtn: 'ابھی قرعہ اندازی کریں'
        }
    }
};

// 2. 优化语言识别逻辑：支持精准匹配和前缀匹配
const getBestLanguage = () => {
    // 优先从缓存获取用户手动设置的语言
    const cachedLang = localStorage.getItem('user_lang');
    if (cachedLang && messages.hasOwnProperty(cachedLang)) return cachedLang;

    // 1. 获取环境语言代码 (Telegram 或 浏览器)
    const rawLang = ((window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || navigator.language).toLowerCase();

    // 2. 匹配逻辑
    if (rawLang.startsWith('zh')) return 'zh-hans';
    if (rawLang.startsWith('ru')) return 'ru';
    if (rawLang.startsWith('ja')) return 'ja';

    // 3. 默认返回英文
    return 'en';
};

const i18n = createI18n({
    legacy: false,
    locale: getBestLanguage(),
    fallbackLocale: 'en', // 如果某个词条没翻译，自动回退到英文
    messages,
});

export default i18n;
