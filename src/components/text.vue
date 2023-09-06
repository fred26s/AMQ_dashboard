<script setup>
import { ref, defineEmits } from 'vue'

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
  console.dir(value)
  console.log(value)
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :placeholder="placeholder" class="input input-bordered w-full max-w-xs" @input="updateValue($event.target.value)" />
</template>


<style scoped></style>