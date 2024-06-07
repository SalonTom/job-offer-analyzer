import axiosInstance from "@/composables/axiosComposable";
import type { User } from "@/models/User";

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

    /**
     * Method used to sign a new user up.
     * @param newUser new user to create.
     * @returns the connected user
     */
        public static async signUpAsync(newUser : User) {

            const response = await axiosInstance.post('/api/auth/signup/', newUser);
            return response.data
        }
}