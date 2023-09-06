<script setup>
import { ref, defineEmits } from 'vue'

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
      <span class="label-text">{{ msgPre }}</span>
      <input type="checkbox" class="toggle" :checked="modelValue" @change="updateValue($event.target.checked)" />
      <span class="label-text">{{ msgNext }}</span>
    </label>
  </div>
</template>


<style scoped></style>