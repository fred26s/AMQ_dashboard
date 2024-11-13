<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useFetch } from '../http/api'
import chartC from '../components/chartC.vue'

const expandedCards = ref([])

const indicators = ref([
  {
    id: 1,
    name: 'BTC-ETF',
    value: 65,
    thresholds: [0, 0],
    linesData: {
      xData: [],
      yData: []
    },
    description: '比特币现货ETF流量',
    additionalData: {}
  },
  {
    id: 2,
    name: 'BTC-总持仓合约',
    value: 66,
    thresholds: [0, 0],
    linesData: {
      xData: [],
      yData: []
    },
    description: '比特币未平仓合约量',
    additionalData: {}
  },
  {
    id: 3,
    name: 'BTC-多空比',
    value: 66,
    thresholds: [1, 1],
    linesData: {
      xData: [],
      yData: []
    },
    description: '比特币多空比',
    additionalData: {}
  },
  {
    id: 4,
    name: 'BTC-资金费率',
    value: 66,
    thresholds: [0, 0],
    linesData: {
      xData: [],
      yData: []
    },
    description: '比特币资金费率',
    additionalData: {}
  }
  // {
  //   id: 9,
  //   name: 'Volume',
  //   value: 3500000,
  //   thresholds: [1000000, 4000000],
  //   description: 'Volume represents the total number of shares traded during a given time period.',
  //   additionalData: { Average: 2500000, High: 4500000, Low: 500000 }
  // }
])

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/pulse/moon', {
    method: 'get',
    data
  })
  let { btcETF, openInterestHist, globalLongShortAccountRatio, fundingRate } = result.value

  // * BTC-ETF
  // 缩略数据
  indicators.value[0].value = btcETF[0].total
  indicators.value[0].date = btcETF[0].date
  // 详情数据
  const chartsData = btcETF.reverse() // 反转图表数据的顺序，由近到远
  indicators.value[0].linesData.xData = chartsData.map((item) => item.date)
  indicators.value[0].linesData.yData = chartsData.map((item) => item.total)

  // * 未平仓合约
  // 缩略数据
  indicators.value[1].value = openInterestHist[0].sumOpenInterestValue
  // 详情数据
  const openInterestHistChart = openInterestHist.reverse() // 反转图表数据的顺序，由近到远
  indicators.value[1].linesData.xData = openInterestHistChart.map((item) =>
    new Date(item.timestamp).toLocaleString()
  )
  indicators.value[1].linesData.yData = openInterestHistChart.map((item) => item.sumOpenInterestValue)

  // * 多空比
  // 缩略数据
  indicators.value[2].value =
    globalLongShortAccountRatio[globalLongShortAccountRatio.length - 1].longShortRatio
  // 详情数据
  indicators.value[2].linesData.xData = globalLongShortAccountRatio.map((item) =>
    new Date(item.timestamp).toLocaleString()
  )
  indicators.value[2].linesData.yData = globalLongShortAccountRatio.map(
    (item) => item.longShortRatio
  )

  // * 资金费率
  // 缩略数据
  indicators.value[3].value = `${fundingRate[fundingRate.length - 1].fundingRate * 100}`
  // 详情数据
  indicators.value[3].linesData.xData = fundingRate.map((item) =>
    new Date(item.fundingTime).toLocaleString()
  )
  indicators.value[3].linesData.yData = fundingRate.map((item) => item.fundingRate)
}

const activeSignals = computed(() => {
  return indicators.value.filter(
    (indicator) =>
      indicator.value >= indicator.thresholds[1] || indicator.value <= indicator.thresholds[0]
  )
})

const sortedIndicators = computed(() => {
  return [...indicators.value].sort((a, b) => {
    const aExpanded = expandedCards.value.includes(a.id)
    const bExpanded = expandedCards.value.includes(b.id)
    if (aExpanded && !bExpanded) return -1
    if (!aExpanded && bExpanded) return 1
    return 0
  })
})

const getValueColor = (value, lowerThreshold, upperThreshold) => {
  if (value < lowerThreshold) return 'text-red-400'
  if (value > upperThreshold) return 'text-green-400'
  return 'text-gray-100'
}

const formatValue = (value) => {
  // 非数字判断，若是字符串，则转为数字； 若无法转为数字，则返回原value
  if (typeof value !== 'number') {
    try {
      value = Number(value)
    } catch (error) {
      return value
    }
  }
  if (Math.abs(value) >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B'
  } else if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toFixed(2)
}

const toggleCardExpansion = (id) => {
  const index = expandedCards.value.indexOf(id)
  if (index === -1) {
    expandedCards.value.push(id)
  } else {
    expandedCards.value.splice(index, 1)
  }
}

onBeforeMount(async () => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 p-4 text-gray-100">
    <h1 class="text-2xl font-bold mb-5 text-center text-gray-100 relative">
      Trading Pulse🥰
      <button class="btn btn-circle btn-accent mr-5 absolute right-0" @click="fetchData">
        刷新
      </button>
    </h1>

    <!-- Trading Signals Panel -->
    <div class="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <h2 class="text-xl font-semibold mb-2">Trading Signals</h2>
      <div
        v-if="activeSignals.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
      >
        <div
          v-for="signal in activeSignals"
          :key="signal.name"
          class="bg-green-900 p-2 rounded-lg text-center"
        >
          <span class="text-sm font-medium text-green-100">{{ signal.name }}</span>
        </div>
      </div>
      <p v-else class="text-gray-400 text-sm">No active signals</p>
    </div>

    <!-- Indicator Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <div
        v-for="indicator in sortedIndicators"
        :key="indicator.id"
        :class="[
          'bg-gray-800 rounded-lg shadow-md p-3 cursor-pointer transition-all duration-300 ease-in-out',
          { 'col-span-3': expandedCards.includes(indicator.id) }
        ]"
        @click="toggleCardExpansion(indicator.id)"
      >
        <h3 class="text-sm font-semibold mb-2 truncate" :title="indicator.name">
          {{ indicator.name }}
        </h3>

        <!-- Condensed View -->
        <div v-if="!expandedCards.includes(indicator.id)">
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-lg font-bold"
              :class="
                getValueColor(indicator.value, indicator.thresholds[0], indicator.thresholds[1])
              "
            >
              {{ formatValue(indicator.value) }}
            </span>
          </div>
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ indicator.date }}</span>
          </div>
        </div>

        <!-- Expanded View -->
        <div v-else>
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-2xl font-bold"
              :class="
                getValueColor(indicator.value, indicator.thresholds[0], indicator.thresholds[1])
              "
            >
              {{ formatValue(indicator.value) }}
            </span>
          </div>
          <!-- 描述 -->
          <p class="text-sm text-gray-300 mb-2">{{ indicator.description }}</p>
          <!-- 折线图表 -->
          <div v-if="indicator.linesData" class="mb-2 h-64">
            <chartC :xdata="indicator.linesData.xData" :data1="indicator.linesData.yData"></chartC>
          </div>

          <div v-if="indicator.additionalData" class="space-y-1 text-sm">
            <div
              v-for="(value, key) in indicator.additionalData"
              :key="key"
              class="flex justify-between"
            >
              <span>{{ key }}:</span>
              <span
                class="font-bold"
                :class="getValueColor(value, indicator.thresholds[0], indicator.thresholds[1])"
              >
                {{ formatValue(value) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
