const { sandboxPool } = require('../db');
const jwt = require('jsonwebtoken');

const runUserQuery = async (req, res) => {
    const { query } = req.body;
  
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Нет токена' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.email;
      const schema = `user_${username.replace(/[@.]/g, '_')}`;
  
      const client = await sandboxPool.connect();
  
      try {
        await client.query(`SET ROLE ${schema}`);
        await client.query(`SET search_path TO ${schema}`);
  
        const result = await client.query(query);
        res.json(result.rows);
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Ошибка выполнения SQL:', err);
      res.status(500).json({ message: err.message });
    }
  };

  const getSchemaInfo = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Нет токена' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.email;
      const schema = `user_${username.replace(/[@.]/g, '_')}`;
  
      const client = await sandboxPool.connect();
  
      try {
        
        await client.query(`SET search_path TO ${schema}`);
  
        const tablesQuery = `
          SELECT table_name, column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = $1
          ORDER BY table_name, ordinal_position
        `;
        const functionsQuery = `
          SELECT routine_name, routine_definition
          FROM information_schema.routines
          WHERE specific_schema = $1
        `;
  
        const [tablesRes, functionsRes] = await Promise.all([
          client.query(tablesQuery, [schema]),
          client.query(functionsQuery, [schema]),
        ]);
  
        res.json({
          tables: tablesRes.rows,
          functions: functionsRes.rows,
        });
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Ошибка получения схемы:', err);
      res.status(500).json({ message: err.message });
    }
  };
module.exports = {
    runUserQuery,getSchemaInfo
  };
