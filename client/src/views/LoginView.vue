<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { ref, type Ref } from 'vue';

const userStore = useUserStore();

let isBusy : Ref<boolean> = ref(false);

async function loginAsync() {
    if (!isBusy.value) {
        isBusy.value = true;
    
        try {
            await userStore.loginAsync('', '');
            await router.push('/home');
        } catch (error) {
            alert(error)
        } finally {
            isBusy.value = false;
        }
    }
}

</script>

<template>
    This will be the login view

    <router-link 
        to="/home"
    >
        <button @click="loginAsync" :disabled="isBusy">
          Login
        </button>
    </router-link>
</template>import { type Ref, ref } from 'vue';import { type Ref, ref } from 'vue';

