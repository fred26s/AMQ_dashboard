<script setup>
import { RouterLink, RouterView } from 'vue-router'
import footerBar from './components/footerBar.vue'
import navBar from './components/navBar.vue'
import theme from './components/theme.vue'

</script>

<template>
  <div class="container mx-auto">
    <navBar>
      <template v-slot:link1>
        <RouterLink class="w-full text-center" to="/">Home</RouterLink>
      </template>
      <template v-slot:link2>
        <RouterLink class="w-full text-center" to="/about">About</RouterLink>
      </template>


      <template v-slot:btn1>
        <theme></theme>
      </template>
    </navBar>
    <RouterView />
  </div>
  <footerBar></footerBar>
</template>

<style scoped></style>
