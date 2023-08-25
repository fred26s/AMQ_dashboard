<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

  <!-- <HelloWorld msg="You did it!" /> -->

  <header class="container flex justify-between">
    <div class="order-last">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
