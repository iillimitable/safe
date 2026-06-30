import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, User as UserIcon, Shield, AlertTriangle, FileText,
    Ban, Trash2, Calendar, Clock, MapPin, CheckCircle2, XCircle,
    Activity, TrendingUp, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const safeScoreColor = (score) => {
    if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50 border-emerald-200' };
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50 border-amber-200' };
    return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50 border-red-200' };
};

const fmt = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color = 'text-primary', bg = 'bg-primary/10' }) => (
    <div className="glass p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={color} size={22} />
        </div>
        <div>
            <p className="text-2xl font-black text-bg-navy">{value}</p>
            <p className="text-xs font-bold text-text-dim uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

const SectionToggle = ({ title, icon: Icon, count, color, children }) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="glass overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon className={color} size={20} />
                    <h3 className="font-black text-bg-navy text-lg">{title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${color} bg-black/5`}>{count}</span>
                </div>
                {open ? <ChevronUp size={18} className="text-text-dim" /> : <ChevronDown size={18} className="text-text-dim" />}
            </button>
            {open && <div className="px-6 pb-6">{children}</div>}
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [activity, setActivity] = useState({ reports: [], incidents: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null); // 'ban' | 'delete'

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [userRes, activityRes] = await Promise.all([
                axios.get(`/api/admin/users/${id}`),
                axios.get(`/api/admin/users/${id}/activity`)
            ]);
            setUser(userRes.data);
            setActivity(activityRes.data);
        } catch (err) {
            console.error('Error loading user detail', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleBan = async () => {
        setActionLoading(true);
        try {
            await axios.patch(`/api/admin/users/${id}/ban`);
            setUser(u => ({ ...u, isBanned: !u.isBanned }));
            setConfirmModal(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await axios.delete(`/api/admin/users/${id}`);
            setConfirmModal(null);
            navigate('/admin/users');
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Loading State ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-8 w-48 bg-black/5 rounded-xl" />
                <div className="glass p-8 h-48 bg-black/5 rounded-2xl" />
                <div className="grid grid-cols-3 gap-4">
                    {[0,1,2].map(i => <div key={i} className="glass h-24 bg-black/5 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-24 text-text-dim font-medium">
                User not found.
                <button onClick={() => navigate('/admin/users')} className="block mx-auto mt-4 btn-primary">← Back</button>
            </div>
        );
    }

    const isSpamRisk = user.recentReports >= 5 || user.recentIncidents >= 5;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="flex flex-col gap-6">
            {/* ── Back Button ──────────────────────────────────────── */}
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 text-text-dim hover:text-bg-navy font-bold transition-colors w-fit group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Users
            </button>

            {/* ── Profile Header ────────────────────────────────────── */}
            <div className="glass p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black flex-shrink-0 shadow-inner">
                            {initials}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black text-bg-navy tracking-tight">{user.name}</h1>
                                {user.isBanned && (
                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black rounded-full uppercase tracking-tighter">Banned</span>
                                )}
                                {user.role === 'admin' && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-black rounded-full uppercase tracking-tighter">Admin</span>
                                )}
                                {!user.isBanned && user.role !== 'admin' && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-black rounded-full uppercase tracking-tighter">Active</span>
                                )}
                            </div>
                            <p className="text-text-dim font-medium">{user.email}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-dim font-medium">
                                <span className="flex items-center gap-1"><UserIcon size={14} /> {user.gender}, {user.age} yrs</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {fmt(user.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {user.role !== 'admin' && (
                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => setConfirmModal('ban')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                    user.isBanned
                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                }`}
                            >
                                <Ban size={16} />
                                {user.isBanned ? 'Unban User' : 'Ban User'}
                            </button>
                            <button
                                onClick={() => setConfirmModal('delete')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                            >
                                <Trash2 size={16} />
                                Delete User
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Spam / Abuse Alert ────────────────────────────────── */}
            {isSpamRisk && (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 border border-red-200 animate-in fade-in duration-300">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="text-red-600" size={22} />
                    </div>
                    <div>
                        <p className="font-black text-red-700 mb-1">⚠️ Potential Spam / Abuse Detected</p>
                        <p className="text-sm text-red-600 font-medium">
                            This user submitted&nbsp;
                            {user.recentIncidents >= 5 && <strong>{user.recentIncidents} incidents</strong>}
                            {user.recentIncidents >= 5 && user.recentReports >= 5 && ' and '}
                            {user.recentReports >= 5 && <strong>{user.recentReports} safety reports</strong>}
                            &nbsp;in the last 7 days. Review their activity carefully before taking action.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Stats Row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={AlertTriangle} label="Total Incidents" value={user.incidentsCount} color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={FileText} label="Total Reports" value={user.reportsCount} color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={Activity} label="Incidents (7 days)" value={user.recentIncidents} color={user.recentIncidents >= 5 ? "text-red-600" : "text-emerald-600"} bg={user.recentIncidents >= 5 ? "bg-red-50" : "bg-emerald-50"} />
                <StatCard icon={TrendingUp} label="Reports (7 days)" value={user.recentReports} color={user.recentReports >= 5 ? "text-red-600" : "text-emerald-600"} bg={user.recentReports >= 5 ? "bg-red-50" : "bg-emerald-50"} />
            </div>

            {/* ── Incident Report History ───────────────────────────── */}
            <SectionToggle title="Incident Report History" icon={AlertTriangle} count={activity.incidents.length} color="text-amber-600">
                {activity.incidents.length === 0 ? (
                    <p className="text-text-dim italic text-sm py-4">No incidents posted by this user.</p>
                ) : (
                    <div className="flex flex-col gap-3 mt-2">
                        {activity.incidents.map(inc => (
                            <div key={inc._id} className="p-5 rounded-xl border border-black/5 bg-amber-50/60 hover:bg-amber-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                    <div>
                                        <span className="font-black text-bg-navy text-base">{inc.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-text-dim flex-shrink-0">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} /> {fmt(inc.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} /> {fmtTime(inc.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-text-dim leading-relaxed mb-3 line-clamp-2">{inc.description}</p>
                                <div className="flex flex-wrap gap-3 text-xs font-bold">
                                    <span className="flex items-center gap-1 text-primary">
                                        <MapPin size={12} /> {inc.city}, {inc.state}
                                    </span>
                                    <span className="flex items-center gap-1 text-text-dim">
                                        <Clock size={12} /> Incident on {inc.date} at {inc.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SectionToggle>

            {/* ── Safety Report (Audit) History ─────────────────────── */}
            <SectionToggle title="Safety Report History" icon={Shield} count={activity.reports.length} color="text-blue-600">
                {activity.reports.length === 0 ? (
                    <p className="text-text-dim italic text-sm py-4">No safety reports submitted by this user.</p>
                ) : (
                    <div className="flex flex-col gap-3 mt-2">
                        {activity.reports.map(rep => {
                            const sc = safeScoreColor(rep.calculatedSafetyScore);
                            return (
                                <div key={rep._id} className={`p-5 rounded-xl border ${sc.light} transition-colors`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="font-black text-bg-navy text-base mb-1">{rep.areaName}</p>
                                            {rep.comments && (
                                                <p className="text-sm text-text-dim line-clamp-2 mb-2">{rep.comments}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs font-bold text-text-dim">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={11} /> {fmt(rep.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} /> {fmtTime(rep.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                            <div className={`w-16 h-16 rounded-2xl ${sc.bg} flex items-center justify-center shadow-md`}>
                                                <span className="text-white font-black text-lg">{rep.calculatedSafetyScore}</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${sc.text}`}>Safety Score</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </SectionToggle>

            {/* ── Confirm Modal ─────────────────────────────────────── */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-bg-navy/60 backdrop-blur-sm"
                        onClick={() => !actionLoading && setConfirmModal(null)}
                    />
                    <div className="relative w-full max-w-md glass bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        {confirmModal === 'delete' && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <Trash2 size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-bg-navy mb-2">Permanently Delete User?</h2>
                                <p className="text-text-dim mb-8 font-medium">
                                    Are you sure you want to delete <span className="text-bg-navy font-bold">{user.name}</span>?
                                    This action cannot be undone and will remove all their data.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmModal(null)}
                                        disabled={actionLoading}
                                        className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={actionLoading}
                                        className="flex-1 btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {confirmModal === 'ban' && (
                            <div className="text-center">
                                <div className={`w-16 h-16 ${user.isBanned ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mx-auto mb-5`}>
                                    <Ban size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-bg-navy mb-2">
                                    {user.isBanned ? 'Unban User?' : 'Ban User?'}
                                </h2>
                                <p className="text-text-dim mb-8 font-medium">
                                    {user.isBanned
                                        ? `Restore access for ${user.name}? They will be able to log in and participate again.`
                                        : `Restrict access for ${user.name}? They will be immediately logged out and unable to use the platform.`
                                    }
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmModal(null)}
                                        disabled={actionLoading}
                                        className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBan}
                                        disabled={actionLoading}
                                        className={`flex-1 btn-primary disabled:opacity-50 ${user.isBanned ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                                    >
                                        {actionLoading ? 'Processing...' : (user.isBanned ? 'Yes, Unban' : 'Yes, Ban')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetail;
