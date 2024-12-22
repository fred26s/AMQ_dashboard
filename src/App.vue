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

const uu = [
  'user_2blHUZx7JZOaXItnyZUnOp6lhTq',
  'user_2mCjM9yukFUtAqeqMO1H1Jj0NZy',
  'user_2oh27yaxqyr8xVY3ZaXMpE40Gvo'
]
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
        <li>
          <RouterLink class="w-full text-center" to="/tradePulse">tradePulse</RouterLink>
        </li>
        <li>
          <RouterLink class="w-full text-center" to="/plan">plan</RouterLink>
        </li>
      </template>

      <template v-slot:btn1>
        <theme class="mr-3"></theme>
      </template>

      <template v-slot:btn2>
        <login></login>
      </template>
    </navBar>
    <!-- 固定头部banner -->
    <div class="px-2">
      <div role="alert" class="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-info h-6 w-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div class="flex flex-row w-full text-xs justify-between content-center flex-wrap">
          <div class="badge badge-secondary font-bold">NO FOMO</div>
          <div class="badge badge-secondary font-bold">绝对自信</div>
          <div class="badge badge-secondary font-bold">买定离手</div>
          <div class="badge badge-secondary font-bold">仓位清心</div>
          <div class="badge badge-secondary font-bold">加仓谨慎</div>
          <div class="badge badge-secondary font-bold">顺应宏观</div>
          <div class="badge badge-secondary font-bold">别猜方向</div>
        </div>
      </div>
    </div>
    <SignedIn>
      <RouterView v-if="uu.includes(user.id)" />
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
