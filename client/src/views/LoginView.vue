<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { ref, type Ref } from 'vue';

/** User store */
const userStore = useUserStore();

/** Is there a process running ? */
let isBusy : Ref<boolean> = ref(false);

/** User username */
const username : Ref<string> = ref('');

/** User password */
const password : Ref<string> = ref('');

/**
 * Method to log the user in after the form was filled.
 */
async function loginAsync() {
    if (!isBusy.value) {
        isBusy.value = true;
    
        try {
            await userStore.loginAsync(username.value, password.value);
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

    <button @click="loginAsync" :disabled="isBusy">
        Login
    </button>

</template>

