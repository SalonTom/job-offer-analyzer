<script setup lang="ts">
import LoaderComponent from '@/components/core/LoaderComponent.vue';
import ModaleComponent from '@/components/core/ModaleComponent.vue';
import axiosInstance from '@/composables/axiosComposable';
import type { Factor } from '@/models/Factor';
import { JobOfferAnalysis } from '@/models/JobOfferAnalysis';
import { GeminiService } from '@/services/geminiService';
import { useUserStore } from '@/stores/userStore';
import { reactive, ref, type Ref } from 'vue';

/** Is thre a process running ? */
const isBusy : Ref<boolean> = ref(false);

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
    <div class="homepage">
        <div style="display: flex; flex-direction: column; gap: 16px; padding: 0px 32px; width: 100%; justify-content: center;">
            <div class="headline">
                Let's find out !
            </div>
            <div class="subtitle">
                Copy the job offer description and hit the green button. You'll see in a few seconds if this job is a match !
            </div>
        </div>
        <div class="prompt-side">
            <div style="position : relative; height: 100%; width: 100%; display: flex; flex-grow: 1;">
                <textarea placeholder="Job Description" v-model="jobOfferDescription" :disabled="isBusy" style="flex-grow: 1; width: 100%; border-radius: 6px; border: none; box-shadow: inset 0px 4px 16px 4px rgba(0,0,0,0.1); padding: 32px; resize: none;"></textarea>
                <div v-if="isBusy" style="position: absolute; top: 0;left: 0;right: 0;bottom: 0; background-color: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                    <LoaderComponent></LoaderComponent>
                </div>
            </div>
            <button class="button btn-primary" @click="checkJobAsync" :class="{ 'btn-disabled' : isBusy }">
                <template v-if="!isBusy">
                    Check if this job is made for you !
                </template>
            </button>
        </div>

    </div>

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
                        <div>
                            Url : <span style="font-style: italic;">{{ newJobOffer.url ?? 'No url defined.' }}</span>
                        </div>
                    </div>
                    <div style="flex-grow: 2; text-align: center;">
                        {{ newJobOffer.note }} / 10
                    </div>
                </div>
                <div>
                    {{ result["comment"] }}
                </div>
            </div>
        </template>
        <template v-slot:buttons>
            <div style="display: flex; gap: 4px;">
                <button class="button btn-secondary" @click="closeModale">
                    Close window
                </button>
                <button class="button btn-primary" @click="saveJobOfferModaleRef?.showModale()">
                    Save for later
                </button>
            </div>
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
            <div style="display: flex; gap: 4px;">
                <button @click="closeModale">
                    Cancel
                </button>
                <button :disabled="isBusy" @click="saveJobOfferAsync">
                    Save the job offer
                </button>
            </div>
        </template>
    </ModaleComponent>
</template>

<style>

:root{
    --primary-color: #87C6BE;
    --primary-color-dark: #75AAA4;
    --primary-color-light: #ECFAF4;

    --text-color : #15181F;

    --grey: #ECECEC;
    --grey-dark: #D0D0D0;
}

.headline {
    font-size: 52px;
    font-weight: 900;
}

.title {
    font-size: 24px;
    font-weight: bold;
    line-height: 32px;
}

.subtitle {
    font-size: 18px;
    line-height: 24px;
}

.button {
    border-radius: 6px;
    display: flex;
    gap: 12px;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    justify-content: center;
    align-items: center;

    font-weight: bold;

    height: 40px;

    transition: 200ms all ease-in-out;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    font-size: 16px;
}

.btn-secondary {
    background-color: transparent;
    font-weight: bold;
    border: 1px solid var(--grey);
}

.btn-secondary:hover {
    border: 1px solid var(--grey-dark);
}

.text-button {
    position: relative;
    cursor: pointer;
}

.text-button:hover {
    text-shadow: 1px 0px 0px var(--text-color);
}

.text-button::before {
    content: '';
    position: absolute;
    bottom: 0px;
    transform: translateY(200%);
    height: 1px;
    background-color: var(--text-color);
    width: 0%;

    transition: all 150ms ease-in;
}

.text-button:hover::before {
    width: 100%;
}


.btn-primary:hover {
    background-color: var(--primary-color-dark);
}

.btn-disabled {
    cursor: not-allowed;
    background-color: var(--grey);
}

.button.btn-disabled:hover {
    background-color: var(--grey) !important;
}

.homepage {
    display: flex; gap: 32px; padding: 10vh 10vw; width: 100%; min-height: 100%; flex-grow: 1;
}

.text-small {
    font-size: 14px;
}

.router-active-link {
    font-weight: bold !important;
}

.prompt-side {
    display: flex; flex-direction: column; gap: 12px; width: 100%; align-items: end; flex-grow: 1;
}

@media (max-width: 800px) {
    .homepage {
        flex-direction: column;
        height: 100%;
        width: auto;
        text-align: center;
    }

    .prompt-side {
        align-items: normal;
    }

    .button {
        height: fit-content;
    }
}

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