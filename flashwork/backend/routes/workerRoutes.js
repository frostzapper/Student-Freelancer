const express = require('express');
const router = express.Router();
const { getWorkerDashboard } = require('../controllers/workerController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/dashboard', authMiddleware, checkRole('worker'), getWorkerDashboard);

module.exports = router;
