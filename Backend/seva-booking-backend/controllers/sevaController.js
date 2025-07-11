const pool = require('../db'); // PostgreSQL connection pool

// Get all sevas from the database
const getAllSevas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sevas');
    console.log('Sevas fetched:', result.rows); // For debugging
    res.json(result.rows);
  } catch (error) {
    console.error(' Error fetching sevas:', error.message);
    res.status(500).json({ message: 'Server error while fetching sevas' });
  }
};

module.exports = {
  getAllSevas,
};
