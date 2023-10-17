<script setup>
import { RouterLink, RouterView } from 'vue-router'
import footerBar from './components/footerBar.vue'
import navBar from './components/navBar.vue'
import theme from './components/theme.vue'
import type from './components/type.vue'

</script>

<template>
  <div class="container mx-auto">
    <navBar>
      <template v-slot:link1>
        <RouterLink class="w-full text-center" to="/">Home</RouterLink>
      </template>
      <template v-slot:link2>
        <RouterLink class="w-full text-center" to="/about">Order</RouterLink>
      </template>
      <template v-slot:link3>
        <RouterLink class="w-full text-center" to="/news">News</RouterLink>
      </template>


      <template v-slot:btn1>
        <theme></theme>
      </template>

      <template v-slot:btn2>
        <type></type>
      </template>

    </navBar>
    <RouterView />
  </div>
  <footerBar></footerBar>
</template>

<style scoped></style>
