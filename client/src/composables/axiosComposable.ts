import router from "@/router";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import axios, { type AxiosInstance } from "axios"

/** Axios instance */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL,
});


/**
 * Request interceptor.
 * Add the token for each request.
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = useUserStore().authToken;

        if (!!authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

-/**
 * Response interceptor
 * manage refresh of the token
 */
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const originalRequest = error.config.URL;
    if (error.response.status === 401) {
        useUserStore().logout();
        router.push('/login');

        useToastStore().addToast('You have been disconnected. Please log in again.', 'neutral');
        return axios(originalRequest);
    }
});

export default axiosInstance;