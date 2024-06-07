<template>
    <div style="display: flex; gap: 6px;">
        <div class="loading-bar-1"></div>
        <div class="loading-bar-2"></div>
        <div class="loading-bar-3"></div>
    </div>
</template>

<style>

@keyframes loading-1 {
    0% {
        transform: scale(1);
    }

    30% {
        transform: scale(1.5);
        background-color: var(--primary-color);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes loading-2 {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.5);
        background-color: var(--primary-color);
    }

    100% {
        transform: scale(1);
    }
}


@keyframes loading-3 {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
        background-color: var(--primary-color);
    }

    100% {
        transform: scale(1);
    }
}

div[class^='loading-bar-'] {
    height: 32px;
    width: 8px;
    background-color: var(--primary-color-dark);
}

.loading-bar-1 {
    animation: 1.5s loading-1 infinite ease-in-out;
}

.loading-bar-2 {
    animation: 1.5s loading-2 infinite ease-in-out;
}

.loading-bar-3 {
    animation: 1.5s loading-3 infinite ease-in-out;
}
</style>