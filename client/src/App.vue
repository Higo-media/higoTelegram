<script setup lang="ts">
import { useLoadingStore } from '@/store/loading';
import FullLoading from '@/components/FullLoading.vue';
const loadingStore = useLoadingStore();
</script>

<template>
    <FullLoading :visible="loadingStore.isVisible" />
    <router-view />
</template>

<style scoped>
</style>
