<script setup>
defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  }
})

import { ref, computed } from 'vue'

const status = ref('')

</script>

<template>
 <div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">{{ msgPre }}</span> 
    <input type="checkbox" class="toggle" checked />
  </label>
</div>
</template>

<style scoped></style>
