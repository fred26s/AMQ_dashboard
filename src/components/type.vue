<script setup>
defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  }
})

import { ref, computed } from 'vue'

import { useCounterStore } from "../stores/index"
import { importAllJson } from '../utils';

const counter = useCounterStore()
// 增加default选项，用以切换回实时看板，查询接口获取数据
let filenameList = ref(['realtime'])


const initAllJson = async () => {
  const allJson = await importAllJson();
  filenameList.value = filenameList.value.concat(Object.keys(allJson)) 
  counter.setDataSource(allJson)
}
const handleChange = (sourceName) => {
  counter.setPageSourceName(sourceName)
}

initAllJson()

</script>

<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn m-1">Aura</label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li v-for="e in filenameList" :key="i" @click="handleChange(e)"><a>{{ e }}</a></li>
    </ul>
  </div>
</template>

<style scoped></style>
