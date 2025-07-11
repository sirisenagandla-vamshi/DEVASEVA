// models/orderModel.js
const pool = require('../db');

// Create a new order
const createOrder = async ({ user_id, items, address, amounttopay, paymentid }) => {
  const query = `
    INSERT INTO orders (user_id, items, address, amounttopay, paymentid)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    user_id,
    JSON.stringify(items),   
    JSON.stringify(address), 
    amounttopay,
    paymentid
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all orders for a user
const getOrdersByUserId = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [user_id]
  );
  return result.rows;
};

// Get latest 3 orders
const getLatestOrdersByUserId = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
    [user_id]
  );
  return result.rows;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getLatestOrdersByUserId,
};
