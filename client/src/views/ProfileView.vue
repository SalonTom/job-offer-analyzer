<script setup lang="ts">
import FactorTileComponent from '@/components/FactorTileComponent.vue';
import axiosInstance from '@/composables/axiosComposable';
import type { Factor } from '@/models/Factor';
import { useUserStore } from '@/stores/userStore';
import { type Ref, ref, onMounted } from 'vue';

/** Userstore */
const userStore = useUserStore()

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
    alert(error);
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
            </div>

            <div v-if="userStore.profileCompletionPercentage != 100" class="grey-round" style="margin-bottom: 16px;">
                Your factors profile is incomplete, please score the reminaing factors to access the job analyzer feature.
            </div>

            <div class="factors-container">
                <template v-for="factor of factorsList">
                    <FactorTileComponent 
                        :factor="((factor.id && userFactorsIds.includes(factor.id) ? userStore.user.factors.find(f => f.id == factor.id) : factor) as Factor)">
                    </FactorTileComponent>
                </template>
            </div>
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
    gap: 16px;
    flex-wrap: wrap;
}
</style>