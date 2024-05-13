<template>
  <div v-show="chartId" ref="tradingViewContainer" id="tradingViewContainer" class="trading-view"></div>
  <div v-show="!chartId" class="skeleton w-full h-full"></div>
</template>

<script setup>
import { onMounted,defineProps, watch } from 'vue';

const props = defineProps({
  chartId: {
    type: String,
    default: "",
  },
});

watch(() => props.chartId, () => {
  console.log('props.chartId: ', props.chartId);
  chartInit(props.chartId)
});

const chartInit = (chartId) => {
  const tradingview_embed_options = {
      container_id: 'tradingViewContainer',
      // symbol: 'BTCUSDT.P',
      width: 640,
      height: 400,
      chart: chartId, // 指定链接
      theme: "dark",
      locale: 'zh_CN', // 设置语言为中文
      autosize: true
    };
    console.log('TradingView', TradingView)
    new TradingView.chart(tradingview_embed_options);
}

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/tv.js';
  script.async = true;
  script.onload = () => {
    chartInit(props.chartId)
  };
  document.head.appendChild(script);
});

</script>

<style scoped>
.trading-view {
  width: 100%;
  height: 100%;
}
</style>