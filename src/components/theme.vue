<script setup>
defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  }
})

import { themeChange } from 'theme-change'
import { ref, computed } from 'vue'
const theme = ['dark', 'cupcake']
let themeName = ref('dark')

const handleSkin = () => {
  const currentIndex = theme.indexOf(themeName.value)
  const nextIndex = (currentIndex + 1) % theme.length
  themeName.value = theme[nextIndex]
  themeChange(false)
}
</script>

<template>
  <span>
    {{ msgPre }}
    <input type="checkbox" class="toggle" checked :data-set-theme="themeName" @click="handleSkin" />
    {{ msgNext }}
  </span>
</template>

<style scoped></style>
