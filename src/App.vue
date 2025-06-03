<template>
    <div id="app">
      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="loading-overlay">
        <img src="@/assets/elephant-character.png" alt="Loading" class="running-elephant" />
      </div>
  
      <!-- Шапка сайта -->
      <header class="app-header">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.svg" alt="SQLCraft" class="logo-img" />
          <span class="logo-text">SQLCraft</span>
        </router-link>
        <nav class="main-nav">
          <router-link to="/login" class="nav-link btn btn-primary">Войти</router-link>
          <router-link to="/register" class="nav-link btn btn-secondary">Регистрация</router-link>
        </nav>
      </header>
  
      <!-- Основной контент -->
      <main>
        <router-view />
      </main>
  
      <!-- Подвал сайта -->
      <footer class="app-footer">
        <p>&copy; 2024 SQLCraft. Все права защищены.</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
    data() {
      return {
        isLoading: false, // Флаг для отображения загрузки
      };
    },
    watch: {
      // Отслеживаем изменения маршрута
      $route() {
        this.showLoader(); // Показываем индикатор загрузки при переходе
      },
    },
    methods: {
      showLoader() {
        this.isLoading = true; // Включаем индикатор загрузки
        setTimeout(() => {
          this.isLoading = false; // Выключаем индикатор через 3 секунды
        }, 3000);
      },
    },
    mounted() {
      this.showLoader(); // Показываем индикатор при первой загрузке
    },
  };
  </script>
  
  <style>
  /* Основной контейнер */
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
  }
  
  /* Верхняя панель */
  .app-header {
    background-color: #0277bd;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
  }
  
  .logo-img {
    width: 40px;
    height: auto;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .main-nav {
    display: flex;
    gap: 15px;
  }
  
  .nav-link {
    font-size: 1rem;
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    transition: background-color 0.3s;
  }
  
  .nav-link:hover {
    background-color: #01579b;
  }
  
  .btn {
    font-size: 1rem;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 25px;
    text-align: center;
    text-decoration: none;
  }
  
  .btn-primary {
    background-color: #0277bd; /* Синяя кнопка для "Войти" */
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #01579b;
  }
  
  .btn-secondary {
    background-color: #80deea; /* Голубая кнопка для "Регистрация" */
    color: #0277bd;
  }
  
  .btn-secondary:hover {
    background-color: #4dd0e1;
    color: #01579b;
  }
  
  /* Подвал */
  .app-footer {
    background-color: #0288d1;
    color: white;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
  }
  
  /* Стили загрузочного индикатора */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1000;
  }
  
  .running-elephant {
    width: 80px;
    animation: run-elephant 0.8s infinite alternate ease-in-out;
  }
  
  @keyframes run-elephant {
    0% {
      transform: translateX(-50px);
    }
    100% {
      transform: translateX(50px);
    }
  }
  </style>