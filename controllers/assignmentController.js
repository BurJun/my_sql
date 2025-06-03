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

const checkSolution = async (req, res) => {
    const { assignment_id, submitted_solution } = req.body;
  
    try {
      const result = await pool.query('SELECT solution FROM assignments WHERE assignment_id = $1', [assignment_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ correct: false, message: 'Задание не найдено' });
      }
  
      const expected = result.rows[0].solution.trim().toLowerCase();
      const submitted = submitted_solution.trim().toLowerCase();
  
      const isCorrect = expected === submitted;
  
      res.json({ correct: isCorrect });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при проверке решения' });
    }
  };

const saveAssignmentScore = async (req, res) => {
  const { user_id, assignment_id, score, status, attempts_left } = req.body;

  try {
    await pool.query(`
      INSERT INTO user_assignment_scores (user_id, assignment_id, score, status, attempts_left)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, assignment_id)
      DO UPDATE SET score = $3, status = $4, attempts_left = $5
    `, [user_id, assignment_id, score, status, attempts_left]);

    res.json({ message: 'Состояние задания сохранено' });
  } catch (err) {
    console.error('Ошибка при сохранении состояния задания:', err);
    res.status(500).json({ message: 'Ошибка при сохранении' });
  }
};

const getUserAssignmentStates = async (req, res) => {
  const { userId, lessonId } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.assignment_id, uas.status, uas.score, uas.attempts_left
      FROM assignments a
      LEFT JOIN user_assignment_scores uas 
        ON a.assignment_id = uas.assignment_id AND uas.user_id = $1
      WHERE a.lesson_id = $2
    `, [userId, lessonId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении статуса заданий:', err);
    res.status(500).json({ message: 'Ошибка при получении статуса заданий' });
  }
};


module.exports = { getAssignmentsByLesson, submitSolution, checkSolution, saveAssignmentScore,getUserAssignmentStates,};