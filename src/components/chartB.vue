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
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
// line
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
} from 'echarts/components';


import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, onMounted, defineEmits } from 'vue';

const chartRef = ref(null);
const emit = defineEmits(['clickChart']); // 声明要触发的事件

onMounted(() => {
  if (chartRef.value) {
    console.log(chartRef.value)
    console.log('chartRef.value')
    chartRef.value.chart.on('click', function (params) {
      // 在这里处理点击事件
      console.log('Data:', params.data);
      console.log('params:', params);
      emit('clickChart', params); // 触发事件并传递数据
    });
  }
});


use([
  LineChart,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
]);

provide(THEME_KEY, 'dark');

const xdata = computed(() => props.xdata)
const data1 = computed(() => props.data1)
const data2 = computed(() => props.data2)


setTimeout(() => {
  console.log(VChart)
}, 3000);


const option = ref({
  xAxis: {
    type: 'category',
    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    data: xdata
  },
  yAxis: [
    {
      name: "values",
      position: "left",
      type: 'value'
    },
    {
      name: "price",
      position: "right",
      type: 'value'
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
      // data: [820, 932, 901, 934, 1290, 1330, 1320],
      data: data1,
      type: 'line',
      name: "values",
      yAxisIndex: 0,
      smooth: true
    },
    {
      // data: [10000, 11000, 12000, 11000, 12000, 10000, 9000],
      data: data2,
      type: 'line',
      name: "price",
      yAxisIndex: 1,
      smooth: true

    }
  ]
});
</script>

<style scoped>
/* .chart {
  height: 100vh;
} */
</style>
