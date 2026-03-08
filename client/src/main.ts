import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router';
import utils from "@/common/js/utils";
import vConsole from "vconsole";
const app = createApp(App);

app.use(createPinia());
app.use(router);
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
