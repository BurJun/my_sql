<template>
  <div class="main-container">
    <header class="header">
      <div class="menu-icon" @click="toggleSidebar">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <img class="site-logo" src="@/assets/elephant-character.png" alt="Site Logo" />
    </header>

    <AppSidebar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />

    <main class="content">
      <div v-if="test">
        <h1>{{ test.title }}</h1>

        <div v-for="(q, index) in test.questions" :key="q.id" class="question-block">
          <p><strong>{{ index + 1 }}.</strong> {{ q.question }}</p>

          <!-- Множественный выбор -->
          <div v-if="q.options && q.options.length">
            <div v-for="(option, optIndex) in q.options" :key="optIndex" class="checkbox-option">
              <label class="custom-checkbox">
                <input
                  type="checkbox"
                  :value="option"
                  v-model="userAnswers[q.id]"
                />
                <span class="checkmark"></span>
                {{ option }}
              </label>
            </div>
          </div>

          <!-- Обычное текстовое поле -->
          <div v-else>
            <input
              type="text"
              v-model="userAnswers[q.id]"
              placeholder="Введите ответ"
              class="text-input"
            />
          </div>
        </div>

        <button class="submit-button" @click="submitTest">Отправить</button>

        <div v-if="result" class="result-block">
            <p>Правильных ответов: <strong>{{ result.correct }}</strong> из {{ result.total }}</p>
            <button @click="goToMainPage" class="return-button">Вернуться на главную</button>
        </div>

      </div>

      <div v-else>
        <p>Загрузка теста...</p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import AppSidebar from './AppSidebar.vue';

export default {
  components: { AppSidebar },
  data() {
    return {
      isSidebarOpen: false,
      test: null,
      userAnswers: {},
      result: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async submitTest() {
      const answers = Object.entries(this.userAnswers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer: Array.isArray(answer) ? answer : [answer], // всегда массив
      }));

      try {
        const res = await axios.post('http://localhost:5000/api/final-test/submit', {
          testId: this.test.testId,
          answers,
        });

        this.result = res.data;

      } catch (err) {
        console.error('Ошибка при отправке теста:', err);
      }
    },
    goToMainPage() {
        this.$router.push({ name: 'main' }); // Или другой маршрут, если у тебя есть 'Courses'
    },
  },
  async mounted() {
    const lessonId = this.$route.params.lessonId;

    try {
      const res = await axios.get(`http://localhost:5000/api/final-test/${lessonId}`);
        this.test = {
        ...res.data,
        questions: res.data.questions.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }))
        };

        // Инициализация ответов
        this.test.questions.forEach(q => {
        this.userAnswers[q.id] = q.options && q.options.length ? [] : '';
        });

    } catch (err) {
      console.error('Ошибка при загрузке теста:', err);
    }
  },
};
</script>


<style scoped>
.main-container {
  display: flex;
  height: 100vh;
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

.site-logo {
  height: 50px;
  width: 50px;
}

.menu-icon {
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 100px 40px 40px;
  background-color: #e6f7ff;
  overflow-y: auto;
}

.question-block {
  background: #fff;
  padding: 15px 20px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.answer-input {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #bbb;
}

.submit-button {
  padding: 12px 20px;
  font-size: 16px;
  background: #0277bd;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 20px;
  cursor: pointer;
}

.result-block {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.checkbox-option {
  margin-bottom: 8px;
}

.custom-checkbox {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
  font-size: 16px;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border: 1px solid #aaa;
  border-radius: 4px;
  transition: all 0.25s ease;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #0277bd;
  border-color: #0277bd;
  transform: scale(1.1);
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
}

.custom-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
  transition: opacity 0.2s ease;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
  opacity: 1;
}

.custom-checkbox .checkmark:after {
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
}
.text-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #aaa;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.text-input:focus {
  border-color: #0277bd;
  box-shadow: 0 0 6px rgba(2, 119, 189, 0.4);
  outline: none;
}

.return-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #0277bd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
