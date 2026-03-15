import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router';
import utils from "@/common/js/utils";
import vConsole from "vconsole";
import i18n from './i18n';
import VueGtag from 'vue-gtag-next';
import "@nutui/nutui/dist/style.css";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueGtag, {
    property: {
        id: 'G-0013J463MH', // 替换为你的 GA4 ID
        params: {
            // 解决 Telegram WebView 跨域或嵌入式环境下的 Cookie 问题
            cookie_flags: 'SameSite=None;Secure',
            // 开启增强型测量
            send_page_view: true
        }
    }
});
app.mount('#app');

if (utils.getHashQueryString('vconsole') === 'true') {
    new vConsole();
}

function setRem() {
    const width = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = (width / 10) + 'px';
}
window.addEventListener('resize', setRem);
setRem();
