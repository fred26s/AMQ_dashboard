<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '../http/api'
import toastBar from '../components/toast.vue'

const toast = ref(null)

const fetchDataRefresh = async (params) => {
  try {
    // 默认使用 realtime，查看线上实时策略状态
    const data = {
      ...params
    }
    const { result, err, code, message } = await useFetch('http://127.0.0.1:5001/fir-jf-e55de/us-central1/clerkUser', {
      method: 'get',
      data,
    })
    console.log(code, result, message)

    if (code.value == 1) {
      toast.value.open({ type: 'alert-success', msg: 'Refresh Remote' })
    } else {
      toast.value.open({ type: 'alert-error', msg: message })
    }
  } catch (error) {
    toast.value.open({ type: 'alert-error', msg: error })
  }
}
</script>

<!-- 初始化vue3 -->
<template>
  <div class="flex flex-col">
    <h1 class="text-2xl">计划方案</h1>
    <div class="flex flex-row gap-2 mt-5">
      <button class="btn btn-primary" @click="fetchDataRefresh">计划1</button>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
