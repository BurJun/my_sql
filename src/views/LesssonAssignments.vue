<template>
    <div class="main-container">
      <!-- Верхняя панель -->
      <header class="header">
        <div class="menu-icon" @click="toggleSidebar">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <img class="site-logo" src="@/assets/elephant-character.png" alt="Site Logo" />
      </header>
  
      <!-- Боковая панель -->
      <AppSidebar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
  
      <!-- Основной контент -->
      <main class="content">
        <div v-if="loading">Загрузка заданий...</div>
        <div v-else>
          <h1>Задания: {{ lessonTitle }}</h1>
  
          <div v-for="task in assignments" :key="task.assignment_id" class="assignment-block">
            <div class="assignment-title">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
            </div>

            <!-- Сердца -->
            <div class="hearts">
                <span v-for="n in task.attemptsLeft" :key="n">❤️</span>
            </div>

            <textarea v-model="task.userInput" placeholder="Введите SQL-запрос..."></textarea>

            <div class="button-group">
            <button 
                @click="checkSolution(task)"
                :disabled="task.attemptsLeft === 0 || task.status === 'correct'">
                Проверить
            </button>

            <button  
                v-if="task.attemptsLeft === 0 && task.status !== 'correct' && !task.showAnswer"
                @click="task.showAnswer = true">
                Показать решение
            </button>

            <span v-if="task.status === 'correct'" class="status-icon success">✔️</span>
            <span v-if="task.status === 'wrong'" class="status-icon error">✖️</span>
            </div>

            <pre v-if="task.showAnswer">{{ task.solution }}</pre>
            </div>
          <button v-if="allSolved" class="next-lesson-button" @click="goToNextLesson">
                Перейти к следующему уроку
            </button>
        </div>
        <!-- Модальное окно -->
    <div v-if="showZeroScoreModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Ты пока не набрал баллов</h3>
        <p>Но не расстраивайся — у тебя всё получится!</p>
        <button @click="closeModal">Спасибо</button>
      </div>
    </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AppSidebar from './AppSidebar.vue';
  import hljs from 'highlight.js';
  import { mapGetters } from 'vuex';
  
  export default {
    components: { AppSidebar },
    data() {
      return {
        isSidebarOpen: false,
        lessonTitle: '',
        assignments: [],
        loading: true,
        lessons: [],          // <--- добавлено
        finalTest: null,   
        showZeroScoreModal: false
      };
    },
    computed: {
        ...mapGetters(['getUserId']),
        
        allSolved() {
  return this.assignments.length > 0 &&
         this.assignments.every(a => a.status === 'correct' || a.attemptsLeft === 0);
},
    totalScore() {
      return this.assignments.reduce((sum, t) => sum + (t.score || 0), 0);
    }
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
        async goToNextLesson() {
            const currentLessonId = Number(this.$route.params.lessonId);
            const currentIndex = this.lessons.findIndex(l => l.lesson_id === currentLessonId);
            const nextLesson = this.lessons[currentIndex + 1];


            if (nextLesson) {
                // Переход к следующему уроку
                this.$router.push({ name: 'LessonTheory', params: { lessonId: nextLesson.lesson_id } });
            } else if (this.finalTest) {
                // Все уроки пройдены — переходим к финальному тесту
                this.$router.push({ name: 'FinalTestView', params: { lessonId: this.finalTest.lesson_id } });
            } else {
                // Курс завершён, теста нет
                alert('Курс завершён');
                this.$router.push({ name: 'main' });
            }
        },
      async fetchData() {
        const lessonId = Number(this.$route.params.lessonId);
        try {
            // Загружаем текущий урок
            const lessonRes = await axios.get(`http://localhost:5000/api/lessons/${lessonId}`);
            const courseId = lessonRes.data.course_id;
            this.lessonTitle = lessonRes.data.title;

            // Загружаем все уроки курса
            const lessonsRes = await axios.get(`http://localhost:5000/api/courses/${courseId}/lessons`);
            const allLessons = lessonsRes.data;

            // Отделяем финальный тест
            this.finalTest = allLessons.find(lesson => lesson.type === 'test');
            this.lessons = allLessons.filter(lesson => lesson.type !== 'test');

            // Загружаем задания урока
            const [tasksRes, userStatusRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/lessons/${lessonId}/assignments`),
            axios.get(`http://localhost:5000/api/assignments/user/${this.getUserId}/lesson/${lessonId}`)
            ]);

            const statusMap = {};
            userStatusRes.data.forEach(row => {
            statusMap[row.assignment_id] = {
                status: row.status || null,
                attemptsLeft: row.attempts_left ?? 3,
                score: row.score ?? 0
            };
            });

            this.assignments = tasksRes.data.map(t => ({
            ...t,
            userInput: '',
            showAnswer: false,
            status: statusMap[t.assignment_id]?.status ?? null,
            attemptsLeft: statusMap[t.assignment_id]?.attemptsLeft ?? 3,
            score: statusMap[t.assignment_id]?.score ?? 0
            }));
        } catch (err) {
            console.error('Ошибка при загрузке данных:', err);
        } finally {
            this.loading = false;
        }
      },
      async checkSolution(task) {
        if (task.status === 'correct' || task.attemptsLeft === 0) return;

        try {
            const res = await axios.post('http://localhost:5000/api/assignments/check', {
                assignment_id: task.assignment_id,
                submitted_solution: task.userInput
            });


            task.status = res.data.correct ? 'correct' : 'wrong';
            if (res.data.correct) {
                task.score = task.attemptsLeft;
                alert(`Правильно! Вы заработали ${task.score} балл(а)`);
                await this.saveScore(task); // добавь метод saveScore ниже
            } else {
            task.attemptsLeft--;
            if (task.attemptsLeft === 0) {
                alert('Вы использовали все попытки. Откроется решение.');
            } else {
                alert(`Неверно. Осталось попыток: ${task.attemptsLeft}`);
            }
            }
        } catch (err) {
            alert('Ошибка при проверке');
        }
        },
      async submit(task) {
        try {
          await axios.post(`http://localhost:5000/api/assignments/submit`, {
            user_id: 1, // заглушка
            assignment_id: task.assignment_id,
            submitted_solution: task.userInput
          });
          alert('Решение отправлено!');
        } catch (err) {
          console.error(err);
          alert('Ошибка при отправке');
        }
      },
      async markLessonAsCompleted() {
        try {
            await axios.post('http://localhost:5000/api/user/progress', {
                user_id: this.getUserId, 
                lesson_id: Number(this.$route.params.lessonId)
            });
        } catch (e) { 
            console.error('User_id:', this.getUserId);
            console.error('lesson_id:', Number(this.$route.params.lessonId));
            console.error('!!!Ошибка при отметке урока завершённым:', e);
        }
      },
      async saveScore(task) {
        try {
            await axios.post('http://localhost:5000/api/assignments/score', {
            user_id: this.getUserId,
            assignment_id: task.assignment_id,
            score: task.score || 0,
            status: task.status || 'wrong',
            attempts_left: task.attemptsLeft ?? 0
            });
        } catch (err) {
            console.error('Ошибка при сохранении баллов:', err);
        }
      },
      async checkAnswer(task) {
      try {
        const res = await axios.post('http://localhost:5000/api/assignments/check', {
          assignment_id: task.assignment_id,
          submitted_solution: task.userInput
        });

        task.status = res.data.correct ? 'correct' : 'wrong';


        if (res.data.correct) {
          task.score = task.attemptsLeft;
          alert(`Правильно! Вы заработали ${task.score} балл(а)`);
          await this.saveScore(task);
        } else {
          task.attemptsLeft--;
          if (task.attemptsLeft === 0) {
            alert('Вы использовали все попытки. Откроется решение.');
          } else {
            alert(`Неверно. Осталось попыток: ${task.attemptsLeft}`);
          }
        }
      } catch (err) {
        alert('Ошибка при проверке');
      }
    },
    closeModal() {
      this.showZeroScoreModal = false;
    }
    },
   
    watch: {
    allSolved(newVal) {
      if (newVal) {
        if (this.totalScore === 0) {
          this.assignments.forEach(task => {
            if (!task.status) {
              task.status = 'wrong';
              task.score = 0;
              this.saveScore(task);
            }
          });
          this.showZeroScoreModal = true;
        }
        this.markLessonAsCompleted();
      }
    }
  },
  mounted() {
    this.fetchData().then(() => {
      this.$nextTick(() => {
        document.querySelectorAll('pre').forEach(block => {
          hljs.highlightElement(block);
        });
      });
    });
  }
  };
  </script>
  
  <style scoped>
  .assignment-block {
    margin-bottom: 25px;
    padding: 15px;
    background: white;
    border: 1px solid #ccc;
  }
  .assignment-title {
    margin-bottom: 10px;
  }
  textarea {
    width: 100%;
    min-height: 120px;
    margin-top: 10px;
    font-family: monospace;
    padding: 10px;
    border: 1px solid #ccc;
  }
  pre {
    background: #f5f5f5;
    padding: 10px;
    margin-top: 10px;
    white-space: pre-wrap;
  }
  .button-group {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
  button {
    padding: 8px 14px;
    cursor: pointer;
  }
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
  padding: 100px 40px 40px;
  background-color: #e6f7ff;
  overflow-y: auto; /* ВАЖНО */
  }
  .next-lesson-button {
  margin-top: 40px;
  padding: 12px 20px;
  font-size: 16px;
  background: #0277bd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.assignment-block:last-of-type {
  margin-bottom: 40px;
}
.hearts {
  margin: 8px 0;
  font-size: 1.2rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-bottom: 10px;
}

.modal-content button {
  margin-top: 15px;
  background-color: #0277bd;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
  </style>
