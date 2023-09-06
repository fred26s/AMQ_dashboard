<script setup>
import { ref } from 'vue'

const props = defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  },
  placeholder: {
    type: String,
    default: "Type here"
  },
  modelValue: {
    type: String,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <span class="flex items-baseline">
    <span class="text-2xl mr-3 w-48 overflow-hidden text-ellipsis">{{ msgPre }}</span>
    <input type="text" :placeholder="placeholder" class="input input-bordered w-full max-w-xs" @input="updateValue($event.target.value)" />
  </span>
</template>


<style scoped></style>