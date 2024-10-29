<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">SQLCraft</h1>
        <p class="hero-subtitle">Изучайте SQL с удовольствием!</p>
        <router-link to="/register" class="btn btn-primary">Начать обучение</router-link>
      </div>
      <img src="@/assets/elephant-character.png" alt="SQLCraft Elephant" class="hero-image animated-image" />
    </section>

    <!-- Info Section 1 -->
    <section class="info-section">
      <div class="info-block">
        <img src="@/assets/elephant-character.png" alt="Stimul" class="info-icon animated-icon" />
        <h2>Стимул к учёбе</h2>
        <p>Игровой подход с забавными заданиями помогает быстро превратить ежедневные занятия в привычку.</p>
      </div>
      <div class="info-block">
        <img src="@/assets/elephant-character.png" alt="Individual" class="info-icon animated-icon" />
        <h2>Индивидуальное обучение</h2>
        <p>Алгоритмы адаптируются под ваш уровень, делая обучение персонализированным и удобным.</p>
      </div>
    </section>

    <!-- Info Section 2 -->
    <section class="info-section">
      <div class="info-block">
        <img src="@/assets/elephant-character.png" alt="Fun" class="info-icon animated-icon" />
        <h2>Весело и эффективно</h2>
        <p>Зарабатывайте очки и открывайте новые уроки в процессе игры, улучшая навыки работы с базами данных.</p>
      </div>
      <div class="info-block">
        <img src="@/assets/elephant-character.png" alt="Science" class="info-icon animated-icon" />
        <h2>Научный подход</h2>
        <p>Используем доказанные методы обучения, чтобы улучшить ваши навыки работы с SQL.</p>
      </div>
    </section>

    <!-- Parallax Section -->
    <section class="parallax-section">
      <div class="parallax-content">
        <h2>Учитесь в любое время и в любом месте</h2>
        <div class="app-store-links">
          <a href="#" class="store-link app-store-bounce">
            <img src="@/assets/elephant-character.png" alt="App Store" />
          </a>
          <a href="#" class="store-link google-play-bounce">
            <img src="@/assets/elephant-character.png" alt="Google Play" />
          </a>
        </div>
      </div>
    </section>

     <section class="course-overview">
      <h2 class="course-overview-title">Наш курс: Полный путь от новичка до эксперта</h2>
      <p class="course-overview-description">
        Мы предлагаем уникальный и полный курс по SQL и базам данных, который подходит как для новичков, так и для тех, кто хочет углубить свои знания. Вы изучите, как взаимодействовать с базами данных, писать сложные запросы, анализировать данные и оптимизировать работу с ними.
      </p>
    </section>

    <!-- Блоки с подробной информацией -->
    <section class="detailed-info-section">
      <div class="detailed-info-block">
        <img src="@/assets/elephant-character.png" alt="SQL Basics" class="detailed-info-image" />
        <div class="detailed-info-text">
          <h3>Основы SQL и базы данных</h3>
          <p>
            Начните с самых основ, узнайте, как устроены базы данных, как с ними взаимодействовать через запросы и как получать информацию из больших массивов данных. Мы поможем вам научиться использовать команды SELECT, INSERT, UPDATE и DELETE.
          </p>
          <p>
            Вы узнаете, как грамотно проектировать базы данных и создавать правильную структуру данных, которая позволит вам эффективно хранить и управлять информацией.
          </p>
        </div>
      </div>

      <div class="detailed-info-block reversed">
        <img src="@/assets/elephant-character.png" alt="SQL Joins" class="detailed-info-image" />
        <div class="detailed-info-text">
          <h3>Соединение данных и сложные запросы</h3>
          <p>
            Научитесь объединять данные из разных таблиц с помощью INNER JOIN, LEFT JOIN, RIGHT JOIN и других видов соединений. Мы покажем, как соединять данные из нескольких таблиц для комплексных отчетов и анализа данных.
          </p>
          <p>
            Вы также освоите использование подзапросов, оконных функций и агрегатных операций для решения реальных задач.
          </p>
        </div>
      </div>

      <div class="detailed-info-block">
        <img src="@/assets/elephant-character.png" alt="Advanced SQL" class="detailed-info-image" />
        <div class="detailed-info-text">
          <h3>Продвинутые техники и оптимизация</h3>
          <p>
            Разберитесь в сложных и оптимизированных SQL-запросах. Мы покажем вам, как писать эффективные запросы, которые работают быстро и безопасно даже с большими наборами данных. Научитесь использовать индексы, ключи и другие методы оптимизации работы баз данных.
          </p>
          <p>
            Этот блок даст вам возможность стать настоящим профессионалом в области баз данных.
          </p>
        </div>
      </div>
    </section>

    <!-- Новый блок с вызовом к действию -->
    <section class="call-to-action-section">
      <h2>Присоединяйтесь к нашему курсу уже сегодня!</h2>
      <p>Мы предлагаем вам полный курс с практическими примерами и доступом к профессиональным инструментам. Начните учиться прямо сейчас и станьте экспертом в работе с SQL и базами данных.</p>
      <div class="call-to-action-buttons">
        <button class="cta-button">Начать обучение</button>
        <button class="cta-button">Узнать подробнее</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style>
