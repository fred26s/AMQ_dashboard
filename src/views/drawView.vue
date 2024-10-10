<script setup>
import { ref } from 'vue'
import { drawFn } from '../utils/falAI'
import { useFetch } from '../http/api'
import toastBar from '../components/toast.vue'

let current = ref('https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp')
let loading = ref(false)
let text = ref('')
let list = ref([])

const toast = ref(null)
const BlankTab = () => {
  window.open(current.value, '_blank')
}
const setCurrent = (url) => {
  current.value = url
}
const DownloadFn = () => {
  fetch(current.value)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // 通过url截取文件名
      const fileName = current.value.substring(current.value.lastIndexOf('/') + 1)
      link.download = fileName || 'downloaded_image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch((error) => {
      console.error('下载图片出错:', error)
    })
}

const draw = async () => {
  try {
    loading.value = true
    // 接口获取key
    const { result } = await useFetch('/draw', {
      method: 'get'
    })
    const key = result.value.key
    const { images } = await drawFn(text.value, key)
    const { url } = images[0]
    current.value = url
    loading.value = false
    //  TODO 接口保存图片url
    const { code } = await useFetch('/draw/sun', {
      method: 'post',
      data: {
        url
      }
    })
    fetchData()
    if (code.value == 1) {
      toast.value.open({ type: 'alert-success', msg: 'success😊' })
    } else {
      toast.value.open({ type: 'alert-error', msg: 'error😭' })
    }
  } catch (error) {
    loading.value = false
    toast.value.open({ type: 'alert-error', msg: 'error😭' })
  }
}

// 初始化信息获取
const fetchData = async () => {
  try {
    const { result } = await useFetch('/draw/moon', {
      method: 'post'
    })
    const drawStr = result.value.draws
    list.value = drawStr.split(';').filter((e, i) => {
      if (e == 'null' || !e) return false
      return i < 10
    })
  } catch (error) {
    console.error(error)
  }
}

fetchData()
</script>

<template>
  <div class="hero min-h-screen relative" :style="`background-image: url(${current});`">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-neutral-content text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">Flux Generator</h1>
        <div class="mb-5" @keyup.enter="draw">
          <textarea
            class="textarea textarea-primary textarea-lg w-full"
            placeholder="Prompt something."
            v-model="text"
          ></textarea>
        </div>

        <!-- 回车快捷键触发事件 -->
        <button class="btn btn-primary w-full" @click="draw" :disabled="loading">
          <span v-if="loading" class="loading loading-dots loading-lg text-primary"></span>
          <span v-else> Magic </span>
        </button>
        <button class="btn btn-primary btn-link ml-5" @click="BlankTab">Blank_Tab</button>
        <button class="btn btn-primary btn-link ml-5" @click="DownloadFn">Download</button>
      </div>
    </div>
    <!-- 位于最底部 -->
    <div class="absolute bottom-0 w-full flex justify-center">
      <div class="avatar-group -space-x-6 rtl:space-x-reverse">
        <div v-for="item in list" :key="item" class="avatar">
          <div class="w-12">
            <img :src="item" @click="setCurrent(item)" />
          </div>
        </div>
      </div>
    </div>

    <toastBar ref="toast"></toastBar>
  </div>
</template>
