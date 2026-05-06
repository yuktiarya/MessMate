const mongoose = require('mongoose');

// Simple schema for storing daily menu items
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    desc: { type: String }
});

const menuSchema = new mongoose.Schema({
    date: { type: String, required: true }, // e.g., "Monday" or "YYYY-MM-DD"
    breakfast: [menuItemSchema],
    lunch: [menuItemSchema],
    dinner: [menuItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
