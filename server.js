const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Импортируем cors
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController');
const assignmentController = require('./controllers/assignmentController');
const progressController = require('./controllers/progressController');
const sandboxController = require('./controllers/sandboxController');
const finalTestController = require('./controllers/finalTestController');

const { query } = require('./db'); // Импортируем query для работы с запросами

// Загружаем переменные окружения из .env файла
dotenv.config();

// Инициализация приложения Express
const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Настройка CORS для разрешения запросов с клиентской стороны
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5001'  // Динамически разрешаем запросы с клиентского URL
}));

// Порт сервера
const PORT = process.env.PORT || 5000;  // Убедитесь, что значение порта корректно

// Главная страница для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает! Добро пожаловать!');
});

app.get('/api/users', async (req, res) => {
    try {
      // Запрос к базе данных для получения всех пользователей
      const result = await query('SELECT * FROM users'); 
      res.json(result.rows); // Отправляем пользователей в формате JSON
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      res.status(500).json({ message: 'Ошибка при получении данных о пользователях', error: error.message });
    }
  });

 app.get('/api/users/me', authController.getCurrentUser); 
  
// Маршруты для регистрации и авторизации
app.post('/api/register', authController.register);  // Регистрация пользователя
app.post('/api/login', authController.login);        // Авторизация пользователя

// Маршруты для работы с курсами и уроками
app.get('/api/courses', courseController.getCourses);  // Получение всех курсов
app.get('/api/courses/:courseId/lessons', courseController.getLessonsByCourse);  // Получение уроков для курса
app.delete('/api/courses/:courseId', courseController.deleteCourse);
app.post('/api/courses/full', courseController.createFullCourse);
app.get('/api/lessons/:lessonId/theory', courseController.getLessonTheory); // Теория уроков
app.get('/api/lessons/:lessonId', courseController.getLessonById);

// Маршруты для работы с заданиями и их решениями
app.get('/api/lessons/:lessonId/assignments', assignmentController.getAssignmentsByLesson);  // Получение заданий для урока
app.post('/api/assignments/submit', assignmentController.submitSolution);  // Отправка решения задания
app.post('/api/assignments/check', assignmentController.checkSolution);
app.post('/api/assignments/score', assignmentController.saveAssignmentScore);
app.get('/api/assignments/user/:userId/lesson/:lessonId', assignmentController.getUserAssignmentStates);

// Маршруты для прогресса пользователя
app.get('/api/user/:userId/progress', progressController.getUserProgress);  // Получение прогресса пользователя
app.post('/api/user/progress', progressController.markLessonCompleted);  // Обновление прогресса пользователя
app.get('/api/user/:userId/rank', progressController.getUserScoreAndRank);
app.get('/api/user/top', progressController.getTopUsers);

app.get('/api/user/:userId/stats', progressController.getUserProgressStats);

app.post('/api/sandbox/run', sandboxController.runUserQuery);
app.get('/api/sandbox/schema-info', sandboxController.getSchemaInfo);

app.get('/api/final-test/:lessonId', finalTestController.getFinalTestByLesson);
app.post('/api/final-test/submit', finalTestController.submitFinalTest);

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Что-то пошло не так' });
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});