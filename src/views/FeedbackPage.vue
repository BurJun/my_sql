<template>
    <div class="main-container">
      <!-- Верхняя панель -->
      <header class="header">
        <!-- Иконка для открытия боковой панели -->
        <div class="menu-icon" @click="toggleSidebar">
          <!-- SVG иконка меню (гамбургер) -->
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <!-- Логотип сайта справа -->
        <img class="site-logo" src="@/assets/elephant-character.png" alt="Site Logo" />
      </header>
  
      <!-- Боковая панель (меню) -->
      <AppSidebar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />

      <!-- Основной контент -->
      <main class="content">
    <div class="feedback-page">
      <h1>Обратная связь</h1>
      <p>Мы будем рады вашиму отзыву!</p>
      <FeedbackForm />
    </div>
</main>
</div>
</template>
  
  <script>
  import { mapGetters } from 'vuex';
  import FeedbackForm from './FeedbackForm.vue';
  import AppSidebar from './AppSidebar.vue';
  export default {
    components: {
      FeedbackForm,
      AppSidebar,
    },
    data() {
      return {
        isSidebarOpen: false, // Изначально боковая панель закрыта
      };
    },
    computed: {
      ...mapGetters([ 'getUserName']),
      userName() {
        return this.getUserName || 'Имя пользователя'; // Если данных нет, выводим дефолтное значение
      },
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
    }, 
  };
  </script>
  
  <style scoped>
    /* Основные стили */
    .main-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }
  
  /* Верхняя панель */
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
  
  /* Основной контент */
  .content {
    flex: 1;
    padding: 80px 40px;
    background-color: #e6f7ff;
  }
  
  .menu-icon {
    cursor: pointer;
  }
  .feedback-page {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .feedback-page h1 {
    color: #0277bd;
    margin-bottom: 20px;
  }
  
  .feedback-page p {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }
  </style>