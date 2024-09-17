<script setup>
import { RouterLink, RouterView } from 'vue-router'
import footerBar from './components/footerBar.vue'
import navBar from './components/navBar.vue'
import theme from './components/theme.vue'
// import type from './components/type.vue'
import login from './components/login.vue'

import { SignedIn, useOrganization, useUser } from 'vue-clerk'
const { organization } = useOrganization()
console.log('organization: ', organization)

const { user } = useUser()
console.log('user: ', user)
</script>

<template>
  <div class="container mx-auto">
    <navBar>
      <template v-slot:link1>
        <li>
          <RouterLink class="w-full text-center" to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink class="w-full text-center" to="/about">Order</RouterLink>
        </li>
        <li>
          <RouterLink class="w-full text-center" to="/news">News</RouterLink>
        </li>
        <li>
          <RouterLink class="w-full text-center" to="/monitor">Monitor</RouterLink>
        </li>
        <li>
          <RouterLink class="w-full text-center" to="/trace">Trace</RouterLink>
        </li>
      </template>

      <template v-slot:btn1>
        <theme class="mr-3"></theme>
      </template>

      <template v-slot:btn2>
        <login></login>
      </template>
    </navBar>
    <SignedIn>
      <RouterView v-if="user && user.id === 'user_2mCjM9yukFUtAqeqMO1H1Jj0NZy'" />
      <div v-else>
        <div class="mockup-code m-2">
          <pre data-prefix="$"><code>npm i StarBoard</code></pre>
          <pre data-prefix=">"><code>installing...</code></pre>
          <pre data-prefix=">" class="bg-warning text-warning-content"><code>Error!</code></pre>
          <pre data-prefix=">"><code>Seems you don't have enough access.</code></pre>
          <pre data-prefix=">"><code>Sorry about that...</code></pre>
        </div>
      </div>
    </SignedIn>
  </div>
  <footerBar></footerBar>
</template>

<style scoped></style>
