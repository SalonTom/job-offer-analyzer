<script setup lang="ts">
import { GeminiService } from '@/services/geminiService';
import { useUserStore } from '@/stores/user';
import { computed, reactive, ref, type Ref } from 'vue';

const isBusy : Ref<boolean> = ref(false)
const showResultModale:  Ref<boolean> = ref(false)

let jobOffer = reactive({
    company : '',
    title : '',
    description : ''
})

let result : Record<any, any> = reactive({comment : '', note: 0, jobTitle : '', company : ''})

async function checkJobAsync() : Promise<void> {
    isBusy.value = true

    if (jobOffer.description) {
        try {
            result = await GeminiService.callGeminiAsync(jobOffer.description)
            showResultModale.value = true
            jobOffer = {
                "company" : '',
                "title" : '',
                "description" : ''
            }
        } catch (error) {
            alert(error)
        }
    }

    isBusy.value = false
}

const jobFitScore = computed(() => {
    let score = 0;

    Object.keys(useUserStore().scores).forEach((key : string) => {
        score += useUserStore().scores[key] == result[key] ? 1 : 0;
    });

    return parseFloat((score*10/14).toFixed(2));
})


</script>

<template>
    <h1>Home view</h1>

    <template v-if="!isBusy">
        <div class="column">
            <textarea placeholder="Job Description" v-model="jobOffer.description"></textarea>
        </div>
        <div>
            <button @click="checkJobAsync">Check if this job is made for you !</button>
        </div>
    </template>
    <template v-else>
        Analyzing job offer ...
    </template>

    <div v-if="showResultModale" class="result-modale">
        <div class="modale-header" @click="showResultModale = false">
            <div>
                Job offer analysis summary
            </div>
            <div>
                X
            </div>
        </div>
        <div class="result-modale-content">
            <div class="recap">
                <div class="job-recap">
                    <div>
                        {{ result["jobTitle"] }}
                    </div>
                    <div>
                        {{ result["company"] }}
                    </div>
                </div>
                <div style="flex-grow: 2; text-align: center;">
                    {{ jobFitScore }} / 10
                </div>
            </div>
            <div>
                {{ result["comment"] }}
            </div>
        </div>
    </div>
</template>

<style>

.recap {
    display: flex;
    gap: 32px;
    width: 100%;
    align-items: center;
    margin-bottom: 24px;
}

.job-recap {
    display: flex;
    flex-direction: column;
    flex-grow: 8;
    border-right: solid 1px grey;
}

.column {
    display: flex;
    flex-direction: column;
}

.result-modale {
    position: absolute;
    height: fit-content;
    min-width: 61vw;
    background-color:
    white;
    left: 50%;
    bottom: 50%;
    transform: translate(-50%, 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: rgba(128, 128, 128, 0.2) 4px 4px 16px 39vw;
}

.result-modale-content {
    padding: 0px 48px 48px 48px;
}

.modale-header {
    height: fit-content; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 32px 48px 48px 48px; color: grey;
}
</style>