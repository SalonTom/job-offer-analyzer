<script setup lang="ts">
import type { Factor } from '@/models/Factor';
import { GeminiService } from '@/services/geminiService';
import { useUserStore } from '@/stores/user';
import { computed, reactive, ref, type Ref } from 'vue';

/** Is thre a process running ? */
const isBusy : Ref<boolean> = ref(false)

/** Boolean to show the modale containing the results */
const showResultModale:  Ref<boolean> = ref(false)

/** Job Offer Object containing the job offer infomations */
let jobOffer = reactive({
    company : '',
    title : '',
    description : ''
})

/** Result for the analysis */
let result : Record<any, any> = reactive({comment : '', note: 0, jobTitle : '', company : ''})

/**
 * Method used to launch the job analysis.
 */
async function checkJobAsync() : Promise<void> {
    
    if (!isBusy.value && jobOffer.description) {
        isBusy.value = true
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

/** Computed method to get the fit score between the user profile and the job offer. */
const jobFitScore = computed(() => {
    let score = 0;
    let userFactors : Factor[] = useUserStore().user.factors;

    userFactors.forEach((factor : Factor) => {
        score += factor.score == result[factor.name] ? 1 : 0;
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