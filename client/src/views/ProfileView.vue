<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
</script>

<template>
    <h1>Profile</h1>

    <div class="content-section">
        <div>
            <h2>Personal infos</h2>
            <div class="grey-round">
                <div class="row">
                    <div class="form-group">
                        <label for="name">Nom</label>
                        <input id="name" :value="userStore.name" disabled>
                    </div>
                    <div class="form-group">
                        <label for="firstname">Prénom</label>
                        <input id="firstname" :value="userStore.firstname" disabled>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">Prénom</label>
                    <input id="email" :value="userStore.email" disabled>
                </div>
            </div>
        </div>
        <div>
            <h2>Factors</h2>
            <div class="factors-container">
                <div v-for="[factor, userScore] of Object.entries(userStore.scores)" class="grey-round factor">
                    <div class="factor-name">
                        <div>
                            {{ factor }}
                        </div>
                        <div>
                            Opposite
                        </div>
                    </div>
                    <div class="score-section">
                        <div class="score-container">
                            <div v-for="score in 3">
                                <input type="radio" :name="`${factor}-factor-score`" :value="10 - score" :checked="userScore == 10 - score" :style="{'height':  `${48/score}px`, 'width':  `${48/score}px`}"></input>
                            </div>
                        </div>
                        <div class="score-container">
                            <div v-for="score in 3">
                                <input type="radio" :name="`${factor}-factor-score`" :value="4 - score" :checked="userScore == 4 - score" :style="{'height':  `${48/(4 - score)}px`, 'width':  `${48/(4 - score)}px`}"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
</template>

<style>

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
    flex-direction: row;
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