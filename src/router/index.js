import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import MainView from '../views/MainView.vue';
import CourseLessonsView from '../views/CourseLessonsView.vue'; // Новый компонент для отображения уроков
import FeedbackPage from '../views/FeedbackPage.vue';
import LessonTheoryView from '@/views/LessonTheoryView.vue';
import LesssonAssignments from '@/views/LesssonAssignments.vue';
import CreateCourseView from '@/views/CreateCourseView.vue';
import UserStatsView from '@/views/UserStatsView.vue';
import SandboxView from '@/views/SandboxView.vue';
import FinalTestView from '@/views/FinalTestView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,  // Первая страница
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
  {
    path: '/main',
    name: 'main',
    component: MainView,  // Главная страница
    meta: { requiresAuth: true },
  },
  {
    path: '/stats',
    name: 'stats',
    component: UserStatsView,  //Статистика
  },
  {
    path: '/course/:courseId/lessons',  // Обратите внимание на :courseId в пути
    name: 'courseLessons',
    component: CourseLessonsView,
    props: true,  // Это позволит передавать параметр в компонент как пропс
  },
  {
    path: '/feedback',
    name: 'feedback',   // Страница обратной связи
    component: FeedbackPage,
  },
  {
    path: '/lesson/:lessonId/theory',
    name: 'LessonTheory',
    component: LessonTheoryView,
  },
  {
    path: '/lesson/:lessonId/assignments',
    name: 'LessonAssignments',
    component: LesssonAssignments,
  },
  {
    path: '/admin/create-course',
    name: 'CreateCourse',
    component: CreateCourseView,
  },
  {
    path: '/sandbox',
    name: 'Sandbox',
    component: SandboxView,
  },
  {
    path: '/finaltest',
    name: 'FinalTestView',
    component: FinalTestView,
  },
];

// Создаем роутер
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Перед переходом проверяем авторизацию
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');  // Проверка токена в localStorage
    console.log('Маршрут:', to.path, 'Токен:', isAuthenticated);
  
    // Если маршрут требует авторизации и нет токена, перенаправляем на /login
    if (to.meta.requiresAuth && !isAuthenticated) {
      console.log('Нет токена, перенаправляем на /login');
      next('/login');
    } else {
      console.log('Разрешен переход на:', to.path);
      next();  // Переход разрешен
    }
  });

export default router;