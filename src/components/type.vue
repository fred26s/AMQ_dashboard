<script setup>
defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  }
})

import { themeChange } from 'theme-change'
import { ref, computed } from 'vue'
const theme = ['cupcake', 'dark']
let themeName = ref('dark')
import { useCounterStore } from "../stores/index"

const counter = useCounterStore()

const pageType = counter.pageType
// 使用 counterStore 中的状态和方法
const handleChange = (type) => {
  console.log(type)
  if (type === 1) {
    counter.pageBacktest()
  } else {
    counter.pageDefault()
  }
}
</script>

<template>
  <label class="swap swap-flip text-4xl">

    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" />

    <div class="swap-on" @click="handleChange(1)">😈</div>
    <div class="swap-off" @click="handleChange(2)">😇</div>
  </label>
</template>

<style scoped></style>
