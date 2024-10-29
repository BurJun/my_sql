const express = require('express');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController');
const assignmentController = require('./controllers/assignmentController');
const progressController = require('./controllers/progressController');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Маршруты для регистрации и входа
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Маршруты для курсов и уроков
app.get('/api/courses', courseController.getCourses);
app.get('/api/courses/:courseId/lessons', courseController.getLessonsByCourse);
app.post('/api/courses', courseController.createCourse);

// Маршруты для заданий и решений
app.get('/api/lessons/:lessonId/assignments', assignmentController.getAssignmentsByLesson);
app.post('/api/assignments/submit', assignmentController.submitSolution);

// Маршруты для прогресса пользователя
app.get('/api/user/:userId/progress', progressController.getUserProgress);
app.put('/api/user/progress', progressController.updateUserProgress);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});