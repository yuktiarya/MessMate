const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if anonymous
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    anonymous: { type: Boolean, default: false },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Resolved'] }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
