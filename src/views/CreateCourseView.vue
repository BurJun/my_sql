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
        <h1>Создание нового курса</h1>
  
        <div class="form-section">
          <label>Название курса</label>
          <input v-model="course.title" type="text" placeholder="Введите название курса" />
  
          <label>Описание</label>
          <textarea v-model="course.description" placeholder="Описание курса" />
  
          <label>Уровень</label>
          <select v-model="course.level">
            <option value="beginner">Начинающий</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
  
          <button class="add-btn" @click="addLesson">Добавить урок</button>
        </div>
  
        <div v-for="(lesson, lIndex) in course.lessons" :key="lIndex" class="lesson-block">
          <h3>Урок {{ lIndex + 1 }}</h3>
          <input v-model="lesson.title" placeholder="Название урока" />
          <textarea v-model="lesson.description" placeholder="Описание урока" />
          <textarea v-model="lesson.theory" placeholder="Теория" />
          <button class="add-btn" @click="addAssignment(lIndex)">Добавить задание</button>
  
          <div v-for="(assignment, aIndex) in lesson.assignments" :key="aIndex" class="assignment-block">
            <h3>Задание {{ aIndex + 1 }}</h3>
            <input v-model="assignment.title" placeholder="Название задания" />
            <textarea v-model="assignment.description" placeholder="Описание задания" />
            <textarea v-model="assignment.solution" placeholder="Решение" />
          </div>
        </div>

        <div class="lesson-block">
            <h2>Финальный тест</h2>
            <input v-model="finalTest.title" placeholder="Название финального теста" />

            <button class="add-btn" @click="addFinalQuestion">Добавить вопрос</button>

            <div v-for="(q, index) in finalTest.questions" :key="index" class="assignment-block">
                <h4>Вопрос {{ index + 1 }}</h4>
                <input v-model="q.question" placeholder="Текст вопроса" />
                <input v-model="q.correct_answer" placeholder="Правильный ответ (через запятую, если несколько)" />
                <input v-model="q.options" placeholder="Варианты ответа (через запятую)" />
            </div>
        </div>
  
        <button class="submit-button" @click="submitCourse">Сохранить курс</button>
      </main>
    </div>
  </template>
  
  <script>
  import AppSidebar from './AppSidebar.vue';
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  
  export default {
    components: { AppSidebar },
    data() {
      return {
        isSidebarOpen: false,
        course: {
          title: '',
          description: '',
          level: 'beginner',
          lessons: [],
        },
        finalTest: {
            title: '',
            questions: []
        },
      };
    },
    computed: {
      ...mapGetters(['getUserName']),
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      isValidSQL (sql) {
        const trimmed = sql.trim().toUpperCase();
        // Начинается с допустимого SQL-ключевого слова и заканчивается точкой с запятой
        return /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b/.test(trimmed) &&
                trimmed.endsWith(';');
      },
      addLesson() {
        this.course.lessons.push({
          title: '',
          description: '',  // <--- добавлено
          theory: '',
          assignments: [],
        });
      },
      addAssignment(lessonIndex) {
        this.course.lessons[lessonIndex].assignments.push({
          title: '',
          description: '',
          solution: '',
        });
      },
      addFinalQuestion() {
        this.finalTest.questions.push({
            question: '',
            correct_answer: '',
            options: ''
        });
      },
      async submitCourse() {
        if (!this.course.title.trim()) {
            alert('Название курса обязательно');
            return;
        }

        if (this.course.lessons.length === 0) {
            alert('Добавьте хотя бы один урок');
            return;
        }

        for (const lesson of this.course.lessons) {
            if (!lesson.title.trim() || !lesson.description.trim() || !lesson.theory.trim()) {
                alert('У каждого урока должны быть название, описание и теория');
                return;
            }
            for (const assignment of lesson.assignments) {
                if (!assignment.title.trim() || !assignment.solution.trim()) {
                alert('У каждого задания должны быть название и решение');
                return;
                }
                if (!this.isValidSQL(assignment.solution)) {
                alert('Решение должно начинаться с SQL-команды (SELECT, INSERT и т.д.) и заканчиваться ;');
                return;
                }

            }
        }
        if (this.finalTest.title && this.finalTest.questions.length > 0) {
            this.course.finalTest = {
                title: this.finalTest.title,
                questions: this.finalTest.questions.map(q => ({
                question: q.question,
                correct_answer: q.correct_answer.split(',').map(a => a.trim()),
                options: q.options.split(',').map(o => o.trim())
                }))
            };
        }
        // если всё ок — отправка
        try {
            await axios.post('http://localhost:5000/api/courses/full', this.course);
            alert('Курс создан!');
            this.$router.push('/main');
        } catch (err) {
            console.error('Ошибка при создании курса:', err);
            alert('Не удалось создать курс');
        }
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
    overflow-y: auto; /* ВАЖНО */
  }
  
  
  .form-section, .lesson-block {
    margin-bottom: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
  }
  
  input, textarea, select {
    width: 100%;
    margin: 8px 0;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .submit-button {
    background-color: #0074D9;
    color: white;
    padding: 12px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .assignment-block {
    background: #f9f9f9;
    margin-top: 10px;
    padding: 10px;
    border-radius: 6px;
  }
  </style>
  