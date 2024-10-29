import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,  // Главная страница
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,  // Страница входа
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,  // Страница регистрации
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;