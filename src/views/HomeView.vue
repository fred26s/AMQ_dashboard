<script setup>
import { useFetch } from "../http/api"
import { onBeforeMount, ref, computed, toValue, watchEffect, unref } from 'vue'
import toggle from '../components/toggle.vue'
import textBar from '../components/text.vue'

let dataInfo = ref({})
let toggleValue = ref(false)
let txt = ref("")

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/shadow/moon', {
    method: 'post',
    data
  })
  dataInfo.value = result.value;
}

const setData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/summary/board', {
    method: 'post',
    data
  })
  dataInfo.value = result.value;
}

onBeforeMount(async () => {
  fetchData()
})

</script>

<template>
  <div class="container mx-auto flex flex-col">
    <div class="flex justify-between">
      <toggle class="" msgPre="真实交易" msgNext="" type="success" size="lg" v-model="toggleValue"></toggle>
      <button class="btn btn-circle btn-accent">刷新</button>
    </div>



    <div class="indicator w-full mt-5">
      <div class="indicator-item indicator-bottom">
        <button class="btn btn-primary">Apply</button>
      </div>
      <div class="card border w-full">
        <div class="card-body">
          <h2 class="card-title">指令</h2>
          <div class="flex flex-col w-full lg:flex-row">
            <div class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center">
              <div class="flex items-center">
                <toggle class="mr-5" msgPre="Buy" msgNext="Sell" type="success" v-model="toggleValue"></toggle>
                <div v-if="toggleValue" class="flex flex-col">
                  <textBar msgPre="openPrice" v-model="txt"></textBar>
                </div>
              </div>
            </div>
            <div class="divider lg:divider-horizontal">OR</div>
            <div class="grid flex-grow h-40 card bg-base-300 rounded-box place-items-center">
              <div class="flex items-center mt-3">
                <toggle class="mr-5" msgPre="Buy" msgNext="Sell" type="error" v-model="toggleValue"></toggle>
                <div class="flex flex-col">
                  <textBar msgPre="stopProfit" v-model="txt"></textBar>
                  <textBar class="mt-5" msgPre="stopLoss" v-model="txt"></textBar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="flex justify-start mt-3">
      <!-- <button class="btn btn-primary w-1/2">发布</button> -->
    </div>
  </div>
</template>
