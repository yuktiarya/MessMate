const express = require('express');
const router = express.Router();
const { getMenu, createMenu } = require('../controllers/menuController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getMenu);
router.post('/', checkAuth, createMenu); // Ideally admin only

module.exports = router;
