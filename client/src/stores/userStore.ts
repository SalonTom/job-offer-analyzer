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

    let authToken : Ref<string> = ref('')
    let refreshToken : Ref<string> = ref('')

    /** Profile factors completion percentage (100% -> all factors have been scored by the user */
    let profileCompletionPercentage : Ref<number> = ref(0);

    /**
     * Method used to log the user in and update the store infos.
     * @param username username
     * @param password password
     * @returns user stored value
     */
    async function loginAsync(username : string, password : string) : Promise<User> {

        // Assign user data
        const responseData = await AuthService.loginAsync('tsalon', 'test');
        Object.assign(user.value, responseData.user);
        authToken.value = responseData.access;
        refreshToken.value = responseData.refresh;

        // Compute user profile completion percentage
        profileCompletionPercentage.value = Math.round(user.value.factors.length / 14 * 100);

        return user.value;
    }

    /**
     * Method to log the user out from the application.
     */
    function logout() : void {
        user.value = new User();
        authToken.value = ''
        refreshToken.value = ''
    }

  return { user, profileCompletionPercentage, authToken, loginAsync, logout }
}, {
    persist: true
})
