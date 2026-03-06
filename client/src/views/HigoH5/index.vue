<script setup lang="ts">
const screenWidth = ref(window.innerWidth);
</script>

<template>
    <nut-button type="primary">Primary</nut-button>
    <nut-button type="primary">这是我的第一个 NutUI 按钮</nut-button>
    <p>当前屏幕宽度: {{ screenWidth }}px</p>
</template>

<style scoped>

</style>
