const express = require('express');
const router = express.Router();
const { topup, withdraw, getBalance } = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/topup', authMiddleware, topup);
router.post('/withdraw', authMiddleware, withdraw);
router.get('/balance', authMiddleware, getBalance);

module.exports = router;
