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
       <div>
        <h1 v-if="course">{{ course.title }}</h1>
        <div v-else>Загрузка курса...</div> <!-- Показываем индикатор загрузки, если курс не найден -->
  
        <div v-if="lessons.length === 0">Загрузка уроков...</div>
        <div v-for="(lesson, index) in lessons" :key="lesson.id" class="lesson"
            :class="{
                available: isLessonAvailable(index),
                unavailable: !isLessonAvailable(index),
                completed: completedLessons.includes(lesson.lesson_id)
            }">
            <h3> {{ lesson.title }} <span v-if="completedLessons.includes(lesson.lesson_id)" class="checkmark">✔️</span></h3>
            <p>{{ lesson.description }}</p>
            <div v-html="lesson.content" class="lesson-content"></div>
            <button v-if="isLessonAvailable(index)" @click="startLesson(lesson.lesson_id)">Пройти урок</button>
            <button v-else>Недоступно</button>
        </div>
        <div v-if="showFinalTest" class="lesson final-test" :class="{ available: finalTestAvailable }">
            <h3>Финальный тест</h3>
            <p>Пройдите итоговое тестирование после завершения всех уроков.</p>
            <button :disabled="!finalTestAvailable" @click="startLesson(finalTest.lesson_id)">
                Пройти финальный тест
            </button>
        </div>
        </div>
        </main>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import AppSidebar from './AppSidebar.vue';

export default {
    components: {
        AppSidebar,
    },
   props: {
    courseId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      isSidebarOpen: false, // Изначально боковая панель закрыта
      courseTitle: '',
      lessons: [],
      completedLessons: [], // Массив с ID завершенных уроков
      finalTest: null,
    };
  },
  computed: {
    ...mapGetters(['getCourses']),
    course() {
      // Приводим courseId к числу для сравнения
      return this.getCourses.find(course => course.course_id === Number(this.courseId)) || null;
    },
     finalTestAvailable() {
    return this.lessons.every(l => this.completedLessons.includes(l.lesson_id));
    },
    showFinalTest() {
        return !!this.finalTest;
    },
  },
  methods: {
    ...mapActions(['fetchLessons', 'fetchCourses']),
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      async fetchLessonsData() {
  try {
    console.log('Все курсы:', this.getCourses);

    if (this.getCourses.length === 0) {
      console.warn('Курсы еще не загружены. Загружаем...');
      await this.fetchCourses();
    }

    console.log('Курсы после загрузки:', this.getCourses);

    // Загружаем уроки
    const lessonsRes = await axios.get(`http://localhost:5000/api/courses/${this.courseId}/lessons`);
    this.lessons = lessonsRes.data;

    if (!this.course) {
      console.warn('Курс не найден');
      this.courseTitle = 'Курс не найден';
    } else {
      console.log('Название курса:', this.course.title);
      this.courseTitle = this.course.title;
    }

        // Найдём финальный тест
    this.finalTest = this.lessons.find(lesson => lesson.type === 'test');
    this.lessons = this.lessons.filter(lesson => lesson.type !== 'test');

    // Получаем user_id из Vuex
    const userId = this.$store.getters.getUserId;

    if (userId) {
      // Загружаем завершенные уроки из БД
      const progressRes = await axios.get(`http://localhost:5000/api/user/${userId}/progress`);
      this.completedLessons = progressRes.data.map(Number); // [1, 2, 3]
      console.log('Завершённые уроки:', this.completedLessons);
    } else {
      console.warn('Пользователь не авторизован, завершённые уроки не загружены');
      this.completedLessons = [];
    }

  } catch (error) {
    console.error('Ошибка при загрузке уроков или прогресса:', error);
  }
},
    isLessonAvailable(index) {
        if (index === 0) return true; // Первый доступен всегда
        const prevLesson = this.lessons[index - 1];
        console.log('доступен курс:', prevLesson.lesson_id);
        return prevLesson && this.completedLessons.includes(prevLesson.lesson_id);
    },
    startLesson(lessonId) {
        if (this.finalTest && this.finalTest.lesson_id === lessonId) {
            console.log('lessonId:', lessonId);
            this.$router.push({ name: 'FinalTestView', params: { lessonId } });
        } else {
            this.$router.push({ name: 'LessonTheory', params: { lessonId } });
        }

        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            localStorage.setItem('completedLessons', JSON.stringify(this.completedLessons));
        }

        const lesson = this.lessons.find(lesson => lesson.id === lessonId);
        if (lesson) {
            lesson.status = 'completed';
        }
    },
  },
  watch: {
    courseId() {
      this.fetchLessonsData(); // Загружаем уроки при изменении courseId
    },
  },
  async mounted() {
    await this.fetchLessonsData();  // Загружаем уроки при монтировании компонента
  },
};
</script>
  
  <style scoped>
  .lesson {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  .available {
    background-color: white;
  }
  
  .unavailable {
    background-color: #d3d3d3;
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
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
  .completed {
  background-color: #dbdada !important;
  opacity: 0.6;
}
.checkmark {
  color: green;
  margin-left: 10px;
}

.final-test {
  margin-top: 30px;
  padding: 20px;
  background: #fffbe6;
  border: 2px dashed #f4c430;
  border-radius: 8px;
}
  </style>