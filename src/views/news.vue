<script setup>
import { useFetch } from "../http/api";
import { onBeforeMount, ref, computed, toValue, watchEffect, unref, watch } from "vue";
import toggle from "../components/toggle.vue";
import textBar from "../components/text.vue";
import toastBar from "../components/toast.vue";

let dataInfo = ref({});

// 是否显示
let visibleBull = ref(false);
// 平仓信号
let visibleShit = ref(true);

// 止盈/止损价
let priceStopProfit = ref("");
let priceStopLoss = ref("");

// 开仓价
let priceOpend = ref("");

const toast = ref(null);
// 倍率
let ratioOpen = ref(1);

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params,
  };
  const { result, err } = await useFetch("/news/moon", {
    method: "post",
    data,
  });
  dataInfo.value = result.value;

  if (!err) {
    toast.value.open({ type: "alert-success", msg: "Fetch News" });
  } else {
    toast.value.open({ type: "alert-error", msg: err });
  }
};

// 拉取最新的新闻数据，并经过AI处理
const fetchDataRefresh = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params,
  };
  const { result, err } = await useFetch("/news/sun", {
    method: "post",
    data,
  });
  dataInfo.value = result.value;

  if (!err) {
    toast.value.open({ type: "alert-success", msg: "Refresh Remote" });
  } else {
    toast.value.open({ type: "alert-error", msg: err });
  }
};

onBeforeMount(async () => {
  fetchData();
});
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <!-- 操作 -->
    <div class="flex justify-between">
      <div class="flex flex-col justify-center">
        <p class="prose">{{ dataInfo.date }}</p>
      </div>
      <button class="btn btn-circle btn-secondary mr-5" @click="fetchDataRefresh">
        刷新
      </button>
    </div>
    <!-- 信息 -->
    <div class="flex justify-start flex-col mt-3">
      <!-- 折叠区 -->
      <div
        class="collapse collapse-arrow bg-base-200"
        :class="[visibleBull ? 'collapse-open' : 'collapse-close']"
      >
        <input
          type="checkbox"
          @click="
            () => {
              visibleBull = !visibleBull;
            }
          "
        />
        <div class="collapse-title text-xl font-medium">Bull News</div>
        <div class="collapse-content prose">
          <ul>
            <li v-for="(e, k) in dataInfo.bull" :key="`bull-${k}`">{{ e }}</li>
          </ul>
        </div>
      </div>
      <!-- 折叠区 -->
      <div
        class="collapse collapse-arrow border bg-base-200 border-primary"
        :class="[visibleShit ? 'collapse-open' : 'collapse-close']"
      >
        <input
          type="checkbox"
          @click="
            () => {
              visibleShit = !visibleShit;
            }
          "
        />
        <div class="collapse-title text-xl font-medium">Shit News</div>
        <div class="collapse-content prose">
          <ul>
            <li v-for="(e, k) in dataInfo.bear" :key="`bear-${k}`">{{ e }}</li>
          </ul>
        </div>
      </div>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
