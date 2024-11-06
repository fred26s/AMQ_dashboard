<script setup>
import { useFetch } from '../http/api'
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
let priceStopProfit = ref('')
let priceStopLoss = ref('')

// 开仓价
let priceOpend = ref('')
// 触发价
const priceTrigger = ref('')
// 取消价
const priceCancels = ref('')
// 是否开启取消价
const enablePriceCancels = ref(false)
// 是否开启渔网下单(区间批量下单)
const enableFishNet = ref(false)
// 买入状态
const boughtStatus = ref('')

const toast = ref(null)
// 倍率
let ratioOpen = ref(1)

// 提醒开关
let enableTips = ref(false)
// 提醒价
let tipsPrice = ref('')

// 挂单量
let openOrders = ref(0)

// 是否已经买入
let isBought = ref(false)

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/shadow/moon', {
    method: 'post',
    data
  })
  dataInfo.value = result.value

  if (!err) {
    toast.value.open({ type: 'alert-success', msg: 'Refresh' })
  } else {
    toast.value.open({ type: 'alert-error', msg: err })
  }

  const {
    enableTips: enableTipsTmp,
    tipsPrice: tipsPriceTmp,
    openOrders: openOrdersTmp,
    ratio,
    enableTrade,
    enableSell,
    enableBuy,
    stopProfit,
    stopLoss,
    priceOpen,
    triggerPrice,
    priceCancel,
    enablePriceCancel,
    enableFishnetBuy,
    bought
  } = result.value

  console.log(stopProfit)

  triggerTrade.value = enableTrade
  triggerBuy.value = enableBuy
  triggerSell.value = enableSell

  priceStopProfit.value = stopProfit
  priceStopLoss.value = stopLoss
  priceOpend.value = priceOpen
  ratioOpen.value = ratio
  priceTrigger.value = triggerPrice
  priceCancels.value = priceCancel
  enablePriceCancels.value = enablePriceCancel
  enableFishNet.value = enableFishnetBuy
  boughtStatus.value = bought ? '已开仓' : '未开仓'
  isBought.value = bought

  enableTips.value = enableTipsTmp
  tipsPrice.value = tipsPriceTmp

  openOrders.value = openOrdersTmp.length || 0
}

const setData = async () => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    enableTips: enableTips.value,
    tipsPrice: tipsPrice.value,
    enableTrade: triggerTrade.value,
    enableBuy: triggerBuy.value,
    enableSell: triggerSell.value,
    stopProfit: priceStopProfit.value,
    stopLoss: priceStopLoss.value,
    priceOpen: priceOpend.value,
    ratio: ratioOpen.value,
    enablePriceCancel: enablePriceCancels.value,
    enableFishnetBuy: enableFishNet.value,
    priceCancel: priceCancels.value,
    triggerPrice: priceTrigger.value
  }
  const { result, err } = await useFetch('/shadow/sun', {
    method: 'post',
    data
  })

  if (!err) {
    toast.value.open({ type: 'alert-success', msg: 'Submit' })
  } else {
    toast.value.open({ type: 'alert-error', msg: err })
  }
}

onBeforeMount(async () => {
  fetchData()
})
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <div class="flex justify-between">
      <toggle
        class=""
        msgPre="真实交易"
        msgNext=""
        type=""
        size="toggle-lg"
        v-model="triggerTrade"
      ></toggle>
      <button class="btn btn-circle btn-accent mr-5" @click="fetchData">刷新</button>
    </div>

    <div class="indicator w-full mt-5">
      <div class="indicator-item indicator-bottom indicator-center w-20">
        <button class="btn btn-primary w-20" @click="setData">Apply</button>
      </div>

      <div :class="['card', 'border', 'w-full']">
        <div class="card-body">
          <div class="flex flex-row w-full lg:flex-row text-xs justify-between flex-wrap">
            <div class="badge badge-secondary mb-2 font-bold">NO FOMO</div>
            <div class="badge badge-secondary mb-2 font-bold">绝对自信</div>
            <div class="badge badge-secondary mb-2 font-bold">买定离手</div>
            <div class="badge badge-secondary mb-2 font-bold">仓位清心</div>
            <div class="badge badge-secondary mb-2 font-bold">加仓谨慎</div>
            <div class="badge badge-secondary mb-2 font-bold">顺应宏观</div>
            <div class="badge badge-secondary mb-2 font-bold">别猜方向</div>
          </div>
          <div  class="divider"></div>
          <div v-if="isBought" class="flex flex-col w-full lg:flex-row text-xs">
            <div class="tooltip" :data-tip="`${openOrders}/10`">
              <span class="mr-2">挂单量</span>
              <progress class="progress w-56" :value="openOrders" max="10"></progress>
            </div>
          </div>
          <div v-if="isBought" class="divider"></div>

          <h2 class="card-title flex justify-between">
            <div>指令</div>
            <div v-if="isBought" class="badge badge-outline badge-success">
              {{ boughtStatus }}
            </div>
            <div v-else class="badge badge-outline badge-neutral">{{ boughtStatus }}</div>
          </h2>
          <div class="flex flex-col w-full lg:flex-row">
            <div
              class="grid flex-grow h-auto py-5 card bg-base-300 rounded-box place-items-center card-bordered"
              :class="[triggerTrade ? 'border-primary' : '']"
            >
              <div class="flex items-center">
                <toggle
                  class="mr-5"
                  msgPre="Buy"
                  msgNext="Signal"
                  type="toggle-success"
                  v-model="triggerBuy"
                ></toggle>
                <div class="flex flex-col">
                  <textBar msgPre="触发价" size="sm" v-model="priceTrigger"></textBar>
                  <textBar msgPre="挂单价" size="sm" v-model="priceOpend" class="mt-5"></textBar>
                  <textBar msgPre="取消价" size="sm" v-model="priceCancels" class="mt-5"></textBar>
                  <textBar
                    msgPre="杠杆"
                    size="sm"
                    v-model.number="ratioOpen"
                    class="mt-5"
                  ></textBar>

                  <div class="divider lg:divider-horizontal">功能</div>
                  <toggle
                    class=""
                    msgPre="渔网下单🐟"
                    msgNext="(区间批量订单)"
                    type="toggle-info"
                    v-model="enableFishNet"
                  ></toggle>

                  <div class="divider lg:divider-horizontal">非必要</div>
                  <toggle
                    class=""
                    msgPre="监测开关👀"
                    msgNext="(系统内部逻辑)"
                    type="toggle-info"
                    v-model="enablePriceCancels"
                  ></toggle>
                </div>
              </div>
            </div>

            <div class="divider lg:divider-horizontal">OR</div>

            <div
              class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center card-bordered"
              :class="[triggerTrade ? 'border-primary-focus' : '']"
            >
              <div class="flex items-center mt-3">
                <toggle
                  class="mr-5"
                  msgPre="Sell"
                  msgNext="Signal"
                  type="toggle-error"
                  v-model="triggerSell"
                ></toggle>
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

    <div class="indicator w-full mt-5">
      <div :class="['card', 'border', 'w-full']">
        <div class="card-body">
          <h2 class="card-title">提醒</h2>
          <div class="flex flex-col w-full lg:flex-row">
            <div
              class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center card-bordered"
              :class="[triggerTrade ? 'border-primary' : '']"
            >
              <div class="flex items-center">
                <toggle
                  class="mr-5"
                  msgPre="Buy"
                  msgNext="Signal"
                  type="toggle-info"
                  v-model="enableTips"
                ></toggle>
                <div class="flex flex-col">
                  <textBar msgPre="提醒价" size="sm" v-model="tipsPrice"></textBar>
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
