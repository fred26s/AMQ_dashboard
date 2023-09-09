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
  type: {
    type: String,
    default: 'alert-success'
  },
  size: {
    type: String,
  }
})

const visible= ref(false)
let typeClass= ref('alert-success')
let message= ref('')

const open = ({type="alert-success", msg=""}) => {
  visible.value = true
  typeClass.value = type
  message.value = msg
  setTimeout(() => {
    close()
  }, 2000);
}
const close = () => {
  visible.value = false
}
defineExpose({
  open,
  close
});

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div v-if="visible" class="toast toast-top toast-center">
    <div :class="['alert', typeClass]">
      😇
      <span>  <slot></slot>{{ message }} <!-- 插槽出口 --></span>
    </div>
  </div>
</template>


<style scoped></style>