<template>
    <nut-popover v-model:visible="showOptions" :list="menuItems" location="bottom-end" @choose="onSelect">
        <template #reference>
            <nut-button plain type="info" size="small">{{currentLangName}} </nut-button>
        </template>
    </nut-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAnalytics } from '@/utils/analytics';
const { trackLangChange } = useAnalytics();
const { locale, t } = useI18n();
const showOptions = ref(false);

const menuItems = [
    { name: '简体中文', value: 'zh-hans' },
    { name: 'English', value: 'en' },
    { name: 'Português (Brasil)', value: 'pt-br' }, // 巴西葡萄牙语
    { name: 'Bahasa Indonesia', value: 'id' },     // 印尼语
    { name: 'اردو', value: 'ur' }                 // 乌尔都语（巴基斯坦）
];

const currentLangName = computed(() =>
    menuItems.find(item => item.value === locale.value)?.name || 'English'
);
console.log(currentLangName);
const onSelect = (item: any) => {
    trackLangChange(locale.value, item.value)
    locale.value = item.value;
    // 可选：存入 localStorage 保证刷新后不丢失手动选择
    localStorage.setItem('user_lang', item.value);
    emit('onSelect', item);
};
const emit = defineEmits(['onSelect'])

</script>
