<script setup lang="ts">
import { useLoadingStore } from '@/store/loading';
import FullLoading from '@/components/FullLoading.vue';
import { onMounted } from 'vue';
import { useAnalytics } from '@/utils/analytics';
// import "@nutui/nutui/dist/style.css";

const { initUser } = useAnalytics();

const loadingStore = useLoadingStore();
onMounted(() => {
    // 从全局 window 对象获取 Telegram WebApp 数据
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
        console.log('tg?.initDataUnsafe?.user:',tg?.initDataUnsafe?.user);
        initUser(tg.initDataUnsafe.user);
    }
});
</script>

<template>
    <FullLoading :visible="loadingStore.isVisible" />
    <router-view />
</template>

<style scoped>
</style>
