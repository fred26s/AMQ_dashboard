<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  // 事件列表
  events: {
    type: Array,
    default: () => []
  }
})

const showAll = ref(false)

// const events = ref([
//   event: 'Q2 Earnings', timestamp: '2024-12-24T13:30:00+00:00', important: true },
// ])

const keywordList = ['利率', '非农', '失业', '通货膨胀', '经理人指数', '个人消费支出']
const events = computed(() => {
  // 浅拷贝操作展示，不改变源数据
  const result = props.events
    .slice()
    .reverse()
    .map((e) => {
      return {
        ...e,
        important: keywordList.some((item) => e.event.includes(item))
      }
    })
  return result
})

// 重要事件 高亮
const displayedEvents = computed(() =>
  showAll.value ? events.value : events.value.filter(event => event.important)
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
          item.important ? 'bg-yellow-900 hover:bg-yellow-800' : 'bg-gray-800 hover:bg-gray-700'
        ]"
      >
        <div class="flex flex-col h-full justify-between">
          <span
            :class="['font-medium text-sm', item.important ? 'text-yellow-200' : 'text-gray-200']"
          >
            {{ item.event }}
          </span>
          <span :class="['text-xs mt-1', item.important ? 'text-yellow-300' : 'text-gray-400']">
            {{ formatDate(item.timestamp) }}
          </span>
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
