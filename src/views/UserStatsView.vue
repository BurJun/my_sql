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
        <h1>Статистика пользователя</h1>
        <div v-if="loading">Загрузка статистики...</div>
        <div v-else>
          <v-calendar :attributes="calendarEvents" is-expanded />

          <div class="last-lesson">
            <h2>Последний пройденный урок:</h2>
            <p v-if="lastLesson">{{ lastLesson.title }}</p>
            <p v-else>Нет завершённых уроков</p>
          </div>
  
          <button
            v-if="nextLessonId"
            class="next-lesson-button"
            @click="goToNextLesson"
          >
            Перейти к следующему уроку
          </button>

          <div class="score-box">
            <p>
                Ваши баллы:
                <strong>{{ userScore }}</strong>
            </p>
            <p>
                Место в рейтинге:
                <strong>
                <span v-if="userRank === 1">👑 {{ userRank }} (лидер)</span>
                <span v-else>{{ userRank }}</span>
                </strong>
            </p>
        </div>
        <div class="leaderboard">
        <h2>Топ-5 пользователей</h2>
            <div class="leaderboard-grid">
                <div v-for="(user, index) in topUsers" :key="user.user_id" class="leaderboard-card">
                <div class="place-icon">
                    <span v-if="index === 0">👑</span>
                    <span v-else-if="index === 1">🥈</span>
                    <span v-else-if="index === 2">🥉</span>
                    <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="user-info">
                    <p class="username">{{ user.username }}</p>
                    <p class="score">{{ user.total_score }} баллов</p>
                </div>
                </div>
            </div>
        </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import AppSidebar from './AppSidebar.vue';
import { mapGetters, mapActions } from 'vuex';
import { Calendar } from 'v-calendar';

export default {
  components: {
    AppSidebar,
    'v-calendar': Calendar,
  },
  data() {
    return {
      isSidebarOpen: false,
      loading: true,
      calendarEvents: [],
      lastLesson: null,
      nextLessonId: null,
      userScore: 0,
      userRank: null,
      topUsers: [],
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
  methods: {
    ...mapActions(['fetchUser']),
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async fetchProgress() {
  try {
    const userId = this.getUserId;
    const res = await axios.get(`http://localhost:5000/api/user/${userId}/stats`);
    const progress = res.data;

    this.calendarEvents = progress.map(item => ({
      key: item.lesson_id,
      highlight: true,
      dates: new Date(item.completion_date),
      popover: {
        label: `Урок #${item.lesson_title}`,
      },
    }));

    if (progress.length > 0) {
      const last = progress[0]; // т.к. отсортированы по дате убывания
      const lessonRes = await axios.get(`http://localhost:5000/api/lessons/${last.lesson_id}`);
      this.lastLesson = lessonRes.data;
      this.nextLessonId = last.lesson_id + 1;
    }

  } catch (err) {
    console.error('Ошибка при загрузке прогресса:', err);
  } finally {
    this.loading = false;
  }
},
    goToNextLesson() {
      this.$router.push({ name: 'LessonTheory', params: { lessonId: this.nextLessonId } });
    },
    async fetchUserStats() {
        const userId = this.getUserId;
        const res = await axios.get(`http://localhost:5000/api/user/${userId}/rank`);
        this.userScore = res.data.totalScore;
        this.userRank = res.data.rank;
    },
    async fetchTopUsers() {
  try {
    const res = await axios.get('http://localhost:5000/api/user/top');
    this.topUsers = res.data;
  } catch (err) {
    console.error('Ошибка при загрузке топа пользователей:', err);
  }
},
  },
  async mounted() {
    await this.fetchUser();
    await this.fetchProgress();
    await this.fetchUserStats();
    await this.fetchTopUsers();
  },
};
</script>

  

  
  <style scoped>
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
    padding: 80px 40px;
    background-color: #e6f7ff;
    overflow-y: auto;
  }
  .last-lesson {
    margin-top: 30px;
  }
  .next-lesson-button {
    margin-top: 20px;
    padding: 12px 20px;
    font-size: 16px;
    background: #0277bd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
.score-box {
  margin-top: 30px;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  border: 2px solid #0277bd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 18px;
}

.score-box strong {
  color: #0277bd;
  font-weight: bold;
}

.score-box span {
  font-size: 20px;
}

.leaderboard {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.leaderboard table {
  width: 100%;
  border-collapse: collapse;
}
.leaderboard th, .leaderboard td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.leaderboard td:first-child {
  width: 50px;
  text-align: center;
}
.leaderboard {
  margin-top: 30px;
  background: #ffffff;
  padding: 25px;
  border-radius: 10px;
  border: 2px solid #0277bd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.leaderboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.leaderboard-card {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: transform 0.2s;
}

.leaderboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.place-icon {
  font-size: 28px;
  width: 40px;
  text-align: center;
  color: #0277bd;
  margin-right: 15px;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin: 0;
}

.score {
  margin: 3px 0 0;
  color: #555;
  font-size: 14px;
}
  </style>
  