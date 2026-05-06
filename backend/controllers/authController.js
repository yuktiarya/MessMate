const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Register a new student
exports.registerUser = async (req, res) => {
    try {
        const { name, email, hostelBlock, roomNumber, password } = req.body;

        // Simple validation
        if (!name || !email || !hostelBlock || !roomNumber || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            hostelBlock,
            roomNumber,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'Registration successful. Please log in.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/auth/login
// @desc    Login user & create session
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Save user to session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            hostelBlock: user.hostelBlock,
            roomNumber: user.roomNumber
        };

        res.json({ message: 'Logged in successfully', user: req.session.user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/auth/logout
// @desc    Logout user & clear session
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: 'Logged out successfully' });
    });
};

// @route   GET /api/auth/me
// @desc    Get current logged in user data
exports.getCurrentUser = (req, res) => {
    if (req.session && req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};
