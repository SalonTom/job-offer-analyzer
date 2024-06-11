<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue';
import Toast from './components/core/toasts/Toast.vue';
import { useToastStore } from './stores/toastStore';
import { ref } from 'vue';

const router = useRouter();

const toasts = ref(useToastStore().toasts)
</script>

<template>
  <header>
    <NavbarComponent/>
  </header>
  <main style="display: flex; flex-direction: column;">
    <RouterView />
  </main>
  <footer v-if="!(['/login', '/signup'].includes(router.currentRoute.value.path))" style="height: 48px;">
  </footer>
  <Teleport to="body">
    <div style="position: fixed; right: 0px; top: 0px; display: flex; flex-direction: column; overflow: hidden; gap: 8px; padding: 48px 10vw; pointer-events: none;">
      <TransitionGroup name="list">
        <div v-for="toast in toasts" :key="toast.message">
          <Toast :toast="toast"></Toast>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.list-move
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>