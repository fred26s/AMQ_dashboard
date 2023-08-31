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
  <!-- <div class="stats stats-vertical md:stats-horizontal shadow"> -->
  <div class="stats stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-desc">{{ tips }}</div>
    </div>
  </div>
</template>

<style scoped></style>
