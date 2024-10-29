const pool = require('../db');

// Получить прогресс пользователя
const getUserProgress = async (req, res) => {
    const { userId } = req.params;
    try {
        const progress = await pool.query('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
        res.json(progress.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Обновить прогресс пользователя
const updateUserProgress = async (req, res) => {
    const { user_id, lesson_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE user_progress SET completed = TRUE, completion_date = CURRENT_TIMESTAMP WHERE user_id = $1 AND lesson_id = $2 RETURNING *',
            [user_id, lesson_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProgress, updateUserProgress };