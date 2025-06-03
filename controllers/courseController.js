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
        const lessons = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_id', [courseId]);
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

const getLessonTheory = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const result = await pool.query(
            'SELECT content FROM lesson_theory WHERE lesson_id = $1',
            [lessonId]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Теория не найдена' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


const getLessonById = async (req, res) => {
    const { lessonId } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM lessons WHERE lesson_id = $1',
        [lessonId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Урок не найден' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      // Сначала удаляем связанные уроки (если они есть)
      await pool.query('DELETE FROM lessons WHERE course_id = $1', [courseId]);
      // Затем удаляем сам курс
      const result = await pool.query('DELETE FROM courses WHERE course_id = $1 RETURNING *', [courseId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Курс не найден' });
      }
  
      res.json({ message: 'Курс удалён успешно' });
    } catch (error) {
      console.error('Ошибка при удалении курса:', error);
      res.status(500).json({ message: 'Ошибка сервера при удалении курса' });
    }
  };

const createFullCourse = async (req, res) => {
  const { title, description, level, lessons, finalTest } = req.body;

  try {
    const courseRes = await pool.query(
      'INSERT INTO courses (title, description, level) VALUES ($1, $2, $3) RETURNING *',
      [title, description, level]
    );
    const courseId = courseRes.rows[0].course_id;

    for (const lesson of lessons) {
      const lessonRes = await pool.query(
        'INSERT INTO lessons (course_id, title, content) VALUES ($1, $2, $3) RETURNING *',
        [courseId, lesson.title, lesson.description]
      );
      const lessonId = lessonRes.rows[0].lesson_id;

      await pool.query(
        'INSERT INTO lesson_theory (lesson_id, content) VALUES ($1, $2)',
        [lessonId, lesson.theory]
      );

      for (const assignment of lesson.assignments) {
        await pool.query(
          'INSERT INTO assignments (lesson_id, title, description, solution) VALUES ($1, $2, $3, $4)',
          [lessonId, assignment.title, assignment.description, assignment.solution]
        );
      }
    }

    // Добавление финального теста
    if (finalTest && finalTest.questions.length > 0) {
      const lessonRes = await pool.query(
        'INSERT INTO lessons (course_id, title, content, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [courseId, finalTest.title, finalTest.description || '', 'test']
      );
      const lessonId = lessonRes.rows[0].lesson_id;  
      const testRes = await pool.query(
        'INSERT INTO final_tests (lesson_id, title) VALUES ($1, $2) RETURNING id',
        [lessonId, finalTest.title]
      );
      const testId = testRes.rows[0].id;

      for (const question of finalTest.questions) {
        await pool.query(
          `INSERT INTO final_test_questions (final_test_id, question, correct_answer, options)
           VALUES ($1, $2, $3, $4)`,
          [
            testId,
            question.question,
            JSON.stringify(question.correct_answer),  // jsonb
            question.options || null // text[]
          ]
        );
      }
    }

    res.status(201).json({ message: 'Курс с тестом создан' });
  } catch (error) {
    console.error('Ошибка при создании полного курса:', error);
    res.status(500).json({ message: 'Ошибка при создании курса' });
  }
};

  

module.exports = { getCourses, getLessonsByCourse, createCourse, getLessonTheory, getLessonById, deleteCourse, createFullCourse };