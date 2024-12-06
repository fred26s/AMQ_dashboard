<script setup>
import { ref, computed } from 'vue'
import chartD from './chartD.vue'

const props = defineProps({
  // 事件列表
  events: {
    type: Array,
    default: () => []
  },
  // 节假日
  holidays: {
    type: Array,
    default: () => []
  },
  // 日历详情
  details: {
    type: Array,
    default: () => []
  }
})

const showAll = ref(false)

// const events = ref([
//   event: 'Q2 Earnings', timestamp: '2024-12-24T13:30:00+00:00', important: true },
// ])

// 作为指定的逻辑，为了处理有问题的返回数据（抓取数据造成）
// 删除队尾的下年度数据，但显示成了本年度。
function removeCurrentYearEvents(events) {
  const currentYear = new Date().getFullYear()
  for (let i = events.length - 1; i >= 0; i--) {
    const eventDate = new Date(events[i].date)
    const eventYear = eventDate.getFullYear()
    if (eventYear === currentYear) {
      events.splice(i, 1)
    } else {
      break
    }
  }
  return events
}

const filterHolidays = computed(() => {
  const slicedHolidays = props.holidays.slice()
  return removeCurrentYearEvents(slicedHolidays)
})

const dailyDetails = computed(() => {
  const details = props.details
  return details
})

const keywordList = ['利率', '核心通胀率（年）', '非农', '失业', '经理人指数', '个人消费支出']
const events = computed(() => {
  // 浅拷贝操作展示，不改变源数据
  const result = props.events
    .slice()
    // 过滤经济日历的重要性，组装数据
    .map((e) => {
      return {
        ...e,
        important: keywordList.some((item) => e.event.includes(item)),
        idx: e.event.includes('利率')
          ? 1
          : e.event.includes('核心通胀率（年）')
          ? 2
          : e.event.includes('非农')
          ? 3
          : e.event.includes('失业')
          ? 4
          : e.event.includes('经理人指数')
          ? 5
          : e.event.includes('个人消费支出')
          ? 6
          : 0
      }
    })
    // 结合节假日数据
    .concat(
      filterHolidays.value
        .filter((e) => {
          // 只展示下个月之前的节假日
          const date = new Date(e.date)
          const todayTimestamp = Date.now()
          const twoMonthsAgoTimestamp = todayTimestamp + 60 * 60 * 24 * 30 * 1000 * 2 // 2 months in milliseconds
          return date.getTime() < twoMonthsAgoTimestamp
        })
        .map((e) => ({ ...e, timestamp: e.date, important: true, holidays: true }))
    )
    // 将经济日历和节假日 数据统一排序展示
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    // 昨天以后的数据
    .filter((e) => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 2)
      const yesterdayTimestamp = yesterday.getTime()
      return new Date(e.timestamp) > yesterdayTimestamp
    })
  return result
})

// 重要事件 高亮
const displayedEvents = computed(() =>
  showAll.value
    ? events.value
    : // 缩略只展示10条重要的信息
      events.value.filter((event) => event.important).filter((e, i) => i < 10)
)

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
}
</script>

<template>
  <div class="bg-gray-900 mb-4 mt-8 rounded-lg shadow-xl">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-100">Market Events</h2>
      <button
        @click="toggleShowAll"
        class="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg"
      >
        <span class="mr-2">{{ showAll ? 'Show Important' : 'Show All' }}</span>
        <span
          class="inline-block transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': showAll }"
        >
          ▼
        </span>
      </button>
    </div>
    <transition-group
      name="event-list"
      tag="div"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      <div
        v-for="item in displayedEvents"
        :key="item.event"
        :class="[
          'p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105',
          item.holidays
            ? 'bg-emerald-900 hover:bg-emerald-800'
            : item.important
            ? 'bg-yellow-900 hover:bg-yellow-800'
            : 'bg-gray-800 hover:bg-gray-700'
        ]"
      >
        <div class="dropdown dropdown-hover dropdown-top">
          <div tabindex="0" role="button" class="">
            <div class="flex flex-col h-full justify-between">
              <span
                :class="[
                  'font-medium text-sm',
                  item.important ? 'text-yellow-200' : 'text-gray-200'
                ]"
              >
                {{ item.event }}
              </span>
              <span :class="['text-xs mt-1', item.important ? 'text-yellow-300' : 'text-gray-400']">
                {{ formatDate(item.timestamp) }}
              </span>
            </div>
          </div>
          <ul
            v-if="item.idx"
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              {{ dailyDetails[item.idx - 1] && dailyDetails[item.idx - 1].description }}
            </li>
            <div class="w-full h-10 mb-2">
              <chartD
                :key="item.event"
                :xdata="dailyDetails[item.idx - 1] && dailyDetails[item.idx - 1].result.map(e => e[3])"
                :data1="dailyDetails[item.idx - 1] && dailyDetails[item.idx - 1].result.map(e => e[0])"
              ></chartD>
            </div>
          </ul>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.event-list-enter-active,
.event-list-leave-active {
  transition: all 0.5s ease;
}
.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.event-list-move {
  transition: transform 0.5s ease;
}
</style>
