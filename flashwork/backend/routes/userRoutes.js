const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
