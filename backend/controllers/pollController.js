const Poll = require('../models/Poll');

// @route   GET /api/polls
// @desc    Get all polls
exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/polls/vote
// @desc    Vote on a poll
exports.votePoll = async (req, res) => {
    try {
        const { pollId, optionId } = req.body;
        const userId = req.user.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user already voted
        if (poll.voters.includes(userId)) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        // Find option and increment vote
        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Option not found' });
        }

        option.votes += 1;
        poll.voters.push(userId); // Record that this user has voted
        
        await poll.save();

        res.json({ message: 'Vote recorded successfully', poll });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/polls (Optional/Admin)
// @desc    Create a new poll
exports.createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        // options should be an array of objects: [{ text: 'Paneer' }, { text: 'Chicken' }]
        
        const newPoll = new Poll({
            question,
            options
        });

        await newPoll.save();
        res.status(201).json({ message: 'Poll created', poll: newPoll });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
