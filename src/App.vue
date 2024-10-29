<template>
  <div id="app">
    <header class="app-header">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.svg" alt="SQLCraft" class="logo-img" />
        <span class="logo-text">SQLCraft</span>
      </router-link>
      <nav class="main-nav">
        <!-- Убрана кнопка "Главная" -->
        <router-link to="/login" class="nav-link btn btn-primary">Войти</router-link>
        <router-link to="/register" class="nav-link btn btn-secondary">Регистрация</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer class="app-footer">
      <p>&copy; 2024 SQLCraft. Все права защищены.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

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

.app-footer {
  background-color: #0288d1;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
}
</style>