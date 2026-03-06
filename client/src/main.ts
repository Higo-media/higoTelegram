import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');

function setRem() {
    const width = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = (width / 10) + 'px';
}
window.addEventListener('resize', setRem);
setRem();
