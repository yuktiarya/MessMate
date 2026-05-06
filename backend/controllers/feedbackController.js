const Feedback = require('../models/Feedback');

// @route   GET /api/feedback
// @desc    Get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name hostelBlock roomNumber').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/feedback
// @desc    Submit new feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { mealType, tasteRating, hygieneRating, quantityRating, mood, comment } = req.body;
        
        // userId comes from authMiddleware
        const userId = req.user.id;

        const newFeedback = new Feedback({
            userId,
            mealType,
            tasteRating,
            hygieneRating,
            quantityRating,
            mood,
            comment
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
