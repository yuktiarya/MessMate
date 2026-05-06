const express = require('express');
const router = express.Router();
const { getAllFeedback, submitFeedback } = require('../controllers/feedbackController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getAllFeedback);
router.post('/', checkAuth, submitFeedback);

module.exports = router;
