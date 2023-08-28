<script setup>
import stats from '../components/stats.vue'
import statsCard from '../components/statsCard.vue'
import chartA from '../components/chartA.vue'
import chartB from '../components/chartB.vue'
import articleBar from '../components/articleBar.vue'

</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap mt-3 md:justify-between">
      <stats label="账户" value="420" tips="持仓状态"></stats>
      <statsCard label="平均持仓时间" value="420" tips="tips"></statsCard>
      <statsCard label="实际盈亏" value="420" tips="tips"></statsCard>
      <statsCard label="胜率" value="420" tips="tips"></statsCard>
      <statsCard label="交易次数" value="420" tips="tips"></statsCard>
    </div>
    <div class="flex mt-3">
      <!-- <articleBar></articleBar> -->
    </div>
    <div class="flex flex-col space-y-5 space-x-2 md:flex-row mt-3">
      <div class="h-96 md:w-1/2">
        <chartB></chartB>
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
