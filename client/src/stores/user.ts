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
        // scores.value = {
        //     "Persuasiveness": 8,
        //     "Flexibility": 9,
        //     "Extraversion": 3,
        //     "Emotional distance": 8,
        //     "Improvisation": 3,
        //     "Rationalism": 8,
        //     "Respect for rules": 9,
        //     "Work involvement": 8,
        //     "Desire for power": 1,
        //     "Need for action": 2,
        //     "Ambition": 3,
        //     "Need for autonomy": 3,
        //     "Altruism": 9,
        //     "Novelty seeking": 7
        // }
        scores.value = {
            "Persuasiveness": 1,
            "Flexibility": 1,
            "Extraversion": 1,
            "Emotional distance": 1,
            "Improvisation": 1,
            "Rationalism": 1,
            "Respect for rules": 1,
            "Work involvement": 1,
            "Desire for power": 1,
            "Need for action": 1,
            "Ambition": 1,
            "Need for autonomy": 1,
            "Altruism": 1,
            "Novelty seeking": 1
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
