<script setup>
import { useFetch } from "../http/api"
import { onBeforeMount, ref, computed, toValue, watchEffect, unref, watch } from 'vue'
import toggle from '../components/toggle.vue'
import textBar from '../components/text.vue'
import toastBar from '../components/toast.vue'

let dataInfo = ref({})

// 交易模块
let triggerTrade = ref(false)

// 开仓信号
let triggerBuy = ref(false)
// 平仓信号
let triggerSell = ref(false)

// 止盈/止损价
let priceStopProfit = ref("")
let priceStopLoss = ref("")

// 开仓价
let priceOpend = ref("")

const toast = ref(null)
// 倍率
let ratioOpen = ref(1)


const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/shadow/moon', {
    method: 'post',
    data
  })
  dataInfo.value = result.value;
  
  if (!err) {
    toast.value.open({type: 'alert-success', msg: 'Refresh'})
  } else {
    toast.value.open({type: 'alert-error', msg: err})
  }

  const {
    ratio,
    enableTrade,
    enableSell,
    enableBuy,
    stopProfit,
    stopLoss,
    priceOpen
  } = result.value;

  console.log(stopProfit)

  triggerTrade.value = enableTrade;
  triggerBuy.value = enableBuy;
  triggerSell.value = enableSell;

  priceStopProfit.value = stopProfit;
  priceStopLoss.value = stopLoss;
  priceOpend.value = priceOpen;
  ratioOpen.value = ratio;
}

const setData = async () => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    enableTrade: triggerTrade.value,
    enableBuy: triggerBuy.value,
    enableSell: triggerSell.value,
    stopProfit: priceStopProfit.value,
    stopLoss: priceStopLoss.value,
    priceOpen: priceOpend.value,
    ratio: ratioOpen.value,
  }
  const { result, err } = await useFetch('/shadow/sun', {
    method: 'post',
    data
  })

  if (!err) {
    toast.value.open({type: 'alert-success', msg: 'Submit'})
  } else {
    toast.value.open({type: 'alert-error', msg: err})
  }

}

onBeforeMount(async () => {
  fetchData()
})


</script>

<template>
  <div class="container mx-auto flex flex-col">
    <div class="flex justify-between">
      <toggle class="" msgPre="真实交易" msgNext="" type="" size="toggle-lg" v-model="triggerTrade"></toggle>
      <button class="btn btn-circle btn-accent mr-5" @click="fetchData">刷新</button>
    </div>

    <div class="indicator w-full mt-5">
      <div class="indicator-item indicator-bottom indicator-center w-20">
        <button class="btn btn-primary w-20" @click="setData">Apply</button>
      </div>

      <div :class="['card', 'border', 'w-full']">
        <div class="card-body">
          <h2 class="card-title">指令</h2>
          <div class="flex flex-col w-full lg:flex-row">
            <div class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center card-bordered" :class="[triggerTrade? 'border-primary':'']">
              <div class="flex items-center">
                <toggle class="mr-5" msgPre="Buy" msgNext="Signal" type="toggle-success" v-model="triggerBuy"></toggle>
                <div class="flex flex-col">
                  <textBar msgPre="买入价" size="sm" v-model="priceOpend"></textBar>
                  <textBar msgPre="杠杆" size="sm" v-model.number="ratioOpen" class="mt-5"></textBar>
                </div>
              </div>
            </div>

            <div class="divider lg:divider-horizontal">OR</div>

            <div class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center card-bordered" :class="[triggerTrade? 'border-primary-focus':'']">
              <div class="flex items-center mt-3">
                <toggle class="mr-5" msgPre="Sell" msgNext="Signal" type="toggle-error" v-model="triggerSell"></toggle>
                <div class="flex flex-col">
                  <textBar msgPre="止损价" v-model="priceStopLoss"></textBar>
                  <textBar class="mt-5" msgPre="止盈价" v-model="priceStopProfit"></textBar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <toastBar ref="toast"></toastBar>

    <div class="flex justify-start mt-3">
      <!-- <button class="btn btn-primary w-1/2">发布</button> -->
    </div>
  </div>
</template>
