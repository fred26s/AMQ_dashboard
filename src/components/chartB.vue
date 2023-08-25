<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
// line
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';


import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide } from 'vue';

use([
  LineChart,
  GridComponent,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
]);

provide(THEME_KEY, 'dark');

const option = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  tooltip: {
    show: true
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
});
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
