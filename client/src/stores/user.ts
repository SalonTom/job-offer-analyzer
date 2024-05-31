import { ref, computed, type Ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import AuthService from '@/services/authService';
import router from '@/router';
import { User } from '@/models/User';

export const useUserStore = defineStore('user', () => {
    let user : Ref<User> = ref(new User());

    async function loginAsync(username : string, password : string) : Promise<void> {
        const responseData = await AuthService.loginAsync('tsalon', 'test');
        Object.assign(user.value, responseData.user);
        user.value.authToken = 'TOKEN';
    }

    function logout() : void {
        user.value = new User()
    }

  return { user, loginAsync, logout }
}, {
    persist: true
})
