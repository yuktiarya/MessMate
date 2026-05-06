const checkAuth = (req, res, next) => {
    // Parse the Bearer token sent from the frontend
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        req.user = { id: token }; // Set req.user to match the ID
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};

module.exports = { checkAuth };
