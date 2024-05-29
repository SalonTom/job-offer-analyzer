import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const authToken : Ref<string> = ref('');

    function login(username : string, passwaord : string) : void {
        authToken.value =  'Thisisaauthtokenvalue'
    }

    function logout() : void {
        authToken.value = '';
    }

  return { authToken, login, logout }
}, {
    persist: true
})
