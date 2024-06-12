<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoaderComponent from '@/components/core/LoaderComponent.vue';
import FormValidation from '@/components/core/FormValidationComponent.vue';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
import { User } from '@/models/User';
import { useToastStore } from '@/stores/toastStore';

/** User store */
const userStore = useUserStore();

/** Is there a process running ? */
let isBusy : Ref<boolean> = ref(false);

/** New user */
const newUser : Ref<User> = ref(new User());

/**
 * Method to log the user in after the form was filled.
 */
async function singUpAsync() {
    if (!isBusy.value && await singUpFormValidationRef?.value?.validateFormAsync()) {
        isBusy.value = true;
    
        try {
            await userStore.signUpAsync(newUser.value);
            await router.push('/home');
            useToastStore().addToast(`Welcome to Sparky, ${newUser.value.username} :)`, 'positive');
        } catch (error : any) {
            useToastStore().addToast('Something went wrong signing up ...', 'negative');
        } finally {
            isBusy.value = false;
        }
    }
}

/** Ref to the sign in form validation. */
const singUpFormValidationRef : Ref<typeof FormValidation | null> = ref(null)

/**
 * Method triggerde when enter key is pressed.
 * @param e 
 */
async function triggerOnEnterAsync(e : KeyboardEvent) {
    if (e.key === 'Enter') {
        await singUpAsync();
    }
}

onMounted(() => {
    window.addEventListener('keypress', triggerOnEnterAsync)
})

onUnmounted(() => {
    window.removeEventListener('keypress', triggerOnEnterAsync);
})

</script>

<template>
    
    <div style="width: 100%; height: 100%; background-color: var(--primary-color-light); flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        
        <div class="container shadow">
            <LogoComponent></LogoComponent>

            <FormValidation 
                ref="singUpFormValidationRef"
                :item="newUser" 
                :required-fields="['last_name', 'first_name', 'email', 'username', 'password']">

                <div class="inputs">
                    <div class="form-group">
                        <label class="required" for="last_name">Last name</label>
                        <input type="text" placeholder="Last name" name="last_name" v-model="newUser.last_name">
                    </div>

                    <div class="form-group">
                        <label class="required" for="first_name">First name</label>
                        <input type="text" placeholder="Username" name="first_name" v-model="newUser.first_name">
                    </div>

                    <div class="form-group">
                        <label class="required" for="email">Email</label>
                        <input type="text" placeholder="Username" name="email" v-model="newUser.email">
                    </div>

                    <div class="form-group">
                        <label class="required" for="username">Username</label>
                        <input type="email" placeholder="Email address" name="username" v-model="newUser.username">
                    </div>
        
                    <div class="form-group">
                        <label class="required" for="password">Password</label>
                        <input type="password" placeholder="Password" name="password" v-model="newUser.password">
                    </div>
                </div>
                
            </FormValidation>

            <div class="login-footer">
                <template v-if="!isBusy">
                    <div class="text-small">Member already ? <span style="font-weight: bold; cursor: pointer;" @click="router.push('/login')">Sign in !</span></div>
                    <button class="button btn-primary" @click="singUpAsync" :disabled="isBusy" submot>
                        Sign up
                    </button>
                </template>
                <template v-else>
                    <LoaderComponent style="transform: scale(0.8);"></LoaderComponent>
                </template>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <ArrowLeftIcon class="icon-24" style="position: absolute; top: 32px; left: 32px; cursor: pointer;" @click="router.go(-1)"></ArrowLeftIcon>
    </Teleport>
</template>