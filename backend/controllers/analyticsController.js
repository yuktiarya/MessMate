const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @route   GET /api/analytics
// @desc    Get analytics data for charts
exports.getAnalytics = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        const complaints = await Complaint.find();

        // Calculate average ratings (dummy simple logic for demonstration)
        let totalRating = 0;
        feedbacks.forEach(fb => totalRating += fb.tasteRating);
        const avgRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

        // Mood counts
        const moodCounts = {
            loved: feedbacks.filter(f => f.mood === 'Loved it').length,
            good: feedbacks.filter(f => f.mood === 'Good').length,
            average: feedbacks.filter(f => f.mood === 'Average').length,
            bad: feedbacks.filter(f => f.mood === 'Bad').length
        };

        // Complaint Category Counts
        const categoryCounts = {
            hygiene: complaints.filter(c => c.category === 'Hygiene').length,
            quality: complaints.filter(c => c.category === 'Food Quality').length,
            quantity: complaints.filter(c => c.category === 'Quantity').length,
            late: complaints.filter(c => c.category === 'Late Serving').length,
            staff: complaints.filter(c => c.category === 'Staff Behaviour').length
        };

        res.json({
            totalFeedbacks: feedbacks.length,
            totalComplaints: complaints.length,
            pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
            avgRating,
            moodCounts,
            categoryCounts
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
