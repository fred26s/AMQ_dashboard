<template>
  <button :disabled="loading">
    <slot v-if="!loading" @click="$emit('click')" />
    <span v-else class="loading loading-dots loading-lg"></span>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    text: {
      type: String,
      default: '提交'
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
