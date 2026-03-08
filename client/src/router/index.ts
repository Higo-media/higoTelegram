import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: 'turntable'
    },
    {
        path: '/turntable',
        name: 'Home',
        component: () => import('../views/HigoH5/index.vue') // 记得在 src/views 文件夹下创建该文件
    },
];

const router = createRouter({
    history: createWebHistory(), // 默认使用 HTML5 历史模式，配合 Vercel Rewrite 使用效果最佳
    routes
});
router.beforeEach((to, _from, next) => {
    // 当用户在路由跳转时，可以控制 Telegram 的主按钮显示与否
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
        if (to.path !== '/') {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    }
    next();
});

export default router;
