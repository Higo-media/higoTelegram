<template>
    <div class="container" :style="{ background: `${themeConfig.bgColor} url('${themeConfig.bgImage}') no-repeat top/contain`, backgroundSize: '100% 100%' }">
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

        <PrizePopup
            v-model="showPopup"
            :prize-name="currentPrize.prizeName"
            :prize-img="currentPrize.prizeImg"
            :ad-link="currentPrize.adLink"
            :theme="currentTheme"
            @claim="claim"
        />
    </div>


</template>
<script setup lang="ts">
import {onMounted, computed} from "vue";
import { TurnTable } from "@nutui/nutui-bingo";
import "@nutui/nutui-bingo/dist/style.css";
import { ref, reactive } from "vue";
import axios from "@/api/request";
import { showToast } from '@nutui/nutui';
import { useRoute } from 'vue-router';
import LangSwitcher from '@/components/LangSwitcher.vue'
import PrizePopup from '@/components/PrizePopup.vue'
import { useAnalytics } from '@/utils/analytics';
const {trackAdClick, drawResult, event} = useAnalytics()

const route = useRoute();

// 主题配置
type ThemeType = 'default' | 'pt-br';

interface ThemeConfig {
    bgImage: string;
    bgColor: string;
    popupBg: string;
    name: string;
}

const themeConfigs: Record<ThemeType, ThemeConfig> = {
    'default': {
        bgImage: new URL("./assets/images/bg.png", import.meta.url).href,
        bgColor: '#B71C1C',
        popupBg: 'linear-gradient(135deg, #d32f2f 0%, #e53935 30%, #f44336 60%, #ff5252 100%)',
        name: 'default'
    },
    'pt-br': {
        bgImage: new URL("./assets/images/bg-pt-br.png", import.meta.url).href,
        bgColor: '#006B3F',
        popupBg: 'linear-gradient(135deg, #006B3F 0%, #009739 30%, #00A651 60%, #00C853 100%)',
        name: 'pt-br'
    }
};

// 从 URL 参数获取主题
const currentTheme = computed<ThemeType>(() => {
    const theme = (route.query.theme as ThemeType) || 'default';
    return theme in themeConfigs ? theme : 'default';
});

const themeConfig = computed(() => themeConfigs[currentTheme.value]);

// 转盘大小

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
const showPopup = ref(false);
const currentPrize = ref<any>({});

// 点击抽奖
const startTurns = (point) => {
    event(point);
    computePrizeIndex()
    turntable.value.rotateTurn();
};

const endTurns = () => {
    const prizeInfo = prizeList.value[prizeIndex.value]
    drawResult(prizeInfo.id,prizeInfo.prizeName,prizeInfo.adLink)
    currentPrize.value = prizeInfo
    showPopup.value = true
};

onMounted(() => {
    getAdvList()
})

async function claim() {
    if (currentPrize.value.adLink) {
        await trackAdClick(currentPrize.value.id,currentPrize.value.prizeName,currentPrize.value.adLink)
        // window.open(props.adLink, '_blank');
        location.href = currentPrize.value.adLink
    }
}

function getAdvList() {
    /*if (sessionStorage.getItem('advList')) {
        formatPrizeList(JSON.parse(sessionStorage.getItem('advList')))
        return
    }*/
    axios.get('/adv/list').then(res => {
        console.log(res);
        sessionStorage.setItem('advList', JSON.stringify(res))
        formatPrizeList(res)
    })
}

function formatPrizeList (res) {
    console.log('res:',res);
    // 过滤掉未启用的广告
    const activeAds = res?.filter(item => item.is_active !== false) || [];
    console.log('activeAds:',activeAds);
    activeAds.forEach((item,index) => {
        prizeList.value[index] = {
            id: item.id,
            prizeName: item.name,
            adLink: item.link,
            probability: item.probability,
            prizeImg: item.imgLink || new URL(`./assets/images/prize${index+1}.png`, import.meta.url).href
        }
        // 奇数和偶数使用不同的颜色
        if (index % 2 === 0) {
            // 偶数（淡薄荷绿）
            prizeList.value[index].prizeColor = "rgb(255, 247, 223)"
        } else {
            // 奇数（淡薰衣草紫）
            prizeList.value[index].prizeColor = "rgb(255, 231, 149)"
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
