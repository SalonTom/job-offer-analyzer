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

/** Boolean used to show or not skeleton loaders */
const showSkeletonLoaders : Ref<boolean> = ref(true);

onMounted(async () => {
    try {
        const factorsResponse = await axiosInstance.get('/api/factors/');
        factorsList.value = factorsResponse.data;
        userFactorsIds.value = userStore.user.factors.map(factor => factor.id as number);
    } catch (error) {
        alert(error);
    } finally {
        showSkeletonLoaders.value = false;
    }
});

</script>

<template>
    <div class="factors-container">
        <template v-if="!showSkeletonLoaders" v-for="factor of factorsList">
            <FactorTileComponent 
                :factor="((factor.id && userFactorsIds.includes(factor.id) ? userStore.user.factors.find(f => f.id == factor.id) : factor) as Factor)">
            </FactorTileComponent>
        </template>
        <template v-else>
            <template v-for="i in 3">
                <FactorTileComponent 
                    :show-skeleton="showSkeletonLoaders">
                </FactorTileComponent>
            </template>
        </template>
    </div>
</template>

<style>
.factors-container {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}
</style>