<script setup lang="ts">
import FactorsListComponent from '@/components/FactorsListComponent.vue';
import { useUserStore } from '@/stores/userStore';

/** Userstore */
const userStore = useUserStore()

</script>

<template>
    <div style="padding: 0 10vw;">
    
        <div class="content-section">
    
            <!-- Personal info section -->
            <div>
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
                    <h2>Factors</h2>
                </div>
    
                <div v-if="userStore.profileCompletionPercentage != 100" class="grey-round" style="margin-bottom: 16px;">
                    Your factors profile is incomplete, please score the reminaing factors to access the job analyzer feature.
                </div>
    
                <FactorsListComponent></FactorsListComponent>
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
</style>