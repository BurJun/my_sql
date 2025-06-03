import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { marked } from 'marked';

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

import './assets/styles.css';

// Настройка подсветки кода
marked.setOptions({
  highlight: (code, lang) => {
    return hljs.highlight(code, { language: lang }).value;
  }
});

// Асинхронный запуск
(async () => {
  store.commit('setToken', localStorage.getItem('token'));
  if (store.state.token) {
    await store.dispatch('fetchUser');
  }

  const app = createApp(App);
  app.config.globalProperties.$marked = marked;

  app
    .use(router)
    .use(store)
    .use(VCalendar, {})
    .mount('#app');
})();
