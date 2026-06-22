import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, CheckCircle, MessageSquare, Star, Calendar, User as UserIcon, AlertCircle, Clock } from 'lucide-react';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get('/api/feedback');
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Error fetching feedback', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id) => {
        setActionLoading(id);
        try {
            await axios.patch(`/api/feedback/${id}`, { status: 'Reviewed' });
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: 'Reviewed' } : f));
        } catch (err) {
            alert('Error updating feedback status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        
        setActionLoading(id);
        try {
            await axios.delete(`/api/feedback/${id}`);
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch (err) {
            alert('Error deleting feedback');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => 
        f.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.userId?.name && f.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        fill={i < rating ? 'currentColor' : 'none'} 
                        className={i < rating ? '' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bg-navy tracking-tight">User Feedback</h1>
                    <p className="text-text-dim mt-1">Monitor and respond to platform feedback.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="glass pl-12 pr-6 py-3 w-full md:w-80 focus:ring-2 focus:ring-primary/30 outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="glass overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-bg-navy text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Feedback & Rating</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold">User Information</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-black/5 rounded w-1/2"></div></td>
                                    </tr>
                                ))
                            ) : filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map(f => {
                                    const isCritical = f.rating <= 2;
                                    return (
                                        <tr 
                                            key={f._id} 
                                            className={`transition-colors duration-200 ${
                                                isCritical ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-primary/5'
                                            }`}
                                        >
                                            <td className="px-6 py-4 max-w-sm">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(f.rating)}
                                                        {isCritical && (
                                                            <span className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase">
                                                                <AlertCircle size={12} /> Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-bg-navy leading-relaxed line-clamp-3">
                                                        "{f.message}"
                                                    </p>
                                                    <span className="text-[10px] uppercase font-black opacity-40 flex items-center gap-1">
                                                        <Clock size={12} /> {new Date(f.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                                    f.category === 'Bug Report' ? 'bg-orange-100 text-orange-700' :
                                                    f.category === 'Safety Concern' ? 'bg-red-100 text-red-700' :
                                                    f.category === 'Suggestion' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {f.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-bg-navy text-xs font-bold">
                                                        {(f.userId?.name || f.name || 'A').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-bg-navy">{f.userId?.name || f.name || 'Anonymous'}</p>
                                                        <p className="text-[10px] text-text-dim">{f.userId?.email || f.email || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-1.5 text-xs font-bold ${f.status === 'Reviewed' ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {f.status === 'Reviewed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                    {f.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {f.status === 'Pending' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(f._id)}
                                                            disabled={actionLoading === f._id}
                                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-all" 
                                                            title="Mark as Reviewed"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(f._id)}
                                                        disabled={actionLoading === f._id}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" 
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-text-dim font-medium">No feedback found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeedbackManagement;
