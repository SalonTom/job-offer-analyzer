<script setup lang="ts">
import { Factor } from '@/models/Factor';
import { onMounted, ref, type Ref } from 'vue';

import ModaleComponent from '@/components/core/ModaleComponent.vue';
import { useUserStore } from '@/stores/userStore';
import axiosInstance from '@/composables/axiosComposable';

/** Is thre a process running ? */
const isBusy : Ref<boolean> = ref(false);

/** Component props. */
const props = defineProps({
    factor : Factor
});

/** Component events */
const emit = defineEmits(['factorUpdate']);

/** Ref to the edit modale. */
const editFactorModaleRef : Ref<typeof ModaleComponent | null> = ref(null);

/** Boolean used to display or not the tip that leads to the update modale. */
const cardIsHovered : Ref<Boolean> = ref(false);

/** User store. */
const userStore = useUserStore();

/** Boolean to show or not the factors edition modale. */
const showFactorEditModale : Ref<boolean> = ref(false);

/** Current factor */
const factor : Ref<Factor> = ref(new Factor(props.factor));

/** Factor new score. */
const newScore : Ref<number> = ref(0);

onMounted(() => {
    newScore.value = props.factor?.score ?? 0
});

/**
 * Method used when rado button value changes the factor score.
 * @param score new score.
 */
function onScoreChange(score : number) {
    newScore.value = score;
}

/**
 * Method triggered when closing modale.
 */
function closeModale() {
    newScore.value = 0;
    editFactorModaleRef?.value?.closeModale();
}

/**
 * Method used to update the user data with the new factor score.
 */
async function updateFactorAsync() {
    if (!isBusy.value) {
        isBusy.value = true;

        try {
            const factorIndex : number = userStore.user.factors.findIndex((f) => f.id == factor?.value.id);
            const userFactors : Factor[] = [...userStore.user.factors];

            if (factorIndex == -1) {
                const newFactor : Factor = new Factor(factor.value);
                newFactor.score = newScore.value;
                userFactors.push(newFactor);
            } else {
                userFactors[factorIndex].score = newScore.value;
            }

            await axiosInstance.patch('/api/users/', {
                id : userStore.user.id,
                factors : userFactors
            });

            factor.value.score = newScore.value;
            userStore.user.factors = userFactors;

            userStore.profileCompletionPercentage = Math.round(userStore.user.factors.length / 14 * 100);

        } catch (error) {
            alert(error);
        } finally {
            isBusy.value = false;
        }
    }
}

</script>

<template>
    <div class="grey-round factor" @mouseenter="cardIsHovered = true" @mouseleave="cardIsHovered = false">
        <div class="blur-bg">
            <div class="factor-name">
                <div style="font-size: 16px; font-weight: 600;">
                    {{ factor?.name }}
                    <div style="margin-top: 4px; font-size: 14px;">
                        <span style="font-style: italic;">Opposite factor :</span> {{ factor?.opposite_name }}
                    </div>
                </div>
                <template v-if="factor?.score">
                    <div style="height:fit-content; width: fit-content; font-weight: bold;  font-size: 12px ; border-radius: 4px; padding: 4px 8px; background-color: #13f377e3; color: green;">
                        {{ factor?.score }}&nbsp/&nbsp10
                    </div>
                </template>
                <template v-else>
                    <div style="font-style: italic;">
                        Not scored yet
                    </div>
                </template>
            </div>
            <div style="margin-top: 12px;">
                {{ factor?.description }}
            </div>
        </div>

        <template v-if="cardIsHovered">
            <div class="hover-tip" @click="editFactorModaleRef?.showModale()">
                Tips : Click to score the factor
            </div>
        </template>
    </div>

    <ModaleComponent ref="editFactorModaleRef">
        <template v-slot:header>
            Update {{ factor?.name?.toLocaleLowerCase() }} score
        </template>

        <template v-slot:content>
            <div style="margin-bottom: 24px;">
                {{ factor?.description }}
            </div>
            <div class="score-section">
                {{ factor?.name }}
                <div class="score-container">
                    <template v-for="score in 3">
                        <input type="radio" :name="`${factor}-factor-score`" @change="onScoreChange(10 - score)" :checked="newScore == 10 - score" :style="{'height':  `${48/score}px`, 'width':  `${48/score}px`}"></input>
                    </template>
                </div>
                <div class="score-container">
                    <template v-for="score in 3">
                        <input type="radio" :name="`${factor}-factor-score`" @change="newScore = 4 - score" :checked="factor?.score == 4 - score" :style="{'height':  `${48/(4 - score)}px`, 'width':  `${48/(4 - score)}px`}"></input>
                    </template>
                </div>
                {{ factor?.opposite_name }}
            </div>
        </template>

        <template v-slot:buttons>
            <button @click="closeModale">
                Cancel
            </button>
            <button :disabled="newScore == 0 || newScore == factor?.score || isBusy" @click="updateFactorAsync">
                Update score
            </button>
        </template>
    </ModaleComponent>
</template>

<style>
.factor-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.score-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.score-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.factor {
    border: 1px solid rgba(222, 222, 222, 0.856);
    transition: 0.2s all ease-in-out;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.factor:hover {
    transform: scale(1.05);
}

.factor:hover > div.blur-bg {
    filter: blur(6px);
}

@media (max-width: 1130px) {
    .factor {
        max-width: 100%
    }
}

@media (min-width: 1130px) {
    .factor {
        width: 400px;
    }
}

.hover-tip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(209, 209, 209, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>