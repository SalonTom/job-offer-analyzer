<script setup lang="ts">
import { ref, type Ref } from 'vue';

/** Boolean used to show or not the modale. */
const _showModal : Ref<boolean> = ref(false);

/**
 * Method used to display the modale.
 */
function showModale() {
    _showModal.value = true;
}

/**
 * Method used to hide the modale.
 */
function closeModale() {
    _showModal.value = false;
}

/**
 * Expose component methods.
 */
defineExpose({
    showModale,
    closeModale
})
</script>

<template>
    <Teleport to="body">
        <div v-if="_showModal" class="modale-mask">
            <div class="modale-container">
                <div class="modale-header">
                    <div class="modale-title">
                        <slot name="header"></slot>
                    </div>
                    <div @click="closeModale" style="cursor: pointer;">X</div>
                </div>
                <div class="modale-content">
                    <slot name="content"></slot>
                </div>
                <div class="modale-footer">
                    <slot name="footer">
                        <div></div>
                    </slot>
                    <div class="modale-buttons">
                        <slot name="buttons"></slot>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modale-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(159, 159, 159, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modale-container {
    max-height: 95vh;
    max-width: 95vw;

    background-color: white;
    border-radius: 8px;
    border: solid 1px rgba(159, 159, 159, 0.6);
    padding: 16px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

@media (min-width : 800px) {
    .modale-container {
        max-width: 33vw;
    }
}

.modale-buttons {
    float: right;
}

.modale-header {
    display: flex;
    gap: 32px;
    justify-content: space-between;
}

.modale-title {
    font-weight: 600;
}

.modale-footer {
    display: flex;
    justify-content: space-between;
}
</style>