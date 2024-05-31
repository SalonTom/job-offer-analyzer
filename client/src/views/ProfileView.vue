<script setup lang="ts">
import axiosInstance from '@/composables/axiosComposable';
import type { Factor } from '@/models/Factor';
import { useUserStore } from '@/stores/userStore';
import { type Ref, ref, onMounted } from 'vue';

/** Userstore */
const userStore = useUserStore()

/** Boolean to show or not the factors edition modale. */
const showFactorsEditModale : Ref<boolean> = ref(false);

/** Array containing the user factors ids */
const userFactorsIds : Ref<number[]> = ref([]);

/** Array containing the factors. */
const factorsList : Ref<Factor[]> = ref([]);

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/api/factors/');
    factorsList.value = response.data;

    userFactorsIds.value = userStore.user.factors.map(factor => factor.id as number);
  } catch (error) {
    console.error(error);
  }
});

</script>

<template>
    <h1>Profile</h1>

    <div class="content-section">

        <!-- Personal info section -->
        <div>
            <h2>Personal infos</h2>
            <div class="grey-round">
                <div class="row">
                    <div class="form-group">
                        <label for="name">Nom</label>
                        <input id="name" :value="userStore.user.last_name" disabled>
                    </div>
                    <div class="form-group">
                        <label for="firstname">Prénom</label>
                        <input id="firstname" :value="userStore.user.first_name" disabled>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">Prénom</label>
                    <input id="email" :value="userStore.user.email" disabled>
                </div>
            </div>
        </div>

        <!-- Factors section -->
        <div>
            <div class="factor-header">
                <h2>Factors - {{ userStore.profileCompletionPercentage}} % completed</h2>
                <button @click="showFactorsEditModale = true">
                    Edit your factors
                </button>
            </div>
            
            <!-- Factors already scored by the user section -->
            <div class="factors-container">
                <h3>Scored factors</h3>

                <div class="grey-round" style="margin-bottom: 16px;">
                    <div v-if="userStore.user.factors?.length == 0">No factors are scored.</div>
                    <div v-else="userStore.user.factors?.length != 100">Your factors profile is incomplete, please score the reminaing factors.</div>
                </div>

                <template v-for="factor of userStore.user.factors">
                    <div class="grey-round factor">
                        <div class="factor-name">
                            <div>
                                {{ factor.name }}
                            </div>
                            <div>
                                {{ factor.opposite_name }}
                            </div>
                        </div>
                        <div class="score-section">
                            <div class="score-container">
                                <div v-for="score in 3">
                                    <input type="radio" :name="`${factor.name}-factor-score`" :value="10 - score" :checked="factor.score == 10 - score" :style="{'height':  `${48/score}px`, 'width':  `${48/score}px`}" disabled></input>
                                </div>
                            </div>
                            <div class="score-container">
                                <div v-for="score in 3">
                                    <input type="radio" :name="`${factor.name}-factor-score`" :value="4 - score" :checked="factor.score == 4 - score" :style="{'height':  `${48/(4 - score)}px`, 'width':  `${48/(4 - score)}px`}" disabled></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Factors not scored by the user section -->
            <div class="factors-container">
                <h3>Missing factors</h3>
                <template v-for="factor of factorsList">
                    <div v-if="factor.id && !(userFactorsIds.includes(factor.id))" class="grey-round factor">
                        <div class="factor-name">
                            <div>
                                {{ factor.name }}
                            </div>
                            <div>
                                {{ factor.opposite_name }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <div v-if="showFactorsEditModale" class="result-modale">
        <div class="modale-header" @click="showFactorsEditModale = false">
            <div>
                Factors edition modale
            </div>
            <div>
                X
            </div>
        </div>
        <div class="result-modale-content">
            
        </div>
    </div>
</template>

<style>

.factor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.personal-infos {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    flex-grow: 1;
}

.row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.grey-round {
    display: flex;
    flex-direction: column;
    gap: 16px;

    flex-grow: 1;

    background-color: #F6F6F6;
    padding: 24px 32px;
    border-radius: 8px;
}

.content-section {
    display: flex;
    flex-direction: column;
    gap: 24px;

    margin-top: 12px;
}

.factors-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    gap: 8px;
}

.factor-name {
    display: flex;
    justify-content: space-between;
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

@media (max-width: 1130px) {
    .factor {
        max-width: 100%
    }
}

@media (min-width: 1130px) {
    .factor {
        width: 340px;
    }
}

</style>