import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, X, AlertTriangle, MapPin, Calendar, Clock, User as UserIcon, Filter } from 'lucide-react';

const IncidentManagement = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await axios.get('/api/admin/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error('Error fetching incidents', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setActionLoading(true);
        try {
            await axios.delete(`/api/admin/incidents/${id}`);
            setIncidents(incidents.filter(inc => inc._id !== id));
            setShowDeleteModal(false);
        } catch (err) {
            alert('Error deleting incident');
        } finally {
            setActionLoading(false);
        }
    };

    const incidentTypes = ['All', ...new Set(incidents.map(inc => inc.type))];

    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = inc.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inc.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || inc.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bg-navy tracking-tight">Incident Management</h1>
                    <p className="text-text-dim mt-1">Review and manage reported public safety incidents.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                        <select
                            className="glass pl-12 pr-10 py-3 w-full sm:w-48 appearance-none focus:ring-2 focus:ring-primary/30 outline-none font-bold text-bg-navy"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                        <input
                            type="text"
                            placeholder="Search incidents..."
                            className="glass pl-12 pr-6 py-3 w-full md:w-64 focus:ring-2 focus:ring-primary/30 outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-bg-navy text-white text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Type & Description</th>
                                <th className="px-6 py-4 font-bold">Location</th>
                                <th className="px-6 py-4 font-bold">Submitted By</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="4" className="px-6 py-8"><div className="h-4 bg-black/5 rounded w-1/2"></div></td></tr>
                                ))
                            ) : filteredIncidents.length > 0 ? (
                                filteredIncidents.map(inc => (
                                    <tr key={inc._id} className="hover:bg-primary/5 transition-colors duration-200">
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase w-fit mb-1">{inc.type}</span>
                                                <p className="font-bold text-bg-navy line-clamp-2">{inc.description}</p>
                                                <div className="flex items-center gap-3 text-[10px] text-text-dim font-black uppercase tracking-tighter mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {inc.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {inc.time}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-primary font-bold text-sm capitalize">
                                                <MapPin size={16} className="shrink-0" />
                                                <span>{inc.city}, {inc.state}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-bg-navy text-xs font-bold">
                                                    {inc.userId?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-bg-navy">{inc.userId?.name || 'Deleted User'}</p>
                                                    <p className="text-[10px] text-text-dim">{inc.userId?.email || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedIncident(inc); setShowDeleteModal(true); }}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" 
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-text-dim font-medium">No incidents found matching your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedIncident && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative w-full max-w-md glass bg-white p-8 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-bg-navy mb-2">Delete Incident?</h2>
                        <p className="text-text-dim mb-8 font-medium">
                            Are you sure you want to delete this <span className="text-primary font-bold">{selectedIncident.type}</span> report? This action is permanent.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all">Cancel</button>
                            <button 
                                onClick={() => handleDelete(selectedIncident._id)} 
                                disabled={actionLoading}
                                className="flex-1 btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentManagement;
