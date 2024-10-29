const pool = require('../db');

// Получить все задания по уроку
const getAssignmentsByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const assignments = await pool.query('SELECT * FROM assignments WHERE lesson_id = $1', [lessonId]);
        res.json(assignments.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Отправить решение
const submitSolution = async (req, res) => {
    const { user_id, assignment_id, submitted_solution } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO user_assignments (user_id, assignment_id, submitted_solution) VALUES ($1, $2, $3) RETURNING *',
            [user_id, assignment_id, submitted_solution]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAssignmentsByLesson, submitSolution };