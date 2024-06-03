<script setup lang="ts">
import { Factor } from '@/models/Factor';


const props = defineProps({
    factor : Factor
});

</script>

<template>
    <div class="grey-round factor">
        <div class="factor-name">
            <div style="font-size: 16px; font-weight: 600;">
                {{ props.factor?.name }}
                <div style="margin-top: 4px; font-size: 14px;">
                    <span style="font-style: italic;">Opposite factor :</span> {{ props.factor?.opposite_name }}
                </div>
            </div>
            <template v-if="props.factor?.score">
                <div style="height:fit-content; width: fit-content; font-weight: bold;  font-size: 12px ; border-radius: 4px; padding: 4px 8px; background-color: #13f377e3; color: green;">
                    {{ props.factor?.score }}&nbsp/&nbsp10
                </div>
            </template>
            <template v-else>
                <div style="font-style: italic;">
                    Not scored yet
                </div>
            </template>
        </div>
        <div>
            {{ props.factor?.description }}
        </div>
    </div>
</template>

<style>
.factor-name {
    display: flex;
    justify-content: space-between;
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
</style>