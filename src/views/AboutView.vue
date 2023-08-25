<script setup>
import stats from '../components/stats.vue'
import theme from '../components/theme.vue'
import chartA from '../components/chartA.vue'
import chartB from '../components/chartB.vue'
import articleBar from '../components/articleBar.vue'

</script>

<template>
  <div class="container mx-auto">
    <theme msgPre="dark" msgNext="light"></theme>
    <stats></stats>
    <articleBar></articleBar>
    <div class="flex flex-col md:flex-row md:space-y-0 md:space-x-2">
      <chartB></chartB>
      <chartA></chartA>
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
