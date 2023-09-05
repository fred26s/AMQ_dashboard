<script setup>
import { useFetch } from "../http/api"
import { onBeforeMount, ref, computed, toValue, watchEffect, unref } from 'vue'
import toggle from '../components/toggle.vue'

let dataInfo = ref({})

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
    <div class="flex">
      button
    </div>
    <div class="flex flex-col">
      <div class="flex">
        <toggle msgPre="Buy"></toggle>
      </div>
      <div class="flex">
        toggle + input
      </div>
    </div>
    <div class="flex">
      submit
    </div>
  </div>
</template>
