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

const tradeLevel = computed(() => {
  return tradeExtra?.value?.level
})

const isLong = computed(() => {
  return tradeExtra?.value?.direction === 'long'
})

const tradeDirection = computed(() => {
  return isLong.value ? '多头' : '空头'
})

// 持仓天数
const days = computed(() => {
  return formatTimeDifference(tradeSell?.value?.timestamp, tradeBuy?.value?.timestamp)?.days
})
// 持仓小时数
const hours = computed(() => {
  return formatTimeDifference(tradeSell?.value?.timestamp, tradeBuy?.value?.timestamp)?.hours
})

// 时间戳转换为天、小时、分钟
const formatTimeDifference = (timestamp1, timestamp2) => {
  // 计算时间差 (毫秒)
  const difference = Math.abs(timestamp1 - timestamp2)

  // 转换为秒
  const seconds = Math.floor(difference / 1000)

  // 计算分钟
  const minutes = Math.floor(seconds / 60)

  // 计算小时
  const hours = Math.floor(minutes / 60)

  // 计算天数（保留一位小数）
  const days = (hours / 24).toFixed(1)

  // 格式化结果
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

// 手续费计算，每8小时 0.01%
function calculateFee(hours, amount) {
  // 计算需要收取手续费的次数
  const feeCount = Math.ceil(hours / 8)

  // 计算总手续费
  const fee = feeCount * amount * 0.0001

  return fee.toFixed(1)
}
</script>

<template>
  <div
    v-show="tradeBuy"
    className="grid gap-6 w-full max-w-3xl mx-auto px-4 py-4 md:px-6 dark:bg-gray-950 dark:text-gray-50"
  >
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">交易记录
        <span v-if="tradeLevel == '2'">❇️</span>
        <span v-else-if="tradeLevel == '1'">🈶</span>
        <span v-else-if="tradeLevel == '-1'">🈹</span>
      </h1>
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
              <div className="font-medium">
                {{ new Date(tradeBuy?.timestamp).toLocaleString() }}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">出场价格</div>
              <div className="font-medium">${{ tradeSell?.price }}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">出场时间</div>
              <div className="font-medium">
                {{ new Date(tradeSell?.timestamp).toLocaleString() }}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">盈亏金额</div>
              <div v-if="tradeProfit?.amt > 0" className="font-medium text-green-500">
                {{ Math.round(tradeProfit?.amt) }}
              </div>
              <div v-else className="font-medium text-red-500">
                {{ Math.round(tradeProfit?.amt) }}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">盈亏百分比</div>
              <div v-if="tradeProfit?.amt > 0" className="font-medium text-green-500">
                {{ Number(tradeProfit?.pct).toFixed(2) }}%
              </div>
              <div v-else className="font-medium text-red-500">
                {{ Number(tradeProfit?.pct).toFixed(2) }}%
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">持有时长</div>
              <div className="font-medium">{{ hours }} Hours({{ days }} D)</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">头寸量</div>
              <div className="font-medium">
                {{ `${Number(tradeBuy?.cost).toFixed(0)}(${Number(tradeBuy?.qty).toFixed(2)})` }}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">手续费(预估)</div>
              <div className="font-medium text-red-500">
                {{ calculateFee(hours, tradeBuy?.cost) }}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">建仓方向</div>
              <div v-if="isLong" className="font-medium">{{ tradeDirection }}⬆️</div>
              <div v-else className="font-medium">{{ tradeDirection }}⬇️</div>
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
