require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import Models
const Menu = require('./models/Menu');
const Poll = require('./models/Poll');
const Feedback = require('./models/Feedback');

// Connect to MongoDB
connectDB();

const seedData = async () => {
    try {
        // Clear existing data (optional, remove if you want to keep old data)
        await Menu.deleteMany();
        await Poll.deleteMany();
        // await Feedback.deleteMany(); // Keeping feedback might be good, but uncomment to clear

        console.log('Inserting initial Menu data...');
        const newMenu = new Menu({
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            breakfast: [
                { name: "Aloo Paratha", rating: 4.5, desc: "Served with chai and pickle." },
                { name: "Poha", rating: 4.0, desc: "Light and healthy snack." }
            ],
            lunch: [
                { name: "Rajma Chawal", rating: 4.8, desc: "Classic North Indian comfort food." },
                { name: "Paneer Butter Masala", rating: 4.6, desc: "Served with Roti and rice." }
            ],
            dinner: [
                { name: "Dal Makhani", rating: 4.7, desc: "Slow-cooked creamy lentils." },
                { name: "Veg Biryani", rating: 4.9, desc: "Saturday special." }
            ]
        });
        await newMenu.save();

        console.log('Inserting initial Poll data...');
        const newPoll1 = new Poll({
            question: "What should be the Sunday Special Dinner?",
            options: [
                { text: "Butter Chicken / Shahi Paneer", votes: 45 },
                { text: "Chole Bhature", votes: 30 },
                { text: "Masala Dosa", votes: 15 },
                { text: "Veg Pulao & Manchurian", votes: 10 }
            ]
        });

        const newPoll2 = new Poll({
            question: "Which dessert do you prefer for Wednesday?",
            options: [
                { text: "Gulab Jamun", votes: 55 },
                { text: "Ice Cream", votes: 40 },
                { text: "Kheer", votes: 5 }
            ]
        });

        await newPoll1.save();
        await newPoll2.save();

        console.log('Database Seeding Completed Successfully! 🌱');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
