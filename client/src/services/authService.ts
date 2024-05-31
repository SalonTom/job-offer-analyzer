import axiosInstance from "@/composables/axiosComposable";

/**
 * Class for the authentication management.
 */
export default class AuthService {


    /**
     * Method used to log the user in.
     * @param username username
     * @param password password
     * @returns the connected user
     */
    public static async loginAsync(username : string, password: string) {

        const response = await axiosInstance.post('/api/auth/login/', {
            'username': username,
            'password' : password
        });

        return response.data
    }
}