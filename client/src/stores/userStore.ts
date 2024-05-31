import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import AuthService from '@/services/authService';
import { User } from '@/models/User';

/**
 * Store used to store the user infos.
 */
export const useUserStore = defineStore('user', () => {
    /** User object containg the infos */
    let user : Ref<User> = ref(new User());

    /**
     * Method used to log the user in and update the store infos.
     * @param username username
     * @param password password
     * @returns user stored value
     */
    async function loginAsync(username : string, password : string) : Promise<User> {
        const responseData = await AuthService.loginAsync('tsalon', 'test');

        Object.assign(user.value, responseData.user);
        user.value.authToken = 'TOKEN';

        return user.value;
    }

    /**
     * Method to log the user out from the application.
     */
    function logout() : void {
        user.value = new User()
    }

  return { user, loginAsync, logout }
}, {
    persist: true
})
