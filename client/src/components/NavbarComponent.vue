<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore();

const showNavbar : Ref<boolean> = ref(true);
const showLoginButtons : Ref<boolean> = ref(false);


function logout() : void {
    try {
        userStore.logout();
        router.push('/');
    } catch (error) {
        alert(error)
    }
}

watch(router.currentRoute, (new_value, old_value) => {
    showNavbar.value = !(['/login', '/signup'].includes(new_value.path));
}, { immediate: true });

watch(userStore, (new_value, old_value) => {
    showLoginButtons.value = !(userStore.user.authToken);
}, { immediate: true });

</script>

<template>
    <div class="nav-container" v-if="showNavbar">
        <router-link
            to="/home"
            v-slot="{ navigate }"
            >
            <div class="nav-app-title" @click="navigate">App name</div>
        </router-link>

        <div class="nav-connect-section">
            <template v-if="showLoginButtons">
                
                <router-link
                    to="/signup"
                    v-slot="{ navigate }"
                    >
                    <div class="text-button" @click="navigate">Sign Up</div>
                </router-link>

                <router-link
                    to="/login"
                    v-slot="{ navigate }"
                    >
                    <button class="main-button" @click="navigate">Login</button>
                </router-link>

            </template>

            <template v-else>
                <button class="text-button" @click="logout">Log out</button>
                <router-link
                    to="/profile"
                    v-slot="{ navigate }"
                    >
                    <button class="profile" @click="navigate">
                        <div>T</div>
                    </button>
                </router-link>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
    }

    .nav-connect-section {
        display: flex;
        gap: 12px;
    }

    .profile {
        height: 40px;
        width: 40px;
        border-radius: 6px;

        border : 1px solid;
    }
</style>