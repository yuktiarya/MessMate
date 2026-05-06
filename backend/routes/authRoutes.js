const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../controllers/authController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Make checkAuth compatible with our simplified localStorage token/session
router.get('/me', getCurrentUser);

module.exports = router;
