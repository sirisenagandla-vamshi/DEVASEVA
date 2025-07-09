// ✅ backend/models/userModel.js
const pool = require('../db');

const findUserByContact = async (contact) => {
  const result = await pool.query('SELECT * FROM users WHERE contact = $1', [contact]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async ({ id, name, email, contact }) => {
  const query = 'INSERT INTO users (id, name, email, contact) VALUES ($1, $2, $3, $4)';
  await pool.query(query, [id, name, email, contact]);
};

module.exports = {
  findUserByContact,
  findUserById,
  createUser,
};
