import axios, { type AxiosResponse } from "axios";

export default class AuthService {
    public static async loginAsync(username : string, password: string) {
        const instance = axios.create({
            baseURL: 'http://127.0.0.1:8000'
            });

        const response = await instance.post('/api/auth/login', {
            'username': username,
            'password' : password
        });

        return response.data
    }
}