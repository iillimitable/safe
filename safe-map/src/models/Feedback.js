const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for anonymous
    name: { type: String, required: false }, // For anonymous or custom name
    email: { type: String, required: false }, // For guest users
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { 
        type: String, 
        required: true, 
        enum: ['App Issue', 'Safety Concern', 'Suggestion', 'Bug Report'] 
    },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
