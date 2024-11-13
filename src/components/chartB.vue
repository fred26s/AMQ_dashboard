<template>
  <v-chart ref="chartRef" class="" :option="option" autoresize />
</template>

<script setup>
const props = defineProps({
  data1: {
    type: Array,
    default: []
  },
  data2: {
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
import { ref, provide, computed, onMounted, defineEmits } from 'vue'

const chartRef = ref(null)
const emit = defineEmits(['clickChart']) // 声明要触发的事件

onMounted(() => {
  if (chartRef.value) {
    console.log(chartRef.value)
    console.log('chartRef.value')
    chartRef.value.chart.on('click', function (params) {
      // 在这里处理点击事件
      console.log('Data:', params.data)
      console.log('params:', params)
      emit('clickChart', params) // 触发事件并传递数据
    })
  }
})

use([LineChart, BarChart, LegendComponent, GridComponent, CanvasRenderer, TitleComponent, TooltipComponent])

provide(THEME_KEY, 'dark')

const xdata = computed(() => props.xdata)
const data1 = computed(() => props.data1)
const data2 = computed(() => props.data2)
const dataBG = computed(() => Array(xdata.value.length).fill(10000))

setTimeout(() => {
  console.log(VChart)
}, 3000)

const option = ref({
  xAxis: {
    type: 'category',
    data: xdata,
  },
  yAxis: [
    {
      name: 'values',
      position: 'left',
      // min: 8000,
      // 设置 Y 轴的最小值自适应数据
      min: function (value) {
        // 获取 Y 轴数据最小值
        var min = value.min
        // 设置 Y 轴最小值，比最小值小 10%
        return min > 0 ? min * 0.8 : min * 1.2
      },
      type: 'value'
    },
    {
      name: 'price',
      position: 'right',
      // min: 20000,
      // 设置 Y 轴的最小值自适应数据
      min: function (value) {
        // 获取 Y 轴数据最小值
        var min = value.min
        // 设置 Y 轴最小值，比最小值小 10%
        return min > 0 ? min * 0.8 : min * 1.2
      },
      type: 'value'
    },
    // 为了快捷点击，而使用的透明背景柱状图
    {
      name: 'bg',
      position: 'left',
      type: 'value', 
      show: false,
      min: 0,
      max: 10000,
      offset: 30
    }
  ],
  legend: {
    data: ['values', 'price']
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
    },
    {
      data: data2,
      type: 'line',
      name: 'price',
      yAxisIndex: 1,
      smooth: true,
      lineStyle: {
        color: '#a6c16736'
      },
      symbol: 'none',
    }, 
    {
      data: dataBG,
      type: 'bar',
      name: 'bg',
      yAxisIndex: 2,
      itemStyle: {
        color: 'transparent'
      },
      z: 3,
      barCategoryGap: '1%' // 调整间隙大小
      // barGap: 0,
      // barWidth: 20,
    }
  ]
})
</script>

<style scoped>
/* .chart {
  height: 100vh;
} */
</style>
