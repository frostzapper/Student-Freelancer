const express = require('express');
const router = express.Router();
const { getTrustFundBalance } = require('../controllers/platformController');

router.get('/trust-fund', getTrustFundBalance);

module.exports = router;
