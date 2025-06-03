import { createStore } from 'vuex';
import axios from 'axios'; // Для работы с HTTP-запросами

export const state = {
    ui: {
      isSidebarVisible: false, // Состояние для показа/скрытия бокового меню
    },
  };
  
  export const mutations = {
    toggleSidebar(state) {
      state.ui.isSidebarVisible = !state.ui.isSidebarVisible;
    },
  };
  
  export const actions = {
    // Можно добавить логику для асинхронной загрузки данных
  };
  
  export const getters = {
    // Можно добавить геттеры для получения данных
  };

export default createStore({
    state: {
      user: {
        id: null,
        username: null,
        email: null,
      },  
      token: null,
      courses: [],
      lessons: [],  // Добавляем state для уроков
    },
    mutations: {
      setUser(state, user) {
        state.user = {
            id: user.id || null,
            username: user.username || null,
            email: user.email || null
          };
      },
      setToken(state, token) {
        state.token = token;
      },
      clearAuthData(state) {
        state.user = null;
        state.token = null;
      },
      setCourses(state, courses) {
        console.log('Сост', courses);
        state.courses = courses;
      },
      setLessons(state, lessons) {
        state.lessons = lessons;  // Сохраняем уроки
      },
    },
    actions: {
      async login({ commit }, { userCredentials, router }) {
        try {
          const response = await axios.post('http://localhost:5000/api/login', userCredentials);
          const { token, user } = response.data;
  
          // Сохраняем токен в localStorage
          localStorage.setItem('token', token);
  
          // Сохраняем пользователя и токен в store
          commit('setUser', user);
          commit('setToken', token);
          console.log(token);
  
          // Перенаправляем на главную страницу
          router.push('/main');
        } catch (error) {
          console.error('Ошибка авторизации:', error);
          alert('Не удалось войти. Проверьте свои данные.');
        }
      },
      async fetchUser({ commit }) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
      
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
          const response = await axios.get('http://localhost:5000/api/users/me');
          console.log(response.data);
          commit('setUser', response.data);
        } catch (error) {
          console.error('Ошибка при получении данных о пользователе:', error);
          if (error.response?.status === 401) {
            // токен истёк — чистим всё
            localStorage.removeItem('token');
            commit('clearUser');
            window.location.href = '/login'; // редирект
          }
        }
      }
      ,
      async fetchCourses({ commit }) {
        try {
          const response = await axios.get('http://localhost:5000/api/courses');
          console.log('Курсы с сервера:', response.data);
          commit('setCourses', response.data);
        } catch (error) {
          console.error('Ошибка при загрузке курсов:', error);
        }
      },
      
      async fetchLessons({ commit }, courseId) {
        try {
          // Исправим синтаксис URL для подставляемого courseId
          const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/lessons`);
          commit('setLessons', response.data);
        } catch (error) {
          console.error('Ошибка при загрузке уроков:', error);
        }
      },
      async logout({ commit, router }) {
        commit('clearAuthData');
        localStorage.removeItem('token');
        router.push('/login');
      },
    },
    getters: {
      getUserName: (state) => (state.user && state.user.username ? state.user.username : null), 
      getUserEmail: (state) => (state.user && state.user.email ? state.user.email : null), 
      isAdmin: (state) => state.user?.username === 'admin',
      getUserId: (state) => (state.user && state.user.id ? state.user.id : null),
      isAuthenticated: (state) => !!state.token,
      getCourses: (state) => {
        return Array.isArray(state.courses) ? state.courses : [];
      },
      getLessons: (state) => state.lessons,
    },
  });