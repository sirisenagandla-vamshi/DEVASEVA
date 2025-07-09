const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

const sevaRoutes = require('./routes/sevaRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sevas', sevaRoutes);
app.use('/users', userRoutes);

// DB Connection Check
pool.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to PostgreSQL:', err);
  });
