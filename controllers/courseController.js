const pool = require('../db');

// Получить все курсы
const getCourses = async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM courses');
        res.json(courses.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Получить все уроки в курсе
const getLessonsByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const lessons = await pool.query('SELECT * FROM lessons WHERE course_id = $1', [courseId]);
        res.json(lessons.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Создать курс
const createCourse = async (req, res) => {
    const { title, description, created_by, level } = req.body;
    try {
        const newCourse = await pool.query(
            'INSERT INTO courses (title, description, created_by, level) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, created_by, level]
        );
        res.status(201).json(newCourse.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCourses, getLessonsByCourse, createCourse };