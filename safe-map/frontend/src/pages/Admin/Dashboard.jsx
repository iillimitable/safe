import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, FileText } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalReports: 0, totalIncidents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="animate-pulse flex flex-col gap-4">
        <div className="h-32 bg-white/20 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-white/20 rounded-2xl"></div>
            <div className="h-40 bg-white/20 rounded-2xl"></div>
            <div className="h-40 bg-white/20 rounded-2xl"></div>
        </div>
    </div>;

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'from-blue-500 to-blue-600' },
        { title: 'Total Incidents', value: stats.totalIncidents, icon: <AlertTriangle size={24} />, color: 'from-orange-500 to-orange-600' },
        { title: 'Safety Reports', value: stats.totalReports, icon: <FileText size={24} />, color: 'from-green-500 to-green-600' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-black text-bg-navy tracking-tight">System Overview</h1>
                <p className="text-text-dim mt-1">Real-time statistics for the Safe Map platform.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="relative overflow-hidden group">
                        <div className="glass p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                                {card.icon}
                            </div>
                            <div className="mt-4">
                                <p className="text-text-dim text-sm font-bold uppercase tracking-wider">{card.title}</p>
                                <p className="text-4xl font-black text-bg-navy mt-1">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
