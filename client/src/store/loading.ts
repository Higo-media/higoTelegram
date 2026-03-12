import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', () => {
    const activeRequests = ref(0); // 使用计数器，处理多个并发请求
    const isVisible = ref(false);

    const show = () => {
        activeRequests.value++;
        isVisible.value = true;
    };

    const hide = () => {
        activeRequests.value = Math.max(0, activeRequests.value - 1);
        if (activeRequests.value === 0) {
            isVisible.value = false;
        }
    };

    return { isVisible, show, hide };
});
