<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const aboutSectionsTexts : { title : string, desc : string, src : URL }[] = [
  {
    title: 'Unlock Your Career Match',
    desc: 'Fill in your profile with your personnality traits. The more you share, the smarter our AI gets at finding your perfect fit.',
    src: new URL('@/assets/illustrations/SVG/DrawKit Vector Illustration Project Manager (16).svg', import.meta.url)
  },
  {
    title: 'Scan Job Offers in Seconds',
    desc: 'Sparky analyzes any job posting you find. Simply upload the description, and let our matching engine work its magic.',
    src: new URL('@/assets/illustrations/SVG/DrawKit Vector Illustration Project Manager (14).svg', import.meta.url)
  },
  {
    title: 'Match Made in Job Heaven?',
    desc: 'See a clear compatibility score and detailed analysis of why (or why not) that job aligns with your career goals and aspirations.',
    src: new URL('@/assets/illustrations/SVG/DrawKit Vector Illustration Project Manager (13).svg', import.meta.url)
  }
]
</script>

<template>
  <div class="lp-container">
    <div class="lp-first-container">
      <div class="lp-texts-buttons">
        <div class="lp-headlines">
          <div class="headline">
            Unleash Your Potential.
          </div>
          <div class="headline">
            Find Your Perfect Job.
          </div>
        </div>
        <div class="subtitle">
          Use AI to find out if a job posting really matches with how you really are 
        </div>
        <div class="lp-buttons">
          <button class="button btn-primary" @click="router.push('/login')">Let's check if this job is made for you !</button>

          <RouterLink 
            :to="{ path: '/', hash: '#about' }">
          
            <button class="button btn-secondary" style="width:100%; margin-top: 12px;">Learn more about Sparky :)</button>
          </RouterLink>

        </div>
      </div>
      <div class="lp-main-draw">
        <img src="@/assets/illustrations/SVG/DrawKit Vector Illustration Project Manager (4).svg">
      </div>
    </div>
    </div>
    <div id="about" class="lp-about-section">
      <div class="title">
        Job offer analysis made Spark-eas-y !
      </div>
      <div class="lp-about-divs">
        <div class="lp-about-div shadow" v-for="section in aboutSectionsTexts">
          <img :src="section.src.toString()" class="lp-draw">
          <div class="lp-about-text">
            <div style="font-weight: bold;">{{ section.title }}</div>
            <div style="margin-top: 12px;">
              {{ section.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style>
.lp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10vw;
}

.lp-first-container {
  display: flex;
  gap: 64px;
  justify-content: center;
  align-items: center;

  min-height: 700px;
}

.lp-texts-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  text-align: center;
}

.lp-about-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  padding: 80px 10vw;
  text-align: center;

  background-color: var(--primary-color-light);
}

.lp-about-divs {
  display: flex;
  gap: 36px;

  padding: 0px 10vw;
  text-align: center;
}

.lp-about-div {
  background-color: white;
  border-radius: 6px;
  align-items: center;

  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 32px;

  max-width: 360px;
}

.lp-main-draw {
  width: 40vw;
  height: 100%;
}

.lp-draw {
  width: 50%;
  height: auto;
}


@media (max-width: 800px) {

  .lp-first-container {
    flex-direction: column;
  }

  .lp-main-draw {
    width: 100%;
  }

  .lp-about-divs {
    flex-direction: column;
  }
}
</style>