<template>
    <nut-overlay v-model:visible="props.visible" :close-on-click-overlay="false">
        <div class="full-loading-wrapper">
            <div class="loading-content">
                <nut-animate type="loop" action="rotate">
                    <Loading color="#ffffff" width="30px" height="30px" />
                </nut-animate>
                <div class="loading-text">{{ $t('common.loading') }}</div>
            </div>
        </div>
    </nut-overlay>
</template>

<script setup lang="ts">
import { Loading } from '@nutui/icons-vue';
import {watch, ref} from "vue";
/**
 * 使用 defineProps 接收父组件传递的显示状态
 * visible: 控制加载层是否显示
 */
const props = defineProps<{
    visible: boolean
}>();
const newVisible = ref<boolean>(false);

/*watch(props.visible,(val) => {
    newVisible.value = val
})*/
</script>

<style scoped>
.full-loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 32px;

    /* 毛玻璃效果 */
    background: rgba(255, 255, 255, 0.15); /* 使用更通透的白色遮罩 */
    backdrop-filter: blur(12px);          /* 背景模糊 */
    -webkit-backdrop-filter: blur(12px);  /* Safari 兼容 */

    border: 1px solid rgba(255, 255, 255, 0.2); /* 淡淡的边框，增强质感 */
    border-radius: 20px;                  /* 圆角更圆润 */
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); /* 轻微投影 */
}

.loading-text {
    /* 使用稍显亮色的文字 */
    color: #ffffff;
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
</style>
