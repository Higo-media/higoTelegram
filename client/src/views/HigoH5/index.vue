<template>
    <div class="container">
        <img src="./assets/images/logo1.png" alt="" class="logo">
        <LangSwitcher @onSelect="getAdvList"></LangSwitcher>
        <div class="title">
            <p>Higo</p>
            <p>Game Club</p>
        </div>
        <div class="turntable-body">
            <TurnTable
                v-if="prizeList.length"
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
                @start-turns="startTurns('go_btn')"
                @end-turns="endTurns"
            >
            </TurnTable>
            <div class="pointer-text">GO</div>
        </div>

        <div class="main-btn" @click="startTurns('draw_btn')">
            {{$t('btnText.mainBtn')}}
            <img src="./assets/images/ic-hand.png" alt="" class="pointer">
        </div>
    </div>


</template>
<script setup lang="ts">
import {onMounted} from "vue";
import { TurnTable } from "@nutui/nutui-bingo";
import "@nutui/nutui-bingo/dist/style.css";
import { ref, reactive } from "vue";
import axios from "@/api/request";
import { showToast } from '@nutui/nutui';
import LangSwitcher from '@/components/LangSwitcher.vue'
import { useAnalytics } from '@/utils/analytics';
const {trackAdClick, drawResult, event} = useAnalytics()

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
const prizeList = ref([]);
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

// 点击抽奖
const startTurns = (point) => {
    event(point);
    computePrizeIndex()
    turntable.value.rotateTurn();
};

const endTurns = () => {
    const prizeInfo = prizeList.value[prizeIndex.value]
    trackAdClick(prizeInfo.id,prizeInfo.prizeName,prizeInfo.adLink)
    drawResult(prizeInfo.id,prizeInfo.prizeName,prizeInfo.adLink)
    console.log(prizeInfo);
    showToast.text(`恭喜抽中${prizeInfo.prizeName}`);
};

onMounted(() => {
    getAdvList()
})

function getAdvList() {
    /*if (sessionStorage.getItem('advList')) {
        formatPrizeList(JSON.parse(sessionStorage.getItem('advList')))
        return
    }*/
    axios.get('/adv/list').then(res => {
        sessionStorage.setItem('advList', JSON.stringify(res))
        formatPrizeList(res)
    })
}

function formatPrizeList (res) {
    console.log(res);
    res.forEach((item,index) => {
        prizeList.value[index] = {
            id: item.id,
            prizeName: item.name,
            adLink: item.link,
            probability: item.probability,
            prizeImg: new URL(`./assets/images/prize${index+1}.png`, import.meta.url).href
        }
        if (index === 1) {
            prizeList.value[index].prizeColor = "rgb(251, 219, 216)"
        }
        if (index === 3) {
            prizeList.value[index].prizeColor = "rgba(246, 142, 46, 0.5)"
        }
    })
    console.log(prizeList.value);
}

// 根据中奖概率计算中奖的index(轮盘赌算法）
function computePrizeIndex () {
    let random = Math.round(Math.random() * 100)/100
    let prev = 0
    prizeList.value.find((item,index, array) => {
        prev += item.probability
        if (prev > random || index === array.length-1) {
            console.log(item);
            prizeIndex.value = index;
            return true
        }
    })
}


</script>
<style scoped lang="scss">
@use "./assets/css/index.scss";
</style>
