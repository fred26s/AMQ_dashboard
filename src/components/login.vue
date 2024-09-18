<script setup>
import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'
</script>

<template>
  <SignedOut>
    <SignInButton v-slot="props" as-child>
      <button v-bind="props" class="btn btn-outline btn-info btn-sm">Login</button>
    </SignInButton>
  </SignedOut>
  <SignedIn>
    <UserButton afterSignOutUrl="https://callbackhell.xyz/amqboard" />
  </SignedIn>
</template>
