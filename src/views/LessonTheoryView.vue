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
        <div v-if="loading">Загрузка...</div>
        <div v-else>
          <h1>{{ lessonTitle }}</h1>
          <div class="lesson-content" v-html="theoryContent"></div>
          <button @click="goToAssignments">Перейти к заданиям</button>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AppSidebar from './AppSidebar.vue';
  import { marked } from 'marked';
  
  export default {
    components: { AppSidebar },
    data() {
      return {
        isSidebarOpen: false,
        lessonTitle: '',
        theoryContent: '',
        loading: true,
      };
    },
    mounted() {
        this.fetchTheory().then(() => {
            this.addCopyButtons();
        });
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      async fetchTheory() {
        const id = this.$route.params.lessonId;
        try {
          const [lessonRes, theoryRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/lessons/${id}`),
            axios.get(`http://localhost:5000/api/lessons/${id}/theory`)
          ]);
          this.lessonTitle = lessonRes.data.title;
          this.theoryContent = marked.parse(theoryRes.data.content);
        } catch (error) {
          this.lessonTitle = 'Урок не найден';
          this.theoryContent = '';
        } finally {
          this.loading = false;
        }
      },
      goToAssignments() {
        this.$router.push({ name: 'LessonAssignments', params: { lessonId: this.$route.params.lessonId } });
      },
      addCopyButtons() {
            const blocks = document.querySelectorAll('pre');

            blocks.forEach(block => {
            const btn = document.createElement('button');
            btn.innerText = 'Скопировать';
            btn.className = 'copy-btn';
            btn.addEventListener('click', () => {
                const code = block.innerText;
                navigator.clipboard.writeText(code);
                btn.innerText = 'Скопировано!';
                setTimeout(() => (btn.innerText = 'Скопировать'), 1500);
            });
            block.appendChild(btn);
            });
        }
    },
    async created() {
      await this.fetchTheory();
    }
  };
  </script>
  
  <style scoped>
  .lesson-content {
    margin-top: 20px;
    padding: 15px;
    background: #fff;
    border: 1px solid #ccc;
    line-height: 1.6;
  }
  button {
    margin-top: 20px;
    padding: 10px 15px;
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
  }
  </style>
  