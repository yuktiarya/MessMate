const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, required: true },
    tasteRating: { type: Number, required: true },
    hygieneRating: { type: Number },
    quantityRating: { type: Number },
    mood: { type: String, required: true },
    comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
