const db = require('../db');

// Получение теста по lesson_id
const getFinalTestByLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const testResult = await db.query('SELECT * FROM final_tests WHERE lesson_id = $1', [lessonId]);
    if (testResult.rows.length === 0) return res.status(404).json({ message: 'Тест не найден' });

    const test = testResult.rows[0];
    const questionsResult = await db.query(
      `SELECT id, question, options FROM final_test_questions WHERE final_test_id = $1 order by id`,
      [test.id]
    );

    res.json({
      testId: test.id,
      title: test.title,
      questions: questionsResult.rows.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options || null, // если null — значит это input
      }))
    });
  } catch (err) {
    console.error('Ошибка получения теста:', err);
    res.status(500).json({ message: 'Ошибка при получении теста' });
  }
};

// Проверка ответов (можно оставить без изменений)
const submitFinalTest = async (req, res) => {
  const { testId, answers } = req.body;

  try {
    const result = await db.query(
      'SELECT id, correct_answer FROM final_test_questions WHERE final_test_id = $1',
      [testId]
    );

    const correctMap = Object.fromEntries(
      result.rows.map(row => {
        try {
          return [row.id, JSON.parse(row.correct_answer)];
        } catch (e) {
          console.warn(`Некорректный JSON в correct_answer у вопроса ${row.id}:`, row.correct_answer);
          return [row.id, row.correct_answer?.toLowerCase() ?? ''];
        }
      })
    );

    let score = 0;

    for (const ans of answers) {
      const correct = correctMap[ans.questionId];
      const user = Array.isArray(ans.answer)
        ? ans.answer.map(a => a.trim().toLowerCase())
        : [String(ans.answer).trim().toLowerCase()];

      if (
        Array.isArray(correct)
          ? arraysEqual(correct, user)
          : correct === user[0]
      ) {
        score++;
      }
    }

    const userId = req.user?.id || 1;

    await db.query(
      `INSERT INTO final_test_results (user_id, test_id, correct_answers, total_questions)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, test_id)
       DO UPDATE SET correct_answers = $3, total_questions = $4`,
      [userId, testId, score, result.rows.length]
    );

    // === ДОБАВЛЕНО: запись прогресса ===
    const lessonId = await getLessonIdByTestId(testId); // если testId связан с уроком
    if (lessonId) {
      await db.query(
        `INSERT INTO user_progress (user_id, lesson_id, completed, completion_date)
         VALUES ($1, $2, true, NOW())
         ON CONFLICT (user_id, lesson_id) DO UPDATE
         SET completed = true, completion_date = NOW()
         RETURNING *`,
        [userId, lessonId]
      );
    }

    res.json({ total: result.rows.length, correct: score });
  } catch (err) {
    console.error('Ошибка проверки теста:', err);
    res.status(500).json({ message: 'Ошибка при проверке теста' });
  }
};

function arraysEqual(a, b) {
  return Array.isArray(a) &&
         Array.isArray(b) &&
         a.length === b.length &&
         a.every(val => b.includes(val));
}

// Вспомогательная функция (примерная реализация)
async function getLessonIdByTestId(testId) {
  const result = await db.query(
    'SELECT lesson_id FROM final_tests WHERE id = $1',
    [testId]
  );
  return result.rows[0]?.lesson_id;
}


module.exports = { getFinalTestByLesson, submitFinalTest };
