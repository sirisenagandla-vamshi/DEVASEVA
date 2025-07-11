const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel'); // ✅ newly added
const { v4: uuidv4 } = require('uuid');
const pool = require('../db'); // still used in checkIdentity and createUser

// Check if user exists by mobile contact
const checkIdentity = async (req, res) => {
  const contact = req.query.contact;
  try {
    const user = await userModel.findUserByContact(contact);
    res.json({ exists: !!user });
  } catch (err) {
    console.error('Error checking identity:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const id = uuidv4();
    const { name, email, contact } = req.body;
    await userModel.createUser({ id, name, email, contact });
    res.status(201).json({ id, name, email, contact });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile along with recent orders
const getUserProfile = async (req, res) => {
  const userId = req.query.id;
  if (!userId || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    const user = await userModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orderResult = await orderModel.getLatestOrdersByUserId(userId); // ✅ replaced pool.query

    res.json({
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      latestOrders: orderResult, // ✅ already an array
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  checkIdentity,
  createUser,
  getUserProfile,
};
