<template>
    This will be the signup view

    <router-link 
        to="/home"
        v-slot="{ navigate }"
    >
        <button @click="navigate">
          Sign up
        </button>
    </router-link>
</template>