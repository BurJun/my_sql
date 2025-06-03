<template>
  <div class="main-container">
    <!-- Боковая панель -->
    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <span class="username">{{ userName }}</span>
      </div>
      <ul class="menu">
        <li @click="navigate('/main')">Мой курс</li>
        <li @click="navigate('/stats')">Статистика</li>
        <li @click="navigate('/sandbox')">Песочница</li>
        <li @click="navigate('/feedback')">Обратная связь</li>
        <li @click="navigate('/login')">Сменить аккаунт</li>
      </ul>
      <!-- Блок новостей -->
    <div class="postgres-news" v-if="news.length">
      <strong>Новости PostgreSQL</strong>
      <ul>
        <li v-for="item in news" :key="item.guid">
          <a :href="item.link" target="_blank">{{ item.title }}</a><br />
          <small>{{ new Date(item.pubDate).toLocaleDateString('ru-RU') }}</small>
        </li>
      </ul>
    </div>
    </aside>

    <!-- Основной контент -->
    <main class="content" @click="closeSidebar">
      <slot />
    </main>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'AppSidebar',
  props: {
    isSidebarOpen: Boolean,
  },
  data() {
    return {
      news: [],
    };
  },
  computed: {
    ...mapGetters(['getUserName']),
    userName() {
      return this.getUserName || 'Гость';
    },
  },
  methods: {
    async fetchNews() {
      try {
        const res = await axios.get('https://api.rss2json.com/v1/api.json', {
          params: {
            rss_url: 'https://www.postgresql.org/news.rss',
          },
        });
        this.news = res.data.items;
      } catch (err) {
        console.error('Ошибка загрузки новостей:', err);
      }
    },
    navigate(route) {
      this.$emit('toggleSidebar'); // закрываем
      this.$router.push(route);
    },
    closeSidebar() {
      if (this.isSidebarOpen) {
        this.$emit('toggleSidebar');
      }
    },
  },
  mounted() {
    this.fetchNews();
  },
};
</script>

<style scoped>
.main-wrapper {
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
  justify-content: space-between;
  padding: 0 20px;
  color: #fff;
  z-index: 1001;
}

.menu-icon {
  cursor: pointer;
}

.site-logo {
  height: 50px;
  width: 50px;
}

.sidebar {
  position: fixed;
  top: 100px; /* ниже header */
  left: 0;
  width: 250px;
  bottom: 0;
  background-color: #f4f4f4;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-open {
  transform: translateX(0);
}

.menu {
  list-style: none;
  padding: 20px;
}

.menu li {
  margin-bottom: 10px;
  cursor: pointer;
}

.content {
  margin-left: 0;
  padding: 120px 20px 40px;
  background-color: #e6f7ff;
  min-height: 100vh;
}

.postgres-news {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  max-height: 280px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #0074D9;
  padding: 10px;
  font-size: 14px;
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1100;
}
.sidebar {
  position: fixed;
  top: 100px; /* ниже шапки */
  left: 0;
  bottom: 0;
  width: 250px;
  background-color: #f4f4f4;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  padding-top: 20px;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #333;
}

.menu li:hover {
  background-color: #ddd;
}

.postgres-news {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #0074D9;
  padding: 10px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}


</style>
