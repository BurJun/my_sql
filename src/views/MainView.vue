<template>
    <div class="main-container">
      <!-- Верхняя панель -->
      <header class="header">
        <div class="menu-icon" @click="toggleSidebar">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <img class="site-logo" src="@/assets/elephant-character.png" alt="Site Logo" />
      </header>
  
      <!-- Боковая панель (меню) -->
      <AppSidebar :user-name="userName" :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
  
      <!-- Основной контент -->
      <main class="content">
        <h1>Мой курс по изучению SQL</h1>
        <!-- Показываем индикатор загрузки -->
        <div v-if="loading">
          <p>Загрузка курсов...</p>
        </div>
        <button v-if="isAdmin" class="add-btn" @click="goToAddCourse">Добавить курс</button>
        <div class="topics">
          <div 
            class="topic" 
            v-for="(topic, index) in courses" 
            :key="index" 
            @click="goToCourseLessons(topic)"
            @mouseenter="hoveredCourse = index"
            @mouseleave="hoveredCourse = null"
          >
            <h3>{{ topic.title }}</h3>
            <p>{{ topic.description }}</p>
            <!-- Выпадающее окно при наведении -->
            <div v-if="hoveredCourse === index" class="tooltip">
              <!--<p><strong>Автор:</strong> {{ topic.created_by }}</p>-->
              <p><strong>Дата создания:</strong> {{ formatDate(topic.created_at) }}</p>
              <p><strong>Сложность:</strong> {{ renderStars(topic.level) }}</p>
              <p><button v-if="isAdmin" @click.stop="deleteCourse(topic.course_id)" class="delete-btn">Удалить курс</button></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import AppSidebar from './AppSidebar.vue';
  import axios from 'axios';
  
  export default {
    components: {
      AppSidebar,
    },
    data() {
      return {
        isSidebarOpen: false,
        loading: true,
        hoveredCourse: null, // Индекс текущего наведения мыши
      };
    },
    computed: {
      ...mapGetters(['getCourses', 'getUserName', 'isAdmin']),
      courses() {
        return this.getCourses; // Получаем курсы из Vuex
      },
      userName() {
        return this.getUserName || 'Имя пользователя'; // Если данных нет, выводим дефолтное значение
      },
    },
    methods: {
      ...mapActions(['fetchCourses', 'fetchUser', 'logout']),
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      goToAddCourse() {
        this.$router.push({ name: 'CreateCourse' }); // предполагается маршрут
      },
      async deleteCourse(courseId) {
        try {
            await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
            this.fetchCourses(); // обновить список
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
        }
      },
      async checkAuthorization() {
        const token = localStorage.getItem('token');
        if (!token) {
          this.redirectToLogin();
        } else {
          await this.fetchUser(); // Загружаем данные пользователя
          await this.fetchCourses(); // Загружаем курсы
          this.loading = false; // Завершаем загрузку
        }
      },
      redirectToLogin() {
        this.$router.push('/login');
      },
      goToCourseLessons(course) {
        if (course && course.course_id) {
          this.$router.push({ name: 'courseLessons', params: { courseId: course.course_id } });
        } else {
          console.error('Ошибка: курс не имеет ID');
        }
      },
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('ru-RU', options);
      },
      renderStars(level) {
        const stars = { beginner: 1, intermediate: 3, advanced: 5 };
        return '★'.repeat(stars[level]) + '☆'.repeat(5 - stars[level]);
      },
    },
    async mounted() {
      this.checkAuthorization(); // Проверяем авторизацию пользователя
    },
  };
  </script>
  

  <style>
  /* Основные стили */
  .main-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }
  
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background-color: #0277bd;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: #fff;
    z-index: 10;
    justify-content: space-between;
  }
  
  .menu-icon {
    cursor: pointer;
  }
  
  .site-logo {
    height: 50px;
    width: 50px;
  }
  
  .content {
    flex: 1;
    padding: 80px 40px;
    background-color: #e6f7ff;
    overflow-y: auto; /* ВАЖНО */
  }
  
  h1 {
    font-size: 2rem;
    color: #0074D9;
  }
  
  .topics {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .topic {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: transform 0.3s;
  }
  
  .topic:hover {
    transform: scale(1.05);
  }
  
  .topic h3 {
    font-size: 1.5rem;
    color: #0074D9;
  }
  
  .topic p {
    font-size: 1rem;
    color: #555;
  }
  
  /* Стили для выпадающего окна */
  tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #0074D9;
  color: #fff;
  border-radius: 5px;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000; /* Устанавливаем высокий z-index */
  animation: fadeIn 0.3s ease-in-out;
}

.tooltip p {
  margin: 5px 0;
}

.topic {
  position: relative; /* Обеспечиваем, чтобы tooltip позиционировался относительно .topic */
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.topic:hover {
  transform: scale(1.05);
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.delete-btn {
  background-color: #e53935;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 20px;
  cursor: pointer;
}
  </style>
  