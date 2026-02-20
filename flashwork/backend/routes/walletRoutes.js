const express = require('express');
const router = express.Router();
const { topup, withdraw, getBalance, getTransactions } = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/topup', authMiddleware, topup);
router.post('/withdraw', authMiddleware, withdraw);
router.get('/balance', authMiddleware, getBalance);
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;