.home-page {
  padding: 20px;
}

/* Hero Section Styles */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e3f2fd;
  padding: 50px;
  border-radius: 10px;
  margin-bottom: 50px;
  overflow: hidden;
}

.hero-title {
  font-size: 4rem;
  color: #0277bd;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 30px;
}

.hero-image {
  max-width: 40%;
  transform: scale(1);
  transition: transform 0.3s ease-in-out;
}

/* Animations */
.hero-image:hover {
  transform: scale(1.1);
}

.animated-image {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Info Section Styles */
.info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.info-block {
  text-align: center;
  max-width: 45%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-block:hover {
  transform: translateY(-10px);
  box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.2);
}

.info-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.animated-icon {
  animation: rotate 6s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Parallax Section */
.parallax-section {
  position: relative;
  background-image: url('@/assets/elephant-character.png');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  padding: 100px 0;
  color: #ffffff;
  text-align: center;
}

.parallax-content h2 {
  font-size: 3rem;
  margin-bottom: 30px;
}

.app-store-links {
  display: flex;
  justify-content: center;
}

.store-link {
  margin: 0 10px;
}

.store-link img {
  width: 150px;
  transition: transform 0.3s ease;
}

/* Анимация для картинок App Store и Google Play */
.app-store-bounce {
  animation: bounce 5s infinite;
}

.google-play-bounce {
  animation: bounce 4.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.store-link img:hover {
  transform: scale(1.1);
}

/* Buttons */
.btn-primary {
  background-color: #0277bd;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #01579b;
}
/* Секция с краткой информацией о курсе */
.course-info-section {
  padding: 60px 20px;
  background-color: #f5f5f5;
  text-align: center;
}

.course-info-title {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #0277bd;
}

.course-info-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.course-info-block {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 22%;
  text-align: center;
  margin: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-info-block:hover {
  transform: translateY(-10px);
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
}

.course-info-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.course-info-block h3 {
  font-size: 1.5rem;
  color: #0277bd;
  margin-bottom: 10px;
}

.course-info-block p {
  font-size: 1rem;
  color: #555;
}
/* Секция с кратким описанием курса */
.course-overview {
  padding: 80px 20px;
  background-color: #e0f7fa;
  text-align: center;
}

.course-overview-title {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #006064;
}

.course-overview-description {
  font-size: 1.5rem;
  color: #00796b;
  margin: 0 auto;
  max-width: 800px;
}

/* Секция с подробной информацией о темах курса */
.detailed-info-section {
  padding: 60px 20px;
  background-color: #fafafa;
}

.detailed-info-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
}

.detailed-info-block.reversed {
  flex-direction: row-reverse;
}
.detailed-info-image {
  width: 45%;
  border-radius: 20px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
}

.detailed-info-text {
  width: 50%;
  padding: 0 20px;
}

.detailed-info-text h3 {
  font-size: 2rem;
  color: #006064;
  margin-bottom: 15px;
}

.detailed-info-text p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 10px;
}

/* Секция с призывом к действию */
.call-to-action-section {
  background-color: #004d40;
  color: #ffffff;
  padding: 80px 20px;
  text-align: center;
}

.call-to-action-section h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.call-to-action-section p {
  font-size: 1.3rem;
  margin-bottom: 40px;
}

.call-to-action-buttons {
  display: flex;
  justify-content: center;
}

.cta-button {
  background-color: #00acc1;
  color: #ffffff;
  border: none;
  padding: 15px 40px;
  margin: 0 10px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #00838f;
}
</style>