const express = require('express');
const router = express.Router();
const { getWorkerDashboard, getDailyAlert, getWorkerJobs } = require('../controllers/workerController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/dashboard', authMiddleware, checkRole('worker'), getWorkerDashboard);
router.get('/daily-alert', authMiddleware, checkRole('worker'), getDailyAlert);
router.get('/jobs', authMiddleware, getWorkerJobs);

module.exports = router;
