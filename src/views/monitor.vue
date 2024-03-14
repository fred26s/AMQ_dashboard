<script setup>
import { useFetch } from "../http/api";
import { onBeforeMount, ref } from "vue";
import toastBar from "../components/toast.vue";

let dataInfo = ref({});

const toast = ref(null);

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params,
  };
  const { result, err } = await useFetch("/monitor/moon", {
    method: "post",
    data,
  });

  const resMap = Object.keys(result.value).map(key => {
    const item = result.value[key];
    console.log(item, key)
    const itemParse = item.split('|');

    // const status = Number(itemParse[0]);
    const date = new Date(itemParse[1]);
    const dateValue = new Date(itemParse[1]).valueOf();
    const dateAgo = formatTimestampAgo(dateValue)
    const dateStr = formatTimestampStr(dateValue)
    const status = formatStatus(dateValue)

    return {
      status,
      date,
      dateAgo,
      dateStr,
      name: key
    }
  })

  // 排序，将报错的监控放在队首，方便查看
  dataInfo.value = resMap.sort((a, b) => a.status - b.status);;

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

// 设置报警显示的时间阈值
const formatStatus = (timestamp) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - timestamp;

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);

  // 大于2分钟，则报警
  if (seconds < 60) {
    return true;
  } else if (minutes < 2) {
    return true;
  } else {
    return false;
  }
}

// 格式化时间戳为汉字
const formatTimestampStr = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
}


onBeforeMount(async () => {
  fetchData();
});
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <div class="flex flex-col w-full min-h-screen">
      <main
        class="flex min-h-[calc(100vh-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        <div class="max-w-6xl w-full mx-auto flex justify-end items-center gap-4">
          <button @click="fetchData"
            class="btn btn-circle btn-primary">
            刷新
          </button>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          <div v-for="(item, index) in dataInfo" :key="index"
            class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg" data-v0-t="card">
            <div class="space-y-1.5 p-6 flex flex-row items-center gap-4"><svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <div class="grid gap-1">
                <h3 class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">{{ item.name }}</h3>
                <!-- <p class="text-sm text-muted-foreground">example.com</p> -->
              </div>
              <div v-if="item.status" class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
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
            <div class="p-6 flex flex-col items-start gap-2">
              <div class="text-sm font-semibold">
                Last probe: {{ item.dateAgo }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.dateStr }}</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
