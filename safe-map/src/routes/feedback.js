const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Feedback = require('../models/Feedback');
const rateLimit = require('express-rate-limit');

// Rate limiter for feedback submission: 5 submissions per 15 minutes per IP
const feedbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many feedback submissions, please try again later.' }
});

// @route   POST api/feedback
// @desc    Submit feedback (Public/User)
router.post('/', feedbackLimiter, async (req, res) => {
    try {
        const { rating, category, message, name, email } = req.body;
        
        let userId = null;
        const token = req.header('x-auth-token');
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.user.id;
            } catch (err) {
                // Ignore invalid token for submission, treat as anonymous
            }
        }

        const newFeedback = new Feedback({
            userId,
            rating,
            category,
            message,
            name: name || (userId ? undefined : 'Anonymous'),
            email: email || undefined
        });

        await newFeedback.save();
        res.json({ message: 'Thank you for your feedback', feedback: newFeedback });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/feedback
// @desc    Get all feedback (Admin)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/feedback/:id
// @desc    Update feedback status (Admin)
router.patch('/:id', [auth, admin], async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        feedback.status = req.body.status || 'Reviewed';
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/feedback/:id
// @desc    Delete feedback (Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
