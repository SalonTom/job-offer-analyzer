import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const name : Ref<string> = ref('');
    const firstname : Ref<string> = ref('');
    const email : Ref<string> = ref('');
    const scores : Ref<any> = ref();

    const authToken : Ref<string> = ref('');

    function login(username : string, passwaord : string) : void {
        authToken.value =  'Thisisaauthtokenvalue'
        name.value = 'SALON'
        firstname.value = 'Tom'
        email.value = 'tom.salon@gmail.com'
        scores.value = {
            "Persuasiveness": 3,
            "Flexibility": 9,
            "Extraversion": 3,
            "Emotional distance": 7,
            "Improvisation": 7,
            "Rationalism": 9,
            "Respect for rules": 3,
            "Work involvement": 7,
            "Desire for power": 1,
            "Need for action": 3,
            "Ambition": 7,
            "Need for autonomy": 7,
            "Altruism": 1,
            "Novelty seeking": 7
        }
    }

    function logout() : void {
        authToken.value = ''
        name.value = ''
        firstname.value = ''
        email.value = ''
    }

  return { name, firstname, email, scores, authToken, login, logout }
}, {
    persist: true
})
