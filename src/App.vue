<script setup>
import { RouterLink, RouterView } from 'vue-router'
import footerBar from './components/footerBar.vue'

</script>

<template>
  <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

  <!-- <HelloWorld msg="You did it!" /> -->

  <div class="container mx-auto">
    <!-- <div class="flex justify-end space-x-5">
    </div> -->
    <div class="flex w-full">
      <div class="grid h-10 flex-grow card bg-base-300 rounded-box place-items-center">
        <RouterLink class="w-full text-center" to="/">Home</RouterLink>
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="grid h-10 flex-grow card bg-base-300 rounded-box place-items-center">
        <RouterLink class="w-full text-center" to="/about">About</RouterLink>
      </div>
    </div>

    <RouterView />
  </div>
  <footerBar></footerBar>
</template>

<style scoped></style>
