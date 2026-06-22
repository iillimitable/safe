const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Incident = require('../models/Incident');

// Submit Incident
router.post('/', auth, async (req, res) => {
    try {
        const { type, description, date, time, state, city, location } = req.body;
        
        const newIncident = new Incident({
            userId: req.user.id,
            type,
            description,
            date,
            time,
            state,
            city,
            location: {
                type: 'Point',
                coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
            }
        });

        await newIncident.save();
        res.json(newIncident);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const mongoose = require('mongoose');

// Get incidents by user
router.get('/user', auth, async (req, res) => {
    try {
        const incidents = await Incident.find({ userId: new mongoose.Types.ObjectId(req.user.id) }).sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        console.error('Error in /api/incidents/user:', err.message);
        res.status(500).send('Server Error');
    }
});

// Get incidents by state, city or proximity
router.get('/', async (req, res) => {
    try {
        const { state, city, lat, lon, radius } = req.query;
        let query = {};
        if (state) query.state = state;
        if (city) query.city = city;

        if (lat && lon) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);
            const searchRadius = parseFloat(radius) || 10000; // Default 10km

            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: searchRadius
                }
            };

            // $near sorts by distance automatically
            const incidents = await Incident.find(query);
            return res.json(incidents);
        }

        const incidents = await Incident.find(query).sort({ date: -1, time: -1 });
        res.json(incidents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
