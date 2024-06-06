<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue';
</script>

<template>
  <header>
    <NavbarComponent/>
  </header>
  <main style="display: flex; flex-direction: column;">
    <RouterView />
  </main>
  <footer>
    App created by me !
  </footer>
</template>
