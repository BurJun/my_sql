<template>
  <div class="login-page">
    <h2 class="login-title">Вход</h2>
    <p class="login-subtitle">Войдите в ваш аккаунт, чтобы продолжить обучение</p>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Электронная почта</label>
        <input type="email" id="email" v-model="email" placeholder="Введите ваш email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" placeholder="Введите пароль" required />
      </div>
      <button type="submit" class="submit-button">Войти</button>
      <p class="register-link">Нет аккаунта? <a href="/register">Создать аккаунт</a></p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      if (this.validateEmail(this.email) && this.password) {
        // Здесь можно добавить логику для отправки данных на сервер или другую обработку
        alert('Вход выполнен успешно!');
      } else {
        alert('Пожалуйста, проверьте правильность данных.');
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
  },
};
</script>

<style>
.login-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 2.5rem;
  color: #006064;
  text-align: center;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 5px;
}

.form-group input {
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border 0.3s ease;
}

.form-group input:focus {
  border-color: #00acc1;
  outline: none;
}

.submit-button {
  padding: 15px;
  font-size: 1.2rem;
  background-color: #00acc1;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #00838f;
}

.register-link {
  text-align: center;
  font-size: 1rem;
  margin-top: 15px;
}

.register-link a {
  color: #00acc1;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>