import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Star, Send, CheckCircle, MessageSquare, ShieldAlert, Lightbulb, Bug, User, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        rating: 0,
        category: '',
        message: '',
        name: '',
        email: ''
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { id: 'App Issue', icon: <MessageSquare size={18} />, label: 'App Issue' },
        { id: 'Safety Concern', icon: <ShieldAlert size={18} />, label: 'Safety Concern' },
        { id: 'Suggestion', icon: <Lightbulb size={18} />, label: 'Suggestion' },
        { id: 'Bug Report', icon: <Bug size={18} />, label: 'Bug Report' }
    ];

    const handleRatingClick = (val) => {
        setFormData(prev => ({ ...prev, rating: val }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            setError('Please provide a star rating.');
            return;
        }
        if (!formData.category) {
            setError('Please select a category.');
            return;
        }
        if (!formData.message.trim()) {
            setError('Please enter your feedback message.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/feedback', formData);
            setSubmitted(true);
        } catch (err) {
            console.error('Feedback submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <div className="glass p-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-bg-navy">Thank You!</h1>
                    <p className="text-text-dim text-lg max-w-md">
                        Your feedback has been received. We appreciate your contribution to making Safe Map better for everyone.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="btn-primary mt-4"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="glass p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-bg-navy mb-2">Share Your Feedback</h1>
                    <p className="text-text-dim">Help us improve your safety experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <label className="text-lg font-semibold text-text-main">How would you rate your experience?</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`p-2 transition-all duration-200 transform hover:scale-125 ${
                                        (hoverRating || formData.rating) >= star 
                                            ? 'text-yellow-400 fill-yellow-400' 
                                            : 'text-gray-300'
                                    }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRatingClick(star)}
                                >
                                    <Star size={40} strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                        {formData.rating > 0 && (
                            <span className="text-sm font-medium text-primary">
                                {['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][formData.rating - 1]}
                            </span>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-text-main ml-1">Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                        formData.category === cat.id
                                            ? 'bg-primary border-primary text-white shadow-lg'
                                            : 'bg-white/40 border-glass text-text-dim hover:border-primary/50'
                                    }`}
                                >
                                    {cat.icon}
                                    <span className="font-medium text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Guest Info (Optional if not logged in) */}
                    {!user && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main ml-1">Name (Optional)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-main ml-1">Email (Optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main ml-1">Feedback Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="5"
                            className="input-field resize-none"
                            placeholder="Tell us what you think..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Send Feedback'}
                        {!loading && <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
