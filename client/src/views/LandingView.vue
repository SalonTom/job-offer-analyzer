<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Hello world !</h1>
    <p>Ever wondered if a job is made for you ? </p>
    <p>This app use tests result to guide you into finding the right job for you, based on the factors that motivates you the best !</p>

    <router-link
      to="/login"
      v-slot="{ navigate }"
      >
        <button @click="navigate">
          Let's start searching !
        </button>
    </router-link>
  
    <a href="#about">
      <button>Learn more about our methods</button>
    </a>

    <div id="about">
      <div>First carré avec des infos</div>
      <div>Second carré avec des infos</div>
      <div>Third carré avec des infos</div>
    </div>
  </div>
</template>
