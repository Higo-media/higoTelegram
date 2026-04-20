import axios from 'axios';

/**
 * 转发 Postback 请求到外部广告平台
 * @param params 包含 aid, tid, visitor_id 的对象
 */
export const sendPostbackProxy = async (params: { aid: string; tid: string; visitor_id: string }) => {
    const postbackBase = "http://ad.propellerads.com/conversion.php";

    try {
        const response = await axios.get(postbackBase, {
            params,
            timeout: 10000 // 设置超时保护
        });

        console.log('channelMiddleService.responseStatus:', response.status)
        return response.data;
    } catch (error: any) {
        // 抛出错误供 Controller 捕获
        throw new Error(`External API Error: ${error.message}`);
    }
};
