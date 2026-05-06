const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getAnalytics);

module.exports = router;
