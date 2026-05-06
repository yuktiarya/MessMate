const express = require('express');
const router = express.Router();
const { getPolls, votePoll, createPoll } = require('../controllers/pollController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getPolls);
router.post('/vote', checkAuth, votePoll);
router.post('/', checkAuth, createPoll); // Ideally admin only

module.exports = router;
