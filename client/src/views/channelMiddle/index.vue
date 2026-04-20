<template>
</template>
<script setup lang="ts">
import "@nutui/nutui-bingo/dist/style.css";
import axios from "@/api/request";
import utils from "@/common/js/utils";


let start = utils.getHashQueryString('start')
let clickId = start.split('_')?.[1]
console.log('clickId:',clickId);
sendPostback(clickId)
sendPostback(clickId, '3868279','147545')

async function sendPostback(clickId, aid = '3811610', tid='142606') {
    console.log('sendPostback', clickId)
    const postbackBase = "/channelMiddle/postback";
    // const postbackBase = "http://ad.propellerads.com/conversion.php";
    const params = {
        aid,
        tid,
        visitor_id: clickId // 之前从 start 参数里拿到的值
    };
    try {
        const response = await axios.get(postbackBase, {
            params,
            skipLoading: true
        });
        console.log('response:',response);
        if (response) {
            location.replace('https://t.me/HigoGameCenterChinese')
            console.log('Postback 成功回传');
        }
    } catch (error) {
        console.error('回传失败:', error.message);
    }
}



</script>
<style scoped lang="scss">
</style>
