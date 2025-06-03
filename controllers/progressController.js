const pool = require('../db');

// Получить прогресс пользователя
const getUserProgress = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT lesson_id FROM user_progress WHERE user_id = $1 AND completed = true',
        [userId]
      );
  
      const completedLessons = result.rows.map(row => row.lesson_id);
      res.json(completedLessons);
    } catch (err) {
      console.error('Ошибка при получении прогресса:', err);
      res.status(500).json({ message: 'Ошибка при получении прогресса' });
    }
  };

// Обновить прогресс пользователя
const markLessonCompleted = async (req, res) => {
    const { user_id, lesson_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO user_progress (user_id, lesson_id, completed, completion_date)
         VALUES ($1, $2, true, NOW())
         ON CONFLICT (user_id, lesson_id) DO UPDATE
         SET completed = true, completion_date = NOW()
         RETURNING *`,
        [user_id, lesson_id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Ошибка в markLessonCompleted:', err); // <-- ОБЯЗАТЕЛЬНО добавить
      res.status(500).json({ message: 'Ошибка при обновлении прогресса' });
    }
  };

  const getUserProgressStats = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const progress = await pool.query(
        `SELECT 
           up.lesson_id, 
           l.title AS lesson_title, 
           up.completion_date 
         FROM user_progress up
         JOIN lessons l ON up.lesson_id = l.lesson_id
         WHERE up.user_id = $1 AND up.completed = true
         ORDER BY up.completion_date DESC`,
        [userId]
      );
  
      res.json(progress.rows);
    } catch (err) {
      console.error('Ошибка при получении статистики:', err);
      res.status(500).json({ message: 'Ошибка при получении статистики' });
    }
  };

const getUserScoreAndRank = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ message: 'Некорректный userId' });

  try {
    // Сумма баллов из заданий и тестов
    const totalScoreRes = await pool.query(`
      SELECT
        COALESCE((
          SELECT SUM(score)
          FROM user_assignment_scores
          WHERE user_id = $1
        ), 0) +
        COALESCE((
          SELECT SUM(correct_answers)
          FROM final_test_results
          WHERE user_id = $1
        ), 0) AS total_score
    `, [userId]);

    // Рейтинг среди всех пользователей (с учётом обеих таблиц)
    const rankRes = await pool.query(`
      SELECT
        u.user_id,
        COALESCE(SUM(s.score), 0) + COALESCE(SUM(f.correct_answers), 0) AS total_score
      FROM users u
      LEFT JOIN user_assignment_scores s ON u.user_id = s.user_id
      LEFT JOIN final_test_results f ON u.user_id = f.user_id
      GROUP BY u.user_id
      ORDER BY total_score DESC
    `);

    const totalScore = totalScoreRes.rows[0].total_score;
    const rank = rankRes.rows.findIndex(row => row.user_id === userId) + 1;

    res.json({ totalScore, rank });
  } catch (err) {
    console.error('Ошибка при получении рейтинга:', err);
    res.status(500).json({ message: 'Ошибка при получении рейтинга' });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.user_id,
        u.username,
        COALESCE(SUM(s.score), 0) + COALESCE(SUM(f.correct_answers), 0) AS total_score
      FROM users u
      LEFT JOIN user_assignment_scores s ON u.user_id = s.user_id
      LEFT JOIN final_test_results f ON u.user_id = f.user_id
      GROUP BY u.user_id
      ORDER BY total_score DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении топа пользователей:', err);
    res.status(500).json({ message: 'Ошибка при получении рейтинга' });
  }
};


module.exports = { getUserProgress, markLessonCompleted,getUserProgressStats, getUserScoreAndRank, getTopUsers};