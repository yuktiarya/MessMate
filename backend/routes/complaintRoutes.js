const express = require('express');
const router = express.Router();
const { getComplaints, submitComplaint, updateComplaintStatus } = require('../controllers/complaintController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getComplaints);
router.post('/', checkAuth, submitComplaint);
router.put('/:id', checkAuth, updateComplaintStatus);

module.exports = router;
