import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'singup',
      component: SignupView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { protected : true}
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { protected : true}
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
  }
})

router.beforeEach((to, from) => {

  if (to.meta['protected'] && !useUserStore().authToken) router.replace('/') // If the user is not connected, it cannot access the protected routes.
  if (useUserStore().authToken && to.path == '/') router.replace('/home') // If the user is connected, access directly to the home page.

})

export default router
