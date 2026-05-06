const Complaint = require('../models/Complaint');

// @route   GET /api/complaints
// @desc    Get all complaints
exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('userId', 'name roomNumber hostelBlock')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/complaints
// @desc    Submit a new complaint
exports.submitComplaint = async (req, res) => {
    try {
        const { title, description, category, anonymous } = req.body;
        
        const newComplaint = new Complaint({
            userId: anonymous ? null : req.user.id,
            title,
            description,
            category,
            anonymous
        });

        await newComplaint.save();
        res.status(201).json({ message: 'Complaint filed successfully', complaint: newComplaint });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   PUT /api/complaints/:id
// @desc    Update complaint status (e.g., to Resolved)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only admins should theoretically do this, but keeping it simple for the project
        complaint.status = status;
        await complaint.save();

        res.json({ message: 'Complaint updated', complaint });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
