import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 页面类型 区分 实时信号/回测
  const pageType = ref('realtime')
  // 回测数据源
  const dataSource = ref({})

  function pageBacktest() {
    pageType.value = 'backtest'
  }
  function pageDefault() {
    pageType.value = 'realtime'
  }

  function setPageSourceName(sourceName) {
    pageType.value = sourceName
  }

  function setDataSource(data) {
    dataSource.value = data
  }

  return { dataSource, pageType, pageBacktest, pageDefault, setDataSource, setPageSourceName }
})