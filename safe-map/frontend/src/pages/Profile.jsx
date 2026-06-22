import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, FileText, MapPin, AlertTriangle, Clock } from 'lucide-react';


const Profile = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get('/api/reports/user');
                setReports(res.data);
            } catch (err) {
                console.error('Error fetching reports', err);
            }
        };

        const fetchIncidents = async () => {
            try {
                const res = await axios.get('/api/incidents/user');
                setIncidents(res.data);
            } catch (err) {
                console.error('Error fetching incidents', err);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchReports(), fetchIncidents()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#84cc16';
        if (score >= 40) return '#f59e0b';
        if (score >= 20) return '#f97316';
        return '#ef4444';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* User Info Card */}
            <div className="lg:col-span-1 glass p-6 md:p-8 h-fit space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 border-2 border-primary/30 mx-auto flex items-center justify-center shadow-lg shadow-primary/10">
                        <User size={40} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-bg-navy">{user?.name || 'User'}</h2>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            Safe Map Contributor
                        </span>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-glass">
                    <div className="flex items-center gap-4 text-text-dim hover:text-white transition-colors">
                        <div className="p-2 rounded-lg bg-white/5">
                            <Mail size={18} />
                        </div>
                        <span className="text-sm font-medium break-all">{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-dim hover:text-white transition-colors">
                        <div className="p-2 rounded-lg bg-white/5">
                            <Calendar size={18} />
                        </div>
                        <span className="text-sm font-medium">Age: {user?.age || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-2 space-y-8">
                {/* Incidents List */}
                <div className="glass p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-bg-navy flex items-center gap-3">
                        <AlertTriangle size={24} className="text-red-500" /> My Incident Reports
                    </h3>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-text-dim">Loading incidents...</p>
                        </div>
                    ) : (incidents && incidents.length === 0) ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-glass">
                            <p className="text-text-dim">You haven't reported any incidents yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {incidents && incidents.map((incident) => (
                                <div key={incident._id} className="p-6 border border-glass rounded-2xl bg-black/5 hover:bg-black/[0.08] transition-all space-y-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-bg-navy flex items-center gap-2">
                                                <AlertTriangle size={16} className="text-red-500" /> {incident.type || 'Incident'}
                                            </h4>
                                            <p className="text-sm text-text-dim line-clamp-2">{incident.description || 'No description provided.'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-red-500/20">
                                                Incident
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-glass grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-xs text-text-dim">
                                            <MapPin size={14} className="text-primary" />
                                            <span>{incident.city || 'Unknown City'}, {incident.state || 'Unknown State'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-dim">
                                            <Calendar size={14} className="text-primary" />
                                            <span>{incident.date ? new Date(incident.date).toLocaleDateString() : 'Unknown Date'} {incident.time ? `at ${incident.time}` : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reports List */}
                <div className="glass p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-bg-navy flex items-center gap-3">
                        <FileText size={24} className="text-primary" /> My Safety Reports
                    </h3>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-text-dim">Loading your contributions...</p>
                        </div>
                    ) : (reports && reports.length === 0) ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-glass">
                            <p className="text-text-dim">You haven't submitted any safety reports yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {reports && reports.map((report) => (
                                <div key={report._id} className="flex flex-col sm:flex-row justify-between items-center p-6 border border-glass rounded-2xl bg-black/5 hover:bg-black/[0.08] transition-all group">
                                    <div className="space-y-2 mb-4 sm:mb-0">
                                        <h4 className="text-lg font-bold text-bg-navy flex items-center gap-2">
                                            <MapPin size={16} className="text-primary" /> {report.areaName || 'Unknown Area'}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-text-dim font-medium">
                                            <span className="bg-white/5 px-2 py-1 rounded-md">Pincode: {report.pincode || 'N/A'}</span>
                                            <span>•</span>
                                            <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date Unknown'}</span>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-3xl font-black transition-transform group-hover:scale-110" style={{ color: getScoreColor(report.calculatedSafetyScore) }}>
                                            {report.calculatedSafetyScore || 0}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-tighter text-text-dim">Safety Score</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

