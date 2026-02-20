const express = require('express');
const router = express.Router();
const { createSchedule, getSchedule, deleteSchedule } = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, checkRole('worker'), createSchedule);
router.get('/', authMiddleware, checkRole('worker'), getSchedule);
router.delete('/:id', authMiddleware, checkRole('worker'), deleteSchedule);

module.exports = router;
