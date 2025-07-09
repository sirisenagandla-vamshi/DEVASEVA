const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper to generate a numeric OTP of given length
function generateOtp(length = 4) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

let sotp = ""; // Temporary in-memory OTP (for demo/testing only)

// Check if a user exists based on contact number
router.get('/identity-exist', async (req, res) => {
  const { contact } = req.query;
  try {
    const result = await pool.query('SELECT id FROM users WHERE contact = $1', [contact]);
    res.json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error('Error checking contact existence:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details by contact number
router.get('/by-contact/:contact', async (req, res) => {
  const { contact } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, email, contact FROM users WHERE contact = $1',
      [contact]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user by contact:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new user
router.post('/users', async (req, res) => {
  const { name, email, contact } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, contact) VALUES ($1, $2, $3) RETURNING id',
      [name, email, contact]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Generate OTP and send (console log for now)
router.post('/otp', async (req, res) => {
  const { contact } = req.body;

  // Basic validation for Indian mobile number format
  if (!contact || !/^[6-9]\d{9}$/.test(contact)) {
    return res.status(400).json({ message: 'Invalid contact number' });
  }

  sotp = generateOtp();
  console.log(`📲 OTP for ${contact}: ${sotp}`); // Simulated send

  res.json({ success: true, message: 'OTP sent' });
});

// Verify OTP entered by user
router.post('/otp-verify', (req, res) => {
  const { contact, otp } = req.body;

  if (otp == sotp) {
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
});

module.exports = router;
