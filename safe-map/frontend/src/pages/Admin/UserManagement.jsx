import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Ban, Trash2, Eye, X, User as UserIcon, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [activity, setActivity] = useState({ reports: [], incidents: [] });
    const [modalMode, setModalMode] = useState(null); // 'activity' or 'delete' or 'ban'
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivity = async (id) => {
        try {
            const res = await axios.get(`/api/admin/users/${id}/activity`);
            setActivity(res.data);
            setModalMode('activity');
        } catch (err) {
            console.error('Error fetching activity', err);
        }
    };

    const handleBan = async (id) => {
        setActionLoading(true);
        try {
            await axios.patch(`/api/admin/users/${id}/ban`);
            setUsers(users.map(u => u._id === id ? { ...u, isBanned: !u.isBanned } : u));
            setModalMode(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setActionLoading(true);
        try {
            await axios.delete(`/api/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            setModalMode(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting user');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bg-navy tracking-tight">User Management</h1>
                    <p className="text-text-dim mt-1">Manage platform participants and their access.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="glass pl-12 pr-6 py-3 w-full md:w-80 focus:ring-2 focus:ring-primary/30 outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-navy text-white text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Activity</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-8">
                                            <div className="h-4 bg-black/5 rounded w-1/2"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-primary/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-bg-navy">{user.name}</p>
                                                    <p className="text-xs text-text-dim">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isBanned ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black rounded-full uppercase tracking-tighter">Banned</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-black rounded-full uppercase tracking-tighter">Active</span>
                                            )}
                                            {user.role === 'admin' && (
                                                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-black rounded-full uppercase tracking-tighter">Admin</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4 text-xs font-bold text-text-dim">
                                                <span className="flex items-center gap-1"><AlertTriangle size={12} /> {user.incidentsCount}</span>
                                                <span className="flex items-center gap-1"><FileText size={12} /> {user.reportsCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => { setSelectedUser(user); fetchActivity(user._id); }}
                                                    className="p-2 hover:bg-bg-navy hover:text-white rounded-lg transition-all" 
                                                    title="View Activity"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button 
                                                            onClick={() => { setSelectedUser(user); setModalMode('ban'); }}
                                                            className={`p-2 rounded-lg transition-all ${user.isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                                            title={user.isBanned ? "Unban" : "Ban"}
                                                        >
                                                            <Ban size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setSelectedUser(user); setModalMode('delete'); }}
                                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" 
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-text-dim font-medium">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedUser && modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalMode(null)}></div>
                    <div className={`relative w-full ${modalMode === 'activity' ? 'max-w-4xl' : 'max-w-md'} glass bg-white p-8 animate-in zoom-in-95 duration-300 shadow-2xl`}>
                        <button onClick={() => setModalMode(null)} className="absolute right-6 top-6 p-2 hover:bg-black/5 rounded-full transition-all">
                            <X size={20} />
                        </button>

                        {modalMode === 'activity' && (
                            <div className="flex flex-col gap-6">
                                <header className="flex items-center gap-4 border-b border-black/5 pb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-bg-navy tracking-tight">{selectedUser.name}</h2>
                                        <p className="text-text-dim">{selectedUser.email}</p>
                                    </div>
                                </header>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <section>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
                                            <AlertTriangle size={16} /> Incidents Posted
                                        </h3>
                                        {activity.incidents.length > 0 ? (
                                            <div className="flex flex-col gap-3">
                                                {activity.incidents.map(inc => (
                                                    <div key={inc._id} className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-bg-navy">{inc.type}</span>
                                                            <span className="text-[10px] uppercase font-black opacity-50">{new Date(inc.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-text-dim line-clamp-2">{inc.description}</p>
                                                        <p className="text-[11px] font-bold text-primary mt-2 flex items-center gap-1 capitalize">
                                                            📍 {inc.city}, {inc.state}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-text-dim italic">No incidents posted yet.</p>}
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2 mb-4">
                                            <FileText size={16} /> Safety Audits
                                        </h3>
                                        {activity.reports.length > 0 ? (
                                            <div className="flex flex-col gap-3">
                                                {activity.reports.map(rep => (
                                                    <div key={rep._id} className="p-4 bg-green-50 rounded-xl border border-green-100">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-bg-navy">{rep.areaName}</span>
                                                            <span className="text-[10px] uppercase font-black opacity-50">{new Date(rep.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${rep.calculatedSafetyScore > 70 ? 'bg-green-500' : rep.calculatedSafetyScore > 40 ? 'bg-orange-500' : 'bg-red-500'}`}>
                                                                {rep.calculatedSafetyScore}% SAFE
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-text-dim italic">No safety audits submitted yet.</p>}
                                    </section>
                                </div>
                            </div>
                        )}

                        {modalMode === 'delete' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-bg-navy mb-2">Permanently Delete User?</h2>
                                <p className="text-text-dim mb-8 font-medium">
                                    Are you sure you want to delete <span className="text-bg-navy font-bold">{selectedUser.name}</span>? 
                                    This action cannot be undone and will remove all their incidents and reports.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setModalMode(null)} className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all">Cancel</button>
                                    <button 
                                        onClick={() => handleDelete(selectedUser._id)} 
                                        disabled={actionLoading}
                                        className="flex-1 btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalMode === 'ban' && (
                            <div className="text-center py-4">
                                <div className={`w-16 h-16 ${selectedUser.isBanned ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <Ban size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-bg-navy mb-2">
                                    {selectedUser.isBanned ? 'Unban User?' : 'Ban User?'}
                                </h2>
                                <p className="text-text-dim mb-8 font-medium">
                                    {selectedUser.isBanned 
                                        ? `Restore access for ${selectedUser.name}? They will be able to log in and participate again.`
                                        : `Restrict access for ${selectedUser.name}? They will be immediately logged out and unable to log in or register again with this email.`
                                    }
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setModalMode(null)} className="flex-1 px-6 py-3 rounded-xl border border-black/10 font-bold hover:bg-black/5 transition-all">Cancel</button>
                                    <button 
                                        onClick={() => handleBan(selectedUser._id)} 
                                        disabled={actionLoading}
                                        className={`flex-1 btn-primary disabled:opacity-50 ${selectedUser.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                                    >
                                        {actionLoading ? 'Processing...' : (selectedUser.isBanned ? 'Yes, Unban' : 'Yes, Ban')}
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

export default UserManagement;
