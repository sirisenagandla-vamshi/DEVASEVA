const express = require('express');
const router = express.Router();
const { getAllSevas } = require('../controllers/sevaController');

// GET all sevas
router.get('/', getAllSevas);

module.exports = router;
