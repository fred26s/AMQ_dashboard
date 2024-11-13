<template>
  <v-chart ref="chartRef" class="" :option="option" autoresize />
</template>

<script setup>
const props = defineProps({
  data1: {
    type: Array,
    default: []
  },
  xdata: {
    type: Array,
    default: []
  }
})
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent } from 'echarts/components'
// line
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'

import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, computed, onMounted } from 'vue'

const chartRef = ref(null)

onMounted(() => {})

use([
  LineChart,
  BarChart,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent
])

provide(THEME_KEY, 'dark')

const xdata = computed(() => props.xdata)
const data1 = computed(() => props.data1)

setTimeout(() => {
  console.log(VChart)
}, 3000)

const option = ref({
  grid: {
    containLabel: true,
    left: 20,
    right: 20,
    bottom: 30,
    top: 50
  },
  xAxis: {
    type: 'category',
    data: xdata
  },
  yAxis: [
    {
      name: 'values',
      position: 'left',
      type: 'value',
      nameTextStyle: {
        color: 'transparent'
      },
      // 设置 Y 轴的最小值自适应数据
      min: function (value) {
        // 获取 Y 轴数据最小值
        var min = value.min
        // 设置 Y 轴最小值，比最小值小 10%
        return min > 0 ? min * 0.8 : min * 1.2
      }
    }
  ],
  legend: {
    show: false
    // data: ['values', 'price']
  },
  tooltip: {
    trigger: 'axis'
  },
  series: [
    {
      data: data1,
      type: 'line',
      name: 'values',
      yAxisIndex: 0,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      areaStyle: {
        color: '#79bff336'
      },
      lineStyle: {
        color: '#005fffd6',
        width: 5
      },
      itemStyle: {
        color: (params) => {
          // 区分多头/空头
          if (params.data.type === 'long') {
            return 'green'
          } else if (params.data.type === 'short') {
            return 'red'
          }
        }
      }
    }
  ]
})
</script>

<style scoped>
/* .chart {
  height: 100vh;
} */
</style>
