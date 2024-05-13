<script setup>
import { onBeforeMount, ref, computed, toValue, watchEffect, unref, defineProps } from 'vue'

const props = defineProps({
    info: {
        type: Object,
        default: {}
    }
})

/**
 * buy: {timestamp: 1693136940000, price: 28888, qty: 0.03461644973691498, cost: '1000.00'}
profit: {amt: 38.4588756577125, pct: 3.8458875657712497}
sell: {timestamp: 1693137000000, price: 29999, revenue: 1038.4588756577125}
stats: {timeHeld: 1}
 */
const tradeBuy = computed(() => {
  return props.info.buy
})
const tradeSell = computed(() => {
  return props.info.sell
})
const tradeProfit = computed(() => {
  return props.info.profit
})
const tradeStats = computed(() => {
  return props.info.stats
})
const tradeExtra = computed(() => {
  return props.info.extra
})

</script>


<template>
     <div v-show="tradeBuy" className="grid gap-6 w-full max-w-3xl mx-auto px-4 py-4 md:px-6 dark:bg-gray-950 dark:text-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">交易记录</h1>
        <!-- <Button size="sm" variant="outline">
          <PlusIcon className="w-4 h-4 mr-2" />
          新建交易
        </Button> -->
      </div>
      <div className="grid gap-4">
        <Card className="dark:bg-gray-900 dark:border-gray-800 p-4">
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">进场价格</div>
                <div className="font-medium">${{ tradeBuy?.price }}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">进场时间</div>
                <div className="font-medium">{{ new Date(tradeBuy?.timestamp).toLocaleString() }}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">出场价格</div>
                <div className="font-medium">${{ tradeSell?.price }}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">出场时间</div>
                <div className="font-medium">{{new Date(tradeSell?.timestamp).toLocaleString() }}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">盈亏金额</div>
                <div v-if=" tradeProfit?.amt > 0" className="font-medium text-green-500">{{ Math.round(tradeProfit?.amt) }}</div>
                <div v-else className="font-medium text-red-500">{{ Math.round(tradeProfit?.amt) }}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">盈亏百分比</div>
                <div v-if="tradeProfit?.amt > 0" className="font-medium text-green-500">{{ Number(tradeProfit?.pct).toFixed(2)}}%</div>
                <div v-else className="font-medium text-red-500">{{ Number(tradeProfit?.pct).toFixed(2)}}%</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">持有时长</div>
                <div className="font-medium">{{ tradeStats?.timeHeld }} Hours({{ Number(tradeStats?.timeHeld / 24).toFixed(1) }} Days)</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">头寸量</div>
                <div className="font-medium">{{ `${Number(tradeBuy?.cost).toFixed(0)}(${Number(tradeBuy?.qty).toFixed(2)})` }}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">建仓理由</div>
                <div className="font-medium">{{ tradeExtra?.reason }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- block -->
    <div v-show="!tradeBuy" class="flex flex-col gap-4 w-52 w-full">
  <div class="flex gap-4 items-center">
    <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
    <div class="flex flex-col gap-4">
      <div class="skeleton h-4 w-20"></div>
      <div class="skeleton h-4 w-28"></div>
    </div>
  </div>
  <div class="skeleton h-96 w-full"></div>
</div>
</template>