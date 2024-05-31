import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import AuthService from '@/services/authService';
import { User } from '@/models/User';
import axiosInstance from '@/composables/axiosComposable';

/**
 * Store used to store the user infos.
 */
export const useUserStore = defineStore('user', () => {

    /** User object containg the infos */
    let user : Ref<User> = ref(new User());

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
        user.value.authToken = 'TOKEN';


        // Compute user profile completion percentage
        const nbFactors : number = (await axiosInstance.get('/api/factors/')).data.length;
        profileCompletionPercentage.value = Math.round(user.value.factors.length / nbFactors * 100);

        return user.value;
    }

    /**
     * Method to log the user out from the application.
     */
    function logout() : void {
        user.value = new User()
    }

  return { user, profileCompletionPercentage, loginAsync, logout }
}, {
    persist: true
})
