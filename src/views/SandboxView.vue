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
        <h1>Песочница SQL</h1>
  
        <div class="sandbox-panel">
          <textarea v-model="sqlQuery" placeholder="Введите SQL-запрос..." />
          <button @click="runQuery">Выполнить</button>
          <div v-if="success" class="success-msg">Запрос выполнен успешно</div>
          <div v-if="error" class="error">{{ error }}</div>
  
          <div v-if="result.length" class="results">
            <table>
              <thead>
                <tr>
                  <th v-for="(col, index) in columns" :key="index">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rIndex) in result" :key="rIndex">
                  <td v-for="col in columns" :key="col">{{ row[col] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="query-history">
            <h3>История запросов</h3>
            <ul>
                <li v-for="(q, index) in queryHistory" :key="index" @click="sqlQuery = q">
                {{ q }}
                </li>
            </ul>
           </div>
        </div>
  
        <div class="info-panel">
          <h3>Таблицы</h3>
          <div v-for="table in tables" :key="table.name" class="table-block">
            <strong>{{ table.name }}</strong>
            <ul>
                <li v-for="col in table.columns" :key="col.column_name">
                {{ col.column_name }} ({{ col.data_type }})
                </li>
            </ul>
          </div>
  
          <h3>Процедуры и функции</h3>
          <ul>
            <li v-for="func in functions" :key="func.name">
              <button @click="showSource(func.definition)">
                {{ func.name }}
              </button>
            </li>
          </ul>
        </div>
  
        <div v-if="sourcePopup" class="popup">
          <pre>{{ sourcePopup }}</pre>
          <button @click="sourcePopup = null">Закрыть</button>
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
        sqlQuery: '',
        result: [],
        columns: [],
        error: null,
        success: false,
        tables: [],
        functions: [],
        sourcePopup: null,
        queryHistory: [],
      };
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      async runQuery() {
        this.error = null;
        this.result = [];
        this.columns = [];
        this.success = false;
        this.queryHistory.unshift(this.sqlQuery); // Добавляем в начало списка
        if (this.queryHistory.length > 20) this.queryHistory.pop(); // ограничиваем до 20
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post('http://localhost:5000/api/sandbox/run', {
            query: this.sqlQuery,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (res.data && res.data.length > 0) {
            this.result = res.data;
            this.columns = Object.keys(res.data[0]);
          } else {
            this.success = true;
          }
  
          await this.loadSchemaInfo();
        } catch (err) {
          this.error = err.response?.data?.message || 'Ошибка выполнения запроса';
        }
      },
      async loadSchemaInfo() {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/sandbox/schema-info', {
            headers: { Authorization: `Bearer ${token}` },
        });


        // Группировка колонок по таблицам
        const groupedTables = {};
        for (const row of res.data.tables) {
            if (!groupedTables[row.table_name]) {
            groupedTables[row.table_name] = [];
            }
            groupedTables[row.table_name].push({
            column_name: row.column_name,
            data_type: row.data_type,
            });
        }

        // Преобразуем в массив объектов: { name, columns }
        this.tables = Object.entries(groupedTables).map(([name, columns]) => ({
            name,
            columns,
        }));

        this.functions = res.data.functions.map(f => ({
            name: f.routine_name,
            definition: f.routine_definition,
        }));
        console.log('Tables raw:', res.data.tables);
        },
      showSource(def) {
        this.sourcePopup = def;
      },
    },
    async mounted() {
      await this.loadSchemaInfo();
    }
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
  overflow-y: auto;
  display: block; /* БЫЛО: flex, СТАЛО: block */
}

.sandbox-panel {
  margin-bottom: 40px; /* Отступ от нижней панели */
}

.info-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

textarea {
  width: 100%;
  height: 150px;
  font-family: monospace;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  background-color: #0277bd;
  color: white;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
}

.results {
  margin-top: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

.error {
  color: red;
  margin-top: 10px;
}

.success-msg {
  color: green;
  margin-top: 10px;
}

.table-block {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.table-block strong {
  display: block;
  margin-bottom: 6px;
  font-size: 1.1rem;
  color: #0277bd;
}

.table-block ul {
  margin: 0;
  padding-left: 20px;
}

.popup {
  position: fixed;
  top: 120px;
  right: 40px;
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  max-height: 60vh;
  overflow: auto;
  z-index: 100;
}
.query-history {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.query-history ul {
  list-style: none;
  padding-left: 0;
}

.query-history li {
  cursor: pointer;
  padding: 6px;
  border-bottom: 1px solid #eee;
  font-family: monospace;
}

.query-history li:hover {
  background-color: #f0f0f0;
}
</style>
