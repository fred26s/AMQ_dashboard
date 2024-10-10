<script setup>
import { RouterLink, RouterView } from 'vue-router'
import footerBar from './components/footerBar.vue'
import navBar from './components/navBar.vue'
import theme from './components/theme.vue'
// import type from './components/type.vue'
import login from './components/login.vue'

import { SignedIn, SignedOut, useOrganization, useUser } from 'vue-clerk'
const { organization } = useOrganization()
console.log('organization: ', organization)

const { user } = useUser()
console.log('user: ', user)

const uu = ['user_2blHUZx7JZOaXItnyZUnOp6lhTq', 'user_2mCjM9yukFUtAqeqMO1H1Jj0NZy']
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
        <li>
          <RouterLink class="w-full text-center" to="/draw">Draw</RouterLink>
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
      <RouterView v-if="user && uu.includes(user.id)" />
      <div v-else>
        <div class="mockup-code m-2">
          <pre data-prefix="$"><code>npm i StarBoard</code></pre>
          <pre data-prefix=">"><code>installing...</code></pre>
          <pre data-prefix=">" class="bg-warning text-warning-content"><code>Warning!</code></pre>
          <pre data-prefix=">"><code>Seems you don't have enough access.</code></pre>
          <pre data-prefix=">"><code>Sorry about that...</code></pre>
        </div>
      </div>
    </SignedIn>
    <SignedOut>
      <div class="mockup-code m-2">
        <pre data-prefix="$"><code>npm i StarBoard</code></pre>
        <pre data-prefix=">"><code>installing...</code></pre>
        <pre data-prefix=">" class="bg-error text-error-content"><code>Error!</code></pre>
        <pre data-prefix=">"><code>Seems you haven't logged in yet..</code></pre>
        <pre data-prefix=">"><code>Sorry about that...</code></pre>
      </div>
    </SignedOut>
  </div>
  <footerBar></footerBar>
</template>

<style scoped></style>
