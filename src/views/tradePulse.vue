<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useFetch } from '../http/api'
import chartC from '../components/chartC.vue'
import chartD from '../components/chartD.vue'
import loadingButton from '../components/loadingButton.vue'
import calendarBar from '../components/calendarBar.vue'
import newsBar from './news.vue'
const expandedCards = ref([])
const isLoading = ref(false)
const calendarUs = ref([])

const indicatorsConfig = ref([
  {
    id: 1,
    name: 'BTC-ETF',
    value: 65,
    thresholds: [0, 0],
    linesData: {
      xData: [],
      yData: []
    },
    date: '',
    description: '比特币现货ETF流量',
    additionalData: {},

    valueGetter: (data) => data.btcETF[0].total,
    dateGetter: (data) => new Date(data.btcETF[0].date).toLocaleString(),
    linesDataGetter: (data) => {
      const chartsData = data.btcETF.reverse()
      return {
        xData: chartsData.map((item) => item.date) || [],
        yData: chartsData.map((item) => item.total) || []
      }
    }
  },
  {
    id: 5,
    name: 'S&P 500',
    value: 65,
    thresholds: [0, 0],
    linesData: {
      xData: [],
      yData: []
    },
    date: '',
    description: '美股标准普尔500指数',
    additionalData: {},

    valueGetter: (data) => data.sp500[0].c,
    dateGetter: (data) => new Date(data.sp500[0].timestamp).toLocaleString(),
    linesDataGetter: (data) => {
      const chartsData = data.sp500.reverse()
      return {
        xData: chartsData.map((item) => item.timestamp) || [],
        yData: chartsData.map((item) => item.c) || []
      }
    }
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
    date: '',
    description: '比特币未平仓合约量',
    additionalData: {},
    valueGetter: (data) => data.openInterestHist[0].sumOpenInterestValue,
    dateGetter: (data) => new Date(data.openInterestHist[0].timestamp).toLocaleString(),
    linesDataGetter: (data) => {
      const openInterestHistChart = data.openInterestHist.reverse()
      return {
        xData: openInterestHistChart.map((item) => new Date(item.timestamp).toLocaleString()) || [],
        yData: openInterestHistChart.map((item) => item.sumOpenInterestValue) || []
      }
    }
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
    date: '',
    description: '比特币多空比',
    additionalData: {},
    valueGetter: (data) =>
      data.globalLongShortAccountRatio[data.globalLongShortAccountRatio.length - 1].longShortRatio,
    dateGetter: (data) =>
      new Date(
        data.globalLongShortAccountRatio[data.globalLongShortAccountRatio.length - 1].timestamp
      ).toLocaleString(),
    linesDataGetter: (data) => {
      return {
        xData:
          data.globalLongShortAccountRatio.map((item) =>
            new Date(item.timestamp).toLocaleString()
          ) || [],
        yData: data.globalLongShortAccountRatio.map((item) => item.longShortRatio) || []
      }
    }
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
    date: '',
    description: '比特币资金费率',
    additionalData: {},
    valueGetter: (data) => `${data.fundingRate[data.fundingRate.length - 1].fundingRate * 100}`,
    dateGetter: (data) =>
      new Date(data.fundingRate[data.fundingRate.length - 1].fundingTime).toLocaleString(),
    linesDataGetter: (data) => {
      return {
        xData: data.fundingRate.map((item) => new Date(item.fundingTime).toLocaleString()) || [],
        yData: data.fundingRate.map((item) => item.fundingRate) || []
      }
    }
  },
  {
    id: 6,
    name: 'BTC-爆仓线',
    value: 66,
    thresholds: [0, 0],
    base64: true,
    source: '',
    linesData: {
      xData: [],
      yData: []
    },
    date: '',
    description: '永续合约爆仓线',
    additionalData: {},
    valueGetter: () => ``,
    sourceGetter: (data) => `data:image/jpeg;base64,${data.lhMap[0].content}`,
    dateGetter: (data) => new Date(data.lhMap[0].timestamp).toLocaleString(),
    linesDataGetter: () => {
      return {
        xData: [],
        yData: []
      }
    }
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

// 历史数据模块-遍历赋值逻辑
const updateIndicator = (indicator, data) => {
  if (indicator.sourceGetter) {
    indicator.source = indicator.sourceGetter(data)
  }
  indicator.value = indicator.valueGetter(data)
  indicator.date = indicator.dateGetter(data)
  const linesData = indicator.linesDataGetter(data)
  indicator.linesData.xData = linesData.xData
  indicator.linesData.yData = linesData.yData
}

const fetchData = async (params) => {
  try {
    isLoading.value = true

    const data = { ...params }
    const { result, err } = await useFetch('/pulse/moon', {
      method: 'get',
      data
    })

    if (err) throw new Error(err)

    const responseData = result.value
    // 遍历执行所有数据赋值
    indicatorsConfig.value.forEach((indicator) => {
      updateIndicator(indicator, responseData)
    })

    // 经济日历（独立模块，单独赋值）
    calendarUs.value = responseData.calendarUS

    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
}
const activeSignals = computed(() => {
  return indicatorsConfig.value.filter(
    (indicator) =>
      indicator.value >= indicator.thresholds[1] || indicator.value <= indicator.thresholds[0]
  )
})

const sortedIndicators = computed(() => {
  return [...indicatorsConfig.value].sort((a, b) => {
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
      <loadingButton class="absolute right-0" v-model:loading="isLoading">
        <button class="btn btn-circle btn-accent" @click="fetchData">刷新</button>
      </loadingButton>
    </h1>

    <!-- Trading Signals Panel -->
    <!-- 暂时隐藏，功能待开发 -->
    <!-- <div class="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
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
    </div> -->
    <!--calendar -->
    <div class="flex lg:flex-row flex-col gap-4">
      <calendarBar :events="calendarUs"  class="lg:w-1/2 w-full"/>
      <div class="lg:w-1/2 w-full">
        <newsBar :refreshNews="false"></newsBar>
      </div>
    </div>

    <!-- Indicator Grid -->
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
            <div class="w-1/2 h-8">
              <chartD
                :xdata="indicator.linesData.xData.slice(-50)"
                :data1="indicator.linesData.yData.slice(-50)"
              ></chartD>
            </div>
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
            
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ indicator.date }}</span>
          </div>
          </div>
          <!-- 描述 -->
          <p class="text-sm text-gray-300 mb-2">{{ indicator.description }}</p>
          <!-- 折线图表 -->
          <div v-if="indicator.linesData && !indicator.base64" class="mb-2 h-64">
            <chartC :xdata="indicator.linesData.xData" :data1="indicator.linesData.yData"></chartC>
          </div>
          <!-- 图片展示 -->
          <div v-if="indicator.base64" class="mb-2 h-64">
            <img :src="indicator.source" class="w-full h-full"/>
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
