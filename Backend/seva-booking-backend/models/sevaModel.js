// ✅ backend/models/sevaModel.js
const pool = require('../db/index');

const getAllSevas = async () => {
  const result = await pool.query(
    'SELECT id, name, price, image_url FROM sevas'
  );
  return result.rows;
};

module.exports = {
  getAllSevas,
};