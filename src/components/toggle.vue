<script setup>
import { ref } from 'vue'

const props = defineProps({
  msgPre: {
    type: String,
  },
  msgNext: {
    type: String,
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
  },
  size: {
    type: String,
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(checked) {
  emit('update:modelValue', checked)
}
</script>

<template>
  <div class="form-control">
    <label class="label cursor-pointer">
      <span :class="['label-text', `text-${type}`]">{{ msgPre }}</span>
      <input type="checkbox" :class="['toggle',  type, size]" :checked="modelValue"
        @change="updateValue($event.target.checked)" />
      <span :class="['label-text', `text-${type}`]">{{ msgNext }}</span>
    </label>
  </div>
</template>


<style scoped></style>