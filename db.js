const { Pool } = require('pg');
require('dotenv').config();

// Основное подключение
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Подключение к песочнице
const sandboxPool = new Pool({
  user: process.env.SANDBOX_USER || 'sandbox_user',
  password: process.env.SANDBOX_PASSWORD || 'user_pass',
  host: process.env.SANDBOX_HOST || 'localhost',
  port: process.env.SANDBOX_PORT || 5432,
  database: process.env.SANDBOX_DB || 'sandbox_db',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  sandboxQuery: (text, params) => sandboxPool.query(text, params),
  pool,          // если нужно транзакции делать вручную
  sandboxPool,
};
