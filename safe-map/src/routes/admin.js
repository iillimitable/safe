const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Incident = require('../models/Incident');
const Report = require('../models/Report');

// Apply admin middleware to all routes in this file
router.use(auth);
router.use(admin);

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalReports = await Report.countDocuments();
        const totalIncidents = await Incident.countDocuments();

        res.json({
            totalUsers,
            totalReports,
            totalIncidents
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users with activity counts
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        
        // Add activity counts for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const reportsCount = await Report.countDocuments({ userId: user._id });
            const incidentsCount = await Incident.countDocuments({ userId: user._id });
            return {
                ...user.toObject(),
                reportsCount,
                incidentsCount
            };
        }));

        res.json(usersWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users/:id/activity
// @desc    Get user activity (reports and incidents)
router.get('/users/:id/activity', async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.params.id }).sort({ createdAt: -1 });
        const incidents = await Incident.find({ userId: req.params.id }).sort({ createdAt: -1 });

        res.json({ reports, incidents });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/admin/users/:id/ban
// @desc    Toggle ban status
router.patch('/users/:id/ban', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban an admin user.' });
        }

        user.isBanned = !user.isBanned;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete an admin user.' });
        }

        await User.findByIdAndDelete(req.params.id);
        // Optionally delete all their reports and incidents? 
        // User didn't specify, but usually it's better to keep data or delete it.
        // I'll keep it for now as "deleted user" records or just leave it.
        // Actually, deleting records associated with the user might be safer.
        await Report.deleteMany({ userId: req.params.id });
        await Incident.deleteMany({ userId: req.params.id });

        res.json({ message: 'User and all associated data deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/incidents
// @desc    Get all incidents
router.get('/incidents', async (req, res) => {
    try {
        const incidents = await Incident.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/incidents/:id
// @desc    Delete incident
router.delete('/incidents/:id', async (req, res) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ message: 'Incident deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/reports
// @desc    Get all safety reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/reports/:id
// @desc    Delete safety report
router.delete('/reports/:id', async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Safety report deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
