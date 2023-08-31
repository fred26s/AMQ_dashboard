<script setup>
import { onBeforeMount, ref, computed, toValue, watchEffect, unref } from 'vue'
import { useFetch } from "../http/api"


import stats from '../components/stats.vue'
import statsCard from '../components/statsCard.vue'
import chartA from '../components/chartA.vue'
import chartB from '../components/chartB.vue'
import articleBar from '../components/articleBar.vue'

import { useCounterStore } from "../stores/index"
const counterStore = useCounterStore()
// 使用 counterStore 中的状态和方法

let dataStats = ref({})

const fetchData = async (type) => {
  const data = {
    type
  }
  const { result, err } = await useFetch('/summary/board', {
    method: 'post',
    data
  })
  dataStats.value = result.value;
}

// 切换 type 后查询面板数据
watchEffect(() => {
  fetchData(counterStore.pageType)
})

onBeforeMount(async () => {
  fetchData(counterStore.pageType)
})

// 资产
const capitalValue = computed(() => toValue(dataStats)?.capital?.end || 0)
const totalProfit = computed(() => toValue(dataStats)?.totalProfitLoss?.amt || 0)
const totalProfitPct = computed(() => `${toValue(dataStats)?.totalProfitLoss?.pct}%` || `0%`)
const tradeTimes = computed(() => toValue(dataStats)?.tradeCount?.total || 0)
const tradeTimesWon = computed(() => toValue(dataStats)?.tradeCount?.won || 0)
const tradeTimesLost = computed(() => toValue(dataStats)?.tradeCount?.lost || 0)
const tradeTimesTips = computed(() => `won: ${toValue(tradeTimesWon)}; lost: ${toValue(tradeTimesLost)}`)
const tradePctWon = computed(() => `${Number((toValue(tradeTimesWon) / toValue(tradeTimes)) * 100).toFixed(2)}%`)

// chart data
const tradesList = computed(() => toValue(dataStats)?.trades || []);
console.log((tradesList))
console.log('toValue(dataStats)')
const chartXdata = computed(() => toValue(tradesList).map(e => new Date(e.sell.timestamp).toLocaleString()))
const chartYdata1 = computed(() => toValue(tradesList).map(e => e.sell.revenue))
const chartYdata2 = computed(() => toValue(tradesList).map(e => e.sell.price))


</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap mt-3 md:justify-between md:flex-nowrap">
      <stats class="flex-none" label="账户" :value="capitalValue" tips="持仓状态"></stats>
      <!-- <statsCard label="平均持仓时间" value="" tips=""></statsCard> -->
      <statsCard label="实际盈亏" :value="totalProfit" :tips="totalProfitPct"></statsCard>
      <statsCard label="胜率" :value="tradePctWon" tips=""></statsCard>
      <statsCard label="交易次数" :value="tradeTimes" :tips="tradeTimesTips"></statsCard>
    </div>
    <div class="flex mt-3">
      <!-- <articleBar></articleBar> -->
    </div>
    <div class="flex flex-col space-y-5 space-x-2 md:flex-row mt-3">
      <div class="h-96 md:w-1/2">
        <chartB :xdata="chartXdata" :data1="chartYdata1" :data2="chartYdata2"></chartB>
      </div>
      <!-- <chartA></chartA> -->
    </div>
    <!-- <button class="btn" @click="handleSkin" data-toggle-theme="dark,light" data-act-class="ACTIVECLASS">change</button>
    <button class="btn" @click="handleSkin" data-set-theme="cmyk">change</button>
    <button class="btn" @click="handleSkin" data-set-theme="dark">change</button> -->

  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
