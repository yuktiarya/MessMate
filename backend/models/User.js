const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hostelBlock: { type: String, required: true },
    roomNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student', enum: ['student', 'admin'] }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
