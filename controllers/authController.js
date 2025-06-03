const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Подключение к базе данных
require('dotenv').config();

const authController = {
  // Регистрация пользователя
  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Проверка на существование пользователя
      const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Добавление пользователя в базу данных
      const newUser = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );

            // После вставки пользователя в таблицу:
        const sandbox = require('../db').sandboxPool;
        // После вставки пользователя
        const escapeLiteral = str => str.replace(/'/g, "''"); // экранирует ' в строках
        const escapeIdent = str => str.replace(/"/g, '""');   // экранирует " в именах (роль, схема)

        const emailUs = newUser.rows[0].email;
        const safeUsername = `user_${emailUs.replace(/[@.]/g, '_')}`;
        const safePassword = escapeLiteral(password);

        // создаём роль и схему
        await sandbox.query(`CREATE ROLE "${escapeIdent(safeUsername)}" LOGIN PASSWORD '${safePassword}'`);
        await sandbox.query(`GRANT "${escapeIdent(safeUsername)}" TO sandbox_user`);
        await sandbox.query(`CREATE SCHEMA AUTHORIZATION "${escapeIdent(safeUsername)}"`);

        // даём доступ
        await sandbox.query(`GRANT USAGE ON SCHEMA "${escapeIdent(safeUsername)}" TO "${escapeIdent(safeUsername)}"`);
        await sandbox.query(`GRANT USAGE, CREATE ON SCHEMA "${safeUsername}" TO "${safeUsername}"`);

      res.status(201).json({ message: 'Регистрация успешна', user: newUser.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при регистрации' });
    }
  },

  // Авторизация пользователя
  // Авторизация пользователя
  login: async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // ВЫБИРАЕМ password_hash тоже
      const result = await db.query(
        'SELECT user_id, username, email, password_hash FROM users WHERE email = $1',
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }
  
      const user = result.rows[0];
  
      // Проверка пароля
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }
  
      // Генерация токена
      const token = jwt.sign(
        { userId: user.user_id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
  
      // Возврат id + username для фронта
      res.json({
        message: 'Авторизация успешна',
        token,
        user: {
          id: user.user_id,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      res.status(500).json({ message: 'Ошибка при авторизации' });
    }
  },

  // Получение текущего пользователя
  getCurrentUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Неавторизованный запрос' });
      }
  
      const token = authHeader.split(' ')[1];
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Токен истёк. Зайдите снова.' });
        }
        return res.status(403).json({ message: 'Невалидный токен' });
      }
  
      const userId = decoded.userId;
  
      const user = await db.query(
        'SELECT user_id, username, email FROM users WHERE user_id = $1',
        [userId]
      );
  
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      res.json({
        id: user.rows[0].user_id,
        username: user.rows[0].username,
      });
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      res.status(500).json({ message: 'Ошибка при получении данных пользователя' });
    }
  },
};


module.exports = authController;