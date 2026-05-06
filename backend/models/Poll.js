const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema],
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Keep track to prevent double voting
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
