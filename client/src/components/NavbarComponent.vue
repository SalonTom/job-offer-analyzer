<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import LogoComponent from './LogoComponent.vue';

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
    showLoginButtons.value = !(userStore.authToken);
}, { immediate: true });

</script>

<template>
    <div class="nav-container" v-if="showNavbar">
        <router-link
            to="/home"
            v-slot="{ navigate }"
            >
            <div class="nav-app-title" @click="navigate">
                <LogoComponent></LogoComponent>
            </div>
        </router-link>

        <div class="nav-connect-section">
            <template v-if="showLoginButtons">
                
                <router-link
                    to="/login"
                    v-slot="{ navigate }"
                    >
                        <div class="text-button" @click="navigate">Sign In</div>
                    </router-link>

                <router-link
                    to="/signup"
                    v-slot="{ navigate }"
                    >
                    <button class="button btn-primary" @click="navigate">Sign Up</button>
                </router-link>

            </template>

            <template v-else>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <router-link to="/home" class="text-button">
                        Home
                    </router-link>
                    <router-link to="/analysis" class="text-button">
                        Saved analysis
                    </router-link>
                    <div style="width: 2px; height: 20px; background-color: #ECECEC;"></div>
                </div>
                <router-link to="/profile" class="text-button">
                    Profile
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
        padding: 0 10vw;
    }

    .nav-connect-section {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .profile {
        height: 40px;
        width: 40px;
        border-radius: 6px;

        border : 1px solid;
    }
</style>