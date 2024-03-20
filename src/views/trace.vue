<script setup>
import { useFetch } from "../http/api";
import { onBeforeMount, ref, computed } from "vue";
import toastBar from "../components/toast.vue";
// import toggle from '../components/toggle.vue'

// 看板列表
// let dataInfo = ref({});
let traceItem = ref({
  pathFlag: '',
  cloudSMA: '',
  pathFlagList: [],
  cloudSMAList: [],
});
let trigger = ref([
  [2, 1, 2],
  [2, 1, 2, 3],
  [2, 1, 2, 3, 2],
  [2, 1, 2, 3, 2, 3],
  [2, 1, 2, 3, 2, 3, 2],
  [2, 1, 2, 3, 2, 3, 2, 3],
])
// 交易模块
// let triggerTrade = ref(false)

let flag = computed(() => {
  // 若item.pathFlag 中某一项以trigger结尾
  // 则表示策略为待捕捉状态
  return trigger.value.some(e => {
    return  traceItem.value.pathFlag.endsWith(e.join(','))
  })
})


const toast = ref(null);

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params,
  };
  const { result, err } = await useFetch("/monitor/moontrace", {
    method: "post",
    data,
  });

  const res = result.value;
  const { updateTime, pathFlag, cloudSMA } = res;
  const dateValue = new Date(updateTime).valueOf();
  const dateAgo = formatTimestampAgo(dateValue)
  traceItem.value = {
    ...res,
    pathFlagList: pathFlag.split(','),
    cloudSMAList: cloudSMA.split(','),
    dateAgo
  };

  if (!err) {
    toast.value.open({ type: "alert-success", msg: "Fetch Monitor" });
  } else {
    toast.value.open({ type: "alert-error", msg: err });
  }
};


// 距今时间显示
const formatTimestampAgo = (timestamp) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - timestamp;

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} 秒前`;
  } else if (minutes < 60) {
    return `${minutes} 分钟前`;
  } else if (minutes < 48 * 60) {
    return `${hours} 小时前`;
  } else {
    return `${days} 天前`;
  }
}

onBeforeMount(async () => {
  fetchData();
});
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <div class="flex flex-col w-full min-h-screen">
      <main class="flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div class="max-w-6xl w-full mx-auto flex justify-end items-center gap-4">
          <!-- <toggle class="" msgPre="邮件预警" msgNext="" type="toggle-success" size="toggle-lg" v-model="triggerTrade"
            @update="handleUpdate"></toggle> -->

          <button @click="fetchData" class="btn btn-circle btn-primary">
            刷新
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="table m-0">
            <!-- head -->
            <thead>
              <tr>
                <th></th>
                <th>Trigger</th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <!-- 高亮背景显示 -->
              <tr v-for="(e, i) in trigger" :key="i" :class="traceItem.pathFlag.endsWith(e.join(',')) ? 'bg-primary' : ''">
                <th>({{ i + 1 }})</th>
                <td>{{ e.join(',') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg" data-v0-t="card">

            <div class="space-y-1.5 p-6 flex flex-row items-center gap-4"><svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <div class="grid gap-1">
                <h3 class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">焦油策略</h3>
                <p class="text-sm text-muted-foreground">{{ traceItem.pathFlag }}</p>
                <!-- <p v-for="(eFLag, eIndex) in traceItem.pathFlagList" :key="eIndex" class="text-sm text-muted-foreground">{{ eFLag }} - {{ traceItem.cloudSMAList[eIndex] }}</p> -->
              </div>
              <div v-if="flag" class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="w-6 h-6 text-green-500">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div v-else class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="w-6 h-6 text-red-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
            </div>
            <div class="p-6 pt-0 pb-0 flex flex-col items-start gap-2">
              <p v-for="(eFLag, eIndex) in traceItem.pathFlagList" :key="eIndex" class="text-sm text-muted-foreground">{{ eFLag }} - {{ Number(traceItem.cloudSMAList[eIndex]).toFixed(3) }}</p>
              </div>
            <div class="p-6 flex flex-col items-start gap-2">
              <div class="text-sm font-semibold">
                Last update: {{ traceItem.dateAgo }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ traceItem.updateTime }}</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
