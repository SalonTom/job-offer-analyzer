import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const name : Ref<string> = ref('');
    const firstname : Ref<string> = ref('');
    const email : Ref<string> = ref('');

    const authToken : Ref<string> = ref('');

    function login(username : string, passwaord : string) : void {
        authToken.value =  'Thisisaauthtokenvalue'
        name.value = 'SALON'
        firstname.value = 'Tom'
        email.value = 'tom.salon@gmail.com'
    }

    function logout() : void {
        authToken.value = ''
        name.value = ''
        firstname.value = ''
        email.value = ''
    }

  return { name, firstname, email, authToken, login, logout }
}, {
    persist: true
})
