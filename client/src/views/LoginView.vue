<script setup lang="ts">
import LogoComponent from '@/components/LogoComponent.vue';
import LoaderComponent from '@/components/core/LoaderComponent.vue';
import FormValidation from '@/components/core/FormValidationComponent.vue';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

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
    if (!isBusy.value && await loginFormValidationRef?.value.validateFormAsync()) {
        isBusy.value = true;
    
        try {
            await userStore.loginAsync(username.value, password.value);
            await router.push('/home');
        } catch (error : any) {
            alert('Error trying to sign in.')
        } finally {
            isBusy.value = false;
        }
    }
}

/**
 * Ref to the sign in form validation.
 */
const loginFormValidationRef : Ref<typeof FormValidation | null> = ref(null)

/**
 * Method triggerde when enter key is pressed.
 * @param e 
 */
async function triggerOnEnterAsync(e : KeyboardEvent) {
    if (e.key === 'Enter') {
        await loginAsync();
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
                ref="loginFormValidationRef"
                :item="{username, password}" 
                :required-fields="['username', 'password']">

                <div class="inputs">
                    <div class="form-group">
                        <label class="required" for="username">Username</label>
                        <input type="text" placeholder="Username" name="username" v-model="username" @change="console.log(username)">
                    </div>
        
                    <div class="form-group">
                        <label class="required" for="password">Password</label>
                        <input type="password" placeholder="Password" name="password" v-model="password">
                    </div>
                </div>
                
            </FormValidation>

            <div class="login-footer">
                <template v-if="!isBusy">
                    <div class="text-small">No account ? <span style="font-weight: bold; cursor: pointer;" @click="router.push('/signup')">Sign up !</span></div>
                    <button class="button btn-primary" @click="loginAsync" :disabled="isBusy" submot>
                        Sign in
                    </button>
                </template>
                <template v-else>
                    <LoaderComponent style="transform: scale(0.8);"></LoaderComponent>
                </template>
            </div>
        </div>
    </div>
</template>


<style>

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    width: 100%;
    margin-bottom: 8px;
}

.form-group > label {
    font-weight: 500;
}

input {
    border: 1px solid var(--grey-dark);
    border-radius: 6px;
    padding: 12px 8px;
    transition: 200ms border ease-in-out;
    outline: none;
}

input:hover {
    border: 1px solid #A5A5A5;
}

input:focus {
    border: 1px solid var(--primary-color);
}

input::placeholder {
    color: var(--grey-dark);
}

input.error {
    border: 1px solid red;
}

label.error {
    color: red
}

.form-group > .required::after {
    content: '*';
    margin-left: 4px;
    color: var(--primary-color);
}

.login-footer {
    display: flex;
    gap: 12px;
    align-items: center;
}

.shadow {
    box-shadow: 0px 4px 24px 16px rgba(0, 0, 0, 0.1);
}

.container {
    display: flex;
    padding: 32px;
    gap: 16px;
    flex-direction: column;
    background-color: white;
    border-radius: 6px;
    align-items: center;

    min-width: 340px;
}

.inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom: 1px solid var(--grey);
    padding-bottom: 16px;
    width: 100%;
}

</style>
