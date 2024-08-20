<script setup>
import { useFetch } from '../http/api'
import { onBeforeMount, ref } from 'vue'
import toastBar from '../components/toast.vue'

let dataInfo = ref({})

// 是否显示
let visibleBull = ref(false)
// 平仓信号
let visibleShit = ref(true)

let loading = ref(false)

const toast = ref(null)

const fetchData = async (params) => {
  // 默认使用 realtime，查看线上实时策略状态
  const data = {
    ...params
  }
  const { result, err } = await useFetch('/news/moon', {
    method: 'post',
    data
  })
  dataInfo.value = result.value

  if (!err) {
    toast.value.open({ type: 'alert-success', msg: 'Fetch News' })
  } else {
    toast.value.open({ type: 'alert-error', msg: err })
  }
}

// 拉取最新的新闻数据，并经过AI处理
const fetchDataRefresh = async (params) => {
  try {
    loading.value = true
    // 默认使用 realtime，查看线上实时策略状态
    const data = {
      ...params
    }
    const { result, err, code, message } = await useFetch('/news/sun', {
      method: 'post',
      data
    })
    console.log(code, result, message)

    if (code.value == 1) {
      toast.value.open({ type: 'alert-success', msg: 'Refresh Remote' })
      dataInfo.value = result.value
    } else {
      toast.value.open({ type: 'alert-error', msg: message })
    }
    loading.value = false
  } catch (error) {
    toast.value.open({ type: 'alert-error', msg: error })
    loading.value = false
  }
}

const openBlank = (url) => {
  // a标签打开新的链接tab页
  window.open(url, '_blank')
}
// 使用标题的序号，匹配超链接url
const patchLink = (title) => {
  // 正则匹配title字段的[n] 中的n
  const reg = /\[(\d+)\]/g
  const keyStr = title.match(reg)[0]
  const keyNum = keyStr.slice(1, -1)

  // 获取指定link url
  const url = dataInfo.value.links[keyNum - 1]

  openBlank(url)
}

onBeforeMount(async () => {
  fetchData()
})
</script>

<template>
  <div class="container mx-auto flex flex-col">
    <!-- 操作 -->
    <div class="flex justify-between">
      <div class="flex flex-col justify-center">
        <p class="prose">{{ dataInfo.date }}</p>
      </div>
      <div class="flex overflow h-12 mr-5">
        <!-- 筛选后新闻数量/新闻总数 -->
        <div class="text-xs mr-1 leading-10">
          {{
            `(${
              dataInfo.links.filter((e) => {
                return e !== '-'
              }).length
            }/${dataInfo.links.length})`
          }}
        </div>
        <button
          v-if="!loading"
          key="btn"
          class="btn btn-circle btn-secondary"
          @click="fetchDataRefresh"
        >
          刷新
        </button>
        <span v-if="loading" key="loading" class="loading loading-dots loading-lg"></span>
      </div>
    </div>
    <div class="flex">
      <div v-for="(s, index) in dataInfo.status" :key="index" class="indicator mr-5">
        <span
          v-if="s.status == 1"
          class="indicator-item indicator-bottom indicator-center badge badge-success w-full h-0.5"
        ></span>
        <span
          v-if="s.status == 0"
          class="indicator-item indicator-bottom indicator-center badge badge-error w-full h-0.5"
        ></span>
        <p class="prose">{{ s.source }}</p>
      </div>
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
              visibleBull = !visibleBull
            }
          "
        />
        <div class="collapse-title text-xl font-medium">
          Bull News
          <div class="badge">{{ dataInfo.bull.length }}</div>
        </div>
        <div class="collapse-content prose">
          <ul>
            <li v-for="(e, k) in dataInfo.bull" :key="`bull-${k}`">
              <a class="link link-hover" @click="patchLink(e)">
                {{ e }}
              </a>
            </li>
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
              visibleShit = !visibleShit
            }
          "
        />
        <div class="collapse-title text-xl font-medium">
          Shit News
          <div class="badge">{{ dataInfo.bear.length }}</div>
        </div>
        <div class="collapse-content prose">
          <ul>
            <li v-for="(e, k) in dataInfo.bear" :key="`bear-${k}`">
              <a class="link link-hover" @click="patchLink(e)">
                {{ e }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
