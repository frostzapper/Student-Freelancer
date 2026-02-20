const express = require('express');
const router = express.Router();
const { enterPool, exitPool, getActivePool } = require('../controllers/poolController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/enter', authMiddleware, checkRole('worker'), enterPool);
router.post('/exit', authMiddleware, checkRole('worker'), exitPool);
router.get('/active', getActivePool);

module.exports = router;
