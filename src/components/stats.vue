<script setup>
defineProps({
  label: {
    type: [String, Number]
  },
  value: {
    type: [String, Number]
  },
  tips: {
    type: [String, Number]
  }
})
</script>

<template>
  <div class="stats bg-neutral text-neutral-content">
    <div class="stat">
      <div class="stat-title">{{ label }}</div>
      <div class="stat-value">${{ value }}</div>
      <div class="stat-actions">
        <button class="btn btn-sm btn-success">{{ tips }}</button>
      </div>
    </div>

  </div>
</template>

<style scoped></style>

