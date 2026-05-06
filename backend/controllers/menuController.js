const Menu = require('../models/Menu');

// @route   GET /api/menu
// @desc    Get the latest menu (or today's menu)
exports.getMenu = async (req, res) => {
    try {
        // Just get the most recently added menu for simplicity
        const menu = await Menu.findOne().sort({ createdAt: -1 });
        
        if (!menu) {
            // Return empty structure if no menu exists
            return res.json({
                breakfast: [],
                lunch: [],
                dinner: []
            });
        }
        
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/menu
// @desc    Create or update menu
exports.createMenu = async (req, res) => {
    try {
        const { date, breakfast, lunch, dinner } = req.body;
        
        const newMenu = new Menu({
            date,
            breakfast,
            lunch,
            dinner
        });

        await newMenu.save();
        res.status(201).json({ message: 'Menu created', menu: newMenu });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
