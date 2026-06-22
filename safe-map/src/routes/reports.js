const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const { calculateSafetyScore } = require('../utils/scoring');

// Helper to normalize area name for consistent searching (lowercase, alphanumeric only)
const normalizeAreaName = (name) => {
    return name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
};

// Submit Report
router.post('/', auth, async (req, res) => {
    try {
        const { areaName, pincode, location, responses, comments } = req.body;
        const score = calculateSafetyScore(responses);

        const newReport = new Report({
            userId: req.user.id,
            areaName,
            normalizedAreaName: normalizeAreaName(areaName),
            pincode,
            location: {
                type: 'Point',
                coordinates: location ? [parseFloat(location.lon), parseFloat(location.lat)] : [0, 0],
                place_id: location ? parseInt(location.place_id) : 0,
                display_name: location ? location.display_name : areaName
            },
            responses,
            comments: comments || '',
            calculatedSafetyScore: score
        });

        await newReport.save();
        res.json(newReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ... other routes ...

// Get reports by area name and/or pincode
router.get('/search', async (req, res) => {
    try {
        const { areaName, pincode } = req.query;
        let query = {};
        
        if (areaName) {
            const cleanSearch = normalizeAreaName(areaName);
            
            if (cleanSearch.length > 0) {
                // Perfect, fast match on the pre-cleaned field
                query.normalizedAreaName = { $regex: cleanSearch, $options: 'i' };
            } else {
                // If search is only special characters, fall back to literal match on display name
                query.areaName = { $regex: areaName, $options: 'i' };
            }
        }
        
        // Also handle the case where "I.T. Park" should match "IT Park" for the dot.
        // We can add a more aggressive normalization if needed, 
        // but $replaceAll only takes a string, not a regex.
        // For now, space normalization is the most common request.
        
        if (pincode) {
            query.pincode = pincode;
        }

        if (!areaName && !pincode) {
            return res.status(400).json({ msg: 'Please provide area name or pincode' });
        }

        const reports = await Report.find(query).populate('userId', 'gender');
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get reports by location with 1km radius aggregation (Legacy/Map support)
router.get('/location/:placeId', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            // Fallback to place_id if coords are missing (legacy support)
            const reports = await Report.find({ 'location.place_id': parseInt(req.params.placeId) }).populate('userId', 'gender');
            return res.json(reports);
        }

        // Proximity search: 1km radius
        // 1km is approx 1/6371 radians or 0.000156 radians
        const reports = await Report.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
                    $maxDistance: 1000 // 1000 meters = 1km
                }
            }
        }).populate('userId', 'gender');

        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get reports by user
router.get('/user', auth, async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
