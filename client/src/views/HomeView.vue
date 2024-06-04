<script setup lang="ts">
import ModaleComponent from '@/components/core/ModaleComponent.vue';
import axiosInstance from '@/composables/axiosComposable';
import type { Factor } from '@/models/Factor';
import { JobOfferAnalysis } from '@/models/JobOfferAnalysis';
import { GeminiService } from '@/services/geminiService';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, reactive, ref, type Ref } from 'vue';

/** Is thre a process running ? */
const isBusy : Ref<boolean> = ref(false)

/** Ref to the modale containing the results */
const showResultModaleRef : Ref<typeof ModaleComponent | null> = ref(null);

/** Ref to the modale containing the svae form */
const saveJobOfferModaleRef : Ref<typeof ModaleComponent | null> = ref(null);

/** Job offer description to analyze */
const jobOfferDescription : Ref<string> = ref('');

let newJobOffer = reactive(new JobOfferAnalysis());

/** Result for the analysis */
let result : Record<any, any> = reactive({comment : '', note: 0, jobTitle : '', company : ''})

/**
 * Method used to launch the job analysis.
 */
async function checkJobAsync() : Promise<void> {
    
    if (!isBusy.value && jobOfferDescription.value) {
        isBusy.value = true
        try {
            result = await GeminiService.callGeminiAsync(jobOfferDescription.value);

            newJobOffer.comment = result.comment;
            newJobOffer.note = jobFitScore();
            newJobOffer.company = result.company;
            newJobOffer.job_title = result.job_title;

            showResultModaleRef.value?.showModale();
        } catch (error) {
            alert(error)
        } finally {
            isBusy.value = false;
        }
    }

    isBusy.value = false
}

/**
 * Method to save the job offer analysis.
 */
async function saveJobOfferAsync() {
    if (!isBusy.value) {
        isBusy.value = true;
        
        try {
            await axiosInstance.post('/api/jobofferanalysis/', newJobOffer);

            alert('Your offer was registered !')
            
        } catch (error) {
            alert(error)
        }
    } 
}

function closeModale() {
    newJobOffer = new JobOfferAnalysis();
    jobOfferDescription.value = '';
    showResultModaleRef.value?.closeModale();
}

/** Computed method to get the fit score between the user profile and the job offer. */
function jobFitScore() {
    let score = 0;
    let userFactors : Factor[] = useUserStore().user.factors;

    userFactors.forEach((factor : Factor) => {
        if (factor.name) score += factor.score == result[factor.name] ? 1 : 0;
    });

    return parseFloat((score*10/14).toFixed(2));
}


</script>

<template>
    <h1>Home view</h1>

    <template v-if="!isBusy">
        <div class="column">
            <textarea placeholder="Job Description" v-model="jobOfferDescription"></textarea>
        </div>
        <div>
            <button @click="checkJobAsync">Check if this job is made for you !</button>
        </div>
    </template>
    <template v-else>
        Analyzing job offer ...
    </template>

    <ModaleComponent ref="showResultModaleRef">
        <template v-slot:header>
            Job offer analysis summary
        </template>
        <template v-slot:content>
            <div class="result-modale-content">
                <div class="recap">
                    <div class="job-recap">
                        <div>
                            {{ result["job_title"] }}
                        </div>
                        <div>
                            {{ result["company"] }}
                        </div>
                    </div>
                    <div style="flex-grow: 2; text-align: center;">
                        {{ newJobOffer.note }} / 10
                    </div>
                </div>
                <div>
                    {{ result["comment"] }}
                </div>
                <div>
                    Url : <span style="font-style: italic;">{{ newJobOffer.url ?? 'No url defined.' }}</span>
                </div>
            </div>
        </template>
        <template v-slot:buttons>
            <button @click="closeModale">
                Close window
            </button>
            <button :disabled="isBusy" @click="saveJobOfferModaleRef?.showModale()">
                Save for later
            </button>
        </template>
    </ModaleComponent>

    <ModaleComponent ref="saveJobOfferModaleRef">
        <template v-slot:header>
            Save the job offer analysis
        </template>
        <template v-slot:content>
            <form
                @submit="saveJobOfferAsync"
                method="post"
            >
                <div> 
                    <label for="company">Company name</label>
                    <input
                    id="company"
                    v-model="newJobOffer.company"
                    type="text"
                    name="company"
                    >
                </div>
                <div>
                    <label for="job_title">Job title</label>
                    <input
                    id="job_title"
                    v-model="newJobOffer.job_title"
                    type="text"
                    name="job_title"
                    >
                </div>
                <div>
                    <label for="comment">Analysis</label>
                    <input
                    id="comment"
                    v-model="newJobOffer.comment"
                    type="text"
                    name="comment"
                    >
                </div>
                <div>
                    <label for="url">Job offer link</label>
                    <input
                    id="url"
                    v-model="newJobOffer.url"
                    type="text"
                    name="url"
                    >
                </div>
            </form>
        </template>
        <template v-slot:buttons>
            <button @click="closeModale">
                Cancel
            </button>
            <button :disabled="isBusy" @click="saveJobOfferAsync">
                Save the job offer
            </button>
        </template>
    </ModaleComponent>
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
</style>