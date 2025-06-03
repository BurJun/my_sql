<template>
  <div class="register-page">
    <h2 class="register-title">Регистрация</h2>
    <p class="register-subtitle">Присоединяйтесь к нашему курсу и начните обучение прямо сейчас!</p>
    <form class="register-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Имя</label>
        <input type="text" id="name" v-model="name" placeholder="Введите ваше имя" required />
      </div>
      <div class="form-group">
        <label for="email">Электронная почта</label>
        <input type="email" id="email" v-model="email" placeholder="Введите ваш email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" placeholder="Введите пароль" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Подтвердите пароль</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Подтвердите пароль" required />
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
      <p class="login-link">Уже есть аккаунт? <a href="/login">Войти</a></p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    async submitForm() {
      if (this.password === this.confirmPassword) {
        const userData = {
          username: this.name,
          email: this.email,
          password: this.password,
        };

        try {
          const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            alert('Регистрация успешна!');
            this.$router.push('/login'); // Перенаправление на страницу входа
          } else {
            const errorData = await response.json();
            alert(`Ошибка регистрации: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при регистрации. Попробуйте позже.');
        }
      } else {
        alert('Пароли не совпадают');
      }
    },
  },
};
</script>

<style>
.register-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 2.5rem;
  color: #006064;
  text-align: center;
  margin-bottom: 10px;
}

.register-subtitle {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
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

.login-link {
  text-align: center;
  font-size: 1rem;
  margin-top: 15px;
}

.login-link a {
  color: #00acc1;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>