<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function login() {
    try {
        userStore.login('test', 'test');
        router.push('/home');
    } catch (error) {
        alert(error)
    }
}

</script>

<template>
    This will be the login view

    <router-link 
        to="/home"
    >
        <button @click="login">
          Login
        </button>
    </router-link>
</template>