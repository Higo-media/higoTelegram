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
    padding: 24px;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 12px;
}

.loading-text {
    color: #ffffff;
    margin-top: 12px;
    font-size: 14px;
}
</style>
