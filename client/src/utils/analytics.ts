import { useGtag } from 'vue-gtag-next';

export function useAnalytics() {
    const { event, set } = useGtag();

    /**
     * 初始化用户信息关联
     * 将 Telegram 用户 ID 绑定到 GA4 的 user_id
     */
    const initUser = (tgUser: any) => {
        if (tgUser?.id) {
            set({ user_id: tgUser.id.toString() });
            set({
                user_properties: {
                    language: tgUser.language_code || 'unknown',
                    is_premium: tgUser.is_premium ? 'yes' : 'no'
                }
            });
        }
    };

    /**
     * 追踪广告点击事件
     */
    const trackAdClick = async (adId: string, adTitle: string, adLink: string) => {
        return new Promise((resolve) => {
            event('ad_click', {
                ad_id: adId || "unknown_id",
                ad_title: adTitle || "unknown_title",
                ad_link: adLink || "no_link",
                // 使用 event_callback 确保 GA 已经处理了该事件
                event_callback: () => {
                    resolve(true);
                }
            });

            // 设置一个安全超时（例如 500ms），防止因为网络问题导致页面卡死不跳转
            setTimeout(() => resolve(false), 500);
        });
    };

    /**
     * 追踪抽中奖品事件
     */
    const drawResult = (adId: string, adTitle: string, adLink: string) => {
        event('draw_result', {
            // ad_id: adId || "unknown_id",
            ad_title: adTitle || "unknown_title",
            ad_link: adLink || "no_link",
        });
    };

    /**
     * 追踪多语言切换行为
     */
    const trackLangChange = (from: string, to: string) => {
        event('language_change', {
            from_lang: from,
            to_lang: to
        });
    };

    return { initUser, trackAdClick, trackLangChange, drawResult, event };
}
