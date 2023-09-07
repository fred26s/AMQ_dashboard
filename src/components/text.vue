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
    type: [String, Number],
    default: false
  },
  size: {
    type: String,
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <span class="flex items-baseline">
    <span class="text-sm mr-3 w-20 overflow-hidden text-ellipsis" :class="size">{{ msgPre }}</span>
    <input type="text" :placeholder="placeholder"
      class="input input-bordered w-full max-w-xs input-sm"
      v-bind:value="modelValue"
      @input="updateValue($event.target.value)" />
  </span>
</template>


<style scoped></style>