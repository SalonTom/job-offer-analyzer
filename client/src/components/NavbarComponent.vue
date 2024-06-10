<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import LogoComponent from './LogoComponent.vue';

const router = useRouter()
const userStore = useUserStore();

const showNavbar : Ref<boolean> = ref(true);
const showLoginButtons : Ref<boolean> = ref(false);

const mobileMode : Ref<Boolean> = ref(false);

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

function checkMobileOnResize() {
    mobileMode.value = window.innerWidth <= 800;
}

onMounted(() => {
    if (window.innerWidth <= 800) {
        mobileMode.value = true;
    }

    window.addEventListener('resize', checkMobileOnResize);
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobileOnResize);
})

</script>

<template>
    <div class="nav-container" v-if="showNavbar">
        <router-link
            to="/home"
            v-slot="{ navigate }"
            class="nav-app-title"
            >
            <div @click="navigate">
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

            <template v-else-if="!mobileMode">
                <div style="display: flex; gap: 16px; align-items: center;">
                    <router-link to="/home" class="text-button">
                        Home
                    </router-link>
                    <router-link to="/saved-analysis" class="text-button">
                        Saved analysis
                    </router-link>
                    <div style="width: 2px; height: 20px; background-color: #ECECEC;"></div>
                </div>
                <router-link to="/profile" class="text-button">
                    Profile
                </router-link>
            </template>
        </div>

        <template v-if="mobileMode && showNavbar && !showLoginButtons">
            <Teleport to="body">
                <div class="shadow" style="position: sticky; background-color: white; bottom: 0px; padding-bottom: 32px; display: flex; justify-content: center; width: 100%;">
                    <div style=" width:100%; border-radius: 6px; padding: 8px 24px; display: flex; justify-content: center; align-items: center; gap: 32px;">
                        <router-link to="/home" style="display: flex; align-items: center; gap: 4px;">
                            <img src="../assets/icons/home.svg">
                            <div v-if="router.currentRoute.value.path == '/home'" class="text-small" style="color: var(--primary-color-dark)">Home</div>
                        </router-link>
                        <router-link to="/saved-analysis" style="display: flex; align-items: center; gap: 4px;">
                            <img src="../assets/icons/bookmark.svg">
                            <div v-if="router.currentRoute.value.path == '/saved_analysis'" class="text-small" style="color: var(--primary-color-dark)">Saved</div>
                        </router-link>
                        <router-link to="/profile" style="display: flex; align-items: center; gap: 4px;">
                            <img src="../assets/icons/account.svg">
                            <div v-if="router.currentRoute.value.path == '/profile'" class="text-small" style="color: var(--primary-color-dark)">Profile</div>
                        </router-link>
                    </div>
                </div>
            </Teleport>
        </template>
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

    .nav-app-title {
        background-color: transparent !important;
    }

    /* @media (max-width : 800px) {
        .nav-container {
            position: absolute;
            top: initial;
            box-shadow: 0px 4px 24px 16px rgba(0, 0, 0, 0.1);
        }
    } */
</style>