import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, X, FileText, MapPin, Calendar, User as UserIcon, ShieldCheck, AlertTriangle } from 'lucide-react';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('/api/admin/reports');
            setReports(res.data);
        } catch (err) {
            console.error('Error fetching reports', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setActionLoading(true);
        try {
            await axios.delete(`/api/admin/reports/${id}`);
            setReports(reports.filter(rep => rep._id !== id));
            setShowDeleteModal(false);
        } catch (err) {
            alert('Error deleting safety report');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredReports = reports.filter(rep => 
        rep.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bg-navy tracking-tight">Safety Reports</h1>
                    <p className="text-text-dim mt-1">Review and manage crowdsourced safety audits.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                        type="text"
                        placeholder="Search area or user..."
                        className="glass pl-12 pr-6 py-3 w-full md:w-80 focus:ring-2 focus:ring-primary/30 outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-bg-navy text-white text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Area & Score</th>
                                <th className="px-6 py-4 font-bold">Location Details</th>
                                <th className="px-6 py-4 font-bold">Submitted By</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="4" className="px-6 py-8"><div className="h-4 bg-black/5 rounded w-1/2"></div></td></tr>
                                ))
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map(rep => (
                                    <tr key={rep._id} className="hover:bg-primary/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <p className="font-bold text-bg-navy">{rep.areaName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${rep.calculatedSafetyScore > 70 ? 'bg-green-500' : rep.calculatedSafetyScore > 40 ? 'bg-orange-500' : 'bg-red-500'}`}>
                                                        {rep.calculatedSafetyScore}% SAFE
                                                    </div>
                                                    <span className="text-[10px] uppercase font-black opacity-50 flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(rep.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 text-text-dim max-w-xs">
                                                <MapPin size={16} className="shrink-0 mt-0.5" />
                                                <span className="text-xs font-medium leading-relaxed">{rep.location?.display_name || 'No detailed address'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-bg-navy text-xs font-bold">
                                                    {rep.userId?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-bg-navy">{rep.userId?.name || 'Deleted User'}</p>
                                                    <p className="text-[10px] text-text-dim">{rep.userId?.email || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedReport(rep); setShowDeleteModal(true); }}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" 
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-text-dim font-medium">No safety reports found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative w-full max-w-md glass bg-white p-8 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-bg-navy mb-2">Delete Safety Report?</h2>
                        <p className="text-text-dim mb-8 font-medium">
                            Are you sure you want to delete the audit for <span className="text-bg-navy font-bold">{selectedReport.areaName}</span>? This action is permanent.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all">Cancel</button>
                            <button 
                                onClick={() => handleDelete(selectedReport._id)} 
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

export default ReportManagement;
