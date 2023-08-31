import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const pageType = ref('default')

  function increment() {
    count.value++
  }

  function pageBacktest() {
    pageType.value = 'backtest'
  }
  function pageDefault() {
    pageType.value = 'default'
  }

  return { count, doubleCount, increment, pageType, pageBacktest, pageDefault }
})