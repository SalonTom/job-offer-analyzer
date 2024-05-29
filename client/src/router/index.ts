import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useUserStore } from '@/stores/user'

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
  ]
})

router.beforeEach((to, from) => {
  const userStore = useUserStore();

  if (to.meta['protected'] && !userStore.authToken) router.replace('/')
  if (userStore.authToken && to.path == '/') router.replace('/home')
  // TODO : call to server to check if authtoken still okay
})

export default router
