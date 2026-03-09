<template>
    <div class="container">
        <img src="./assets/images/logo1.png" alt="" class="logo">
        <div class="title">
            <p>Higo</p>
            <p>Game Club</p>
        </div>
        <div class="turntable-body">
            <TurnTable
                class="turntable"
                ref="turntable"
                :width="luckWidth"
                :height="luckheight"
                :prize-list="prizeList"
                :turns-number="turnsNumber"
                :turns-time="turnsTime"
                :prize-index="prizeIndex"
                :style-opt="styleOpt"
                :pointer-style="pointerStyle"
                @start-turns="startTurns"
                @end-turns="endTurns"
            >
            </TurnTable>
            <div class="pointer-text">抽奖</div>
        </div>
    </div>


</template>
<script setup lang="ts">
import {onMounted} from "vue";
import { TurnTable } from "@nutui/nutui-bingo";
import "@nutui/nutui-bingo/dist/style.css";
import { ref, reactive } from "vue";
// 转盘大小
const luckWidth = ref("78%");
const luckheight = ref("78%");
// 转盘指针图片样式
const pointerStyle = {
    width: "2rem",
    height: "2rem",
    backgroundImage: `url("${new URL("./assets/images/pointer.png", import.meta.url).href}")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
};
// 转盘上要展示的奖品数据
const prizeList = ref([
    {
        id: "xiaomi",
        prizeName: "小米手机",
        prizeImg: new URL("./assets/images/prize1.png", import.meta.url).href
    },
    {
        id: "blue",
        prizeColor: "rgb(251, 219, 216)",
        prizeName: "蓝牙耳机",
        prizeImg: new URL("./assets/images/prize2.png", import.meta.url).href
    },
    {
        id: "apple",
        prizeName: "apple watch",
        prizeImg: new URL("./assets/images/prize3.png", import.meta.url).href
    },
    {
        id: "fruit",
        prizeColor: "rgba(246, 142, 46, 0.5)",
        prizeName: "迪士尼苹果",
        prizeImg: new URL("./assets/images/prize4.png", import.meta.url).href
    },
    {
        id: "fish",
        prizeName: "海鲜套餐",
        prizeImg: new URL("./assets/images/prize5.png", import.meta.url).href
    },
    {
        id: "thanks",
        prizeName: "谢谢参与",
        prizeImg: new URL("./assets/images/prize6.png", import.meta.url).href
    },
]);
// 转动圈数
const turnsNumber = ref(5);
// 转动需要持续的时间(秒)
const turnsTime = ref(5);
// 转盘样式的选项
const styleOpt = reactive({
    // 转盘中每一块扇形的背景色,根据奖品的index来取每一块的对应颜色
    prizeBgColors: [
        "rgb(255, 231, 149)",
        "rgb(255, 247, 223)",
        "rgb(255, 231, 149)",
        "rgb(255, 247, 223)",
        "rgb(255, 231, 149)",
        "rgb(255, 247, 223)",
    ],
    // 每一个扇形的外边框颜色
    borderColor: "#ff9800",
});
// 中奖的奖品的index(此数据可根据后台返回的值重新赋值)
const prizeIndex = ref(-1);
const turntable = ref<any>(null);
const startTurns = () => {
    const index = Math.floor(Math.random() * prizeList.value.length);
    prizeIndex.value = index;
    turntable.value.rotateTurn();
};
const endTurns = () => {
    console.log("中奖了");
};

onMounted(() => {
    console.log('(window as any).Telegram.WebApp:',(window as any).Telegram?.WebApp);
})

</script>
<style scoped lang="scss">
@use "./assets/css/index.scss";
</style>
