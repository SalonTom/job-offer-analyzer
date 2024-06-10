<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue';

const router = useRouter();
</script>

<template>
  <header>
    <NavbarComponent/>
  </header>
  <main style="display: flex; flex-direction: column;">
    <RouterView />
  </main>
  <footer v-if="!(['/login', '/signup'].includes(router.currentRoute.value.path))">
    App created by me !
  </footer>
</template>
