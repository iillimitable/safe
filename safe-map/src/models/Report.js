// src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    areaName: { type: String, required: true },
    normalizedAreaName: { type: String },
    pincode: { type: String }, // Made optional because Nominatim doesn't always have it
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }, // Default to [0,0] if not provided
        place_id: { type: Number },
        display_name: { type: String }
    },
    responses: { type: Object, required: true }, // store answers to 15 questions
    comments: { type: String },
    calculatedSafetyScore: { type: Number, min: 0, max: 100 },
    createdAt: { type: Date, default: Date.now }
});

reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema, 'reports');
