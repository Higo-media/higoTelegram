const utils = {
    // 获取url参数
    getHashQueryString(name:any) {
        let reg = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)") as any;
        return decodeURIComponent((reg.exec(window.location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
    },
};

export default utils;
