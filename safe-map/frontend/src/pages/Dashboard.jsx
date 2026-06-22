import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, TrendingUp, AlertCircle, Clock, ShieldCheck, Hash, User } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
// Manual search by Area Name and Pincode

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale);

const Dashboard = () => {
    const [searchParams, setSearchParams] = useState({ areaName: '', pincode: '' });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchParams.areaName && !searchParams.pincode) {
            setError('Please enter an area name or pincode to search.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('/api/reports/search', {
                params: {
                    areaName: searchParams.areaName,
                    pincode: searchParams.pincode
                }
            });
            if (res.data.length === 0) {
                setError(`No reports found for matching search criteria.`);
                setData(null);
            } else {
                processData(res.data);
            }
        } catch (err) {
            console.error('Dashboard Search Error:', err);
            setError('Unable to fetch area data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const processData = (reports) => {
        const count = reports.length;
        const avgScore = reports.reduce((acc, r) => acc + r.calculatedSafetyScore, 0) / count;

        const daySafety = reports.reduce((acc, r) => acc + parseInt(r.responses?.q10 || 0), 0) / count;
        const nightSafety = reports.reduce((acc, r) => acc + parseInt(r.responses?.q11 || 0), 0) / count;

        const issues = reports.reduce((acc, r) => {
            const rawIssues = r.responses?.q14;
            const issueList = Array.isArray(rawIssues) ? rawIssues : (rawIssues ? [rawIssues] : ['None']);
            
            issueList.forEach(issue => {
                acc[issue] = (acc[issue] || 0) + 1;
            });
            return acc;
        }, {});

        const categories = {
            'Overall': reports.reduce((acc, r) => acc + parseInt(r.responses?.q1 || 0), 0) / count,
            'Lighting': reports.reduce((acc, r) => acc + parseInt(r.responses?.q4 || 0), 0) / count,
            'CCTV': reports.reduce((acc, r) => acc + parseInt(r.responses?.q6 || 0), 0) / count,
            'Police': reports.reduce((acc, r) => acc + parseInt(r.responses?.q8 || 0), 0) / count,
            'Women Safety': reports.reduce((acc, r) => acc + parseInt(r.responses?.q12 || 0), 0) / count,
        };

        // Gender Distribution
        const genderCounts = reports.reduce((acc, r) => {
            const gender = r.userId?.gender || 'Unknown';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, { Male: 0, Female: 0, Other: 0 });

        const genderPercentages = {
            Male: ((genderCounts.Male / count) * 100).toFixed(1),
            Female: ((genderCounts.Female / count) * 100).toFixed(1),
            Other: ((genderCounts.Other / count) * 100).toFixed(1),
        };

        // Descriptions/Comments with Gender
        const descriptions = reports
            .filter(r => r.comments && r.comments.trim() !== '')
            .map(r => ({
                text: r.comments,
                gender: r.userId?.gender || 'Unknown'
            }));

        setData({
            count,
            avgScore: Math.round(avgScore),
            daySafety,
            nightSafety,
            issues,
            categories,
            genderCounts,
            genderPercentages,
            descriptions
        });
    };

    const getScoreCategory = (score) => {
        if (score >= 80) return { label: 'Very Safe', color: '#10b981', bg: 'bg-accent-safe/10' };
        if (score >= 60) return { label: 'Safe', color: '#84cc16', bg: 'bg-lime-500/10' };
        if (score >= 40) return { label: 'Moderate', color: '#f59e0b', bg: 'bg-accent-warning/10' };
        if (score >= 20) return { label: 'Risky', color: '#f97316', bg: 'bg-orange-500/10' };
        return { label: 'Very Unsafe', color: '#ef4444', bg: 'bg-accent-danger/10' };
    };

    const radarData = data ? {
        labels: Object.keys(data.categories),
        datasets: [{
            label: 'Safety Factors (Avg 1-5)',
            data: Object.values(data.categories),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: '#6366f1',
        }]
    } : null;

    const pieData = data ? {
        labels: Object.keys(data.issues),
        datasets: [{
            data: Object.values(data.issues),
            backgroundColor: [
                '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
                '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
                '#14b8a6', '#94a3b8'
            ],
            borderWidth: 0,
        }]
    } : null;

    const barData = data ? {
        labels: ['Daytime Safety', 'Nighttime Safety'],
        datasets: [{
            label: 'Avg Rating (1-5)',
            data: [data.daySafety, data.nightSafety],
            backgroundColor: ['#6366f1', '#1e1b4b'],
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)'
        }]
    } : null;

    const genderChartData = data ? {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
            data: [data.genderCounts.Male, data.genderCounts.Female, data.genderCounts.Other],
            backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
            borderWidth: 0,
        }]
    } : null;

    return (
        <div className="py-4 md:py-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
            <div className="glass p-4 md:p-8 text-center space-y-6 md:space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-black mb-2">Area Safety Analysis</h1>
                    <p className="text-text-dim">Get real-time safety insights by searching for an area</p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto items-end">
                    <div className="flex-1 space-y-1 text-left w-full">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Area Name</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                            <input 
                                type="text"
                                className="input-field pl-12"
                                placeholder="e.g. Bandra, Mumbai"
                                value={searchParams.areaName}
                                onChange={(e) => setSearchParams({ ...searchParams, areaName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48 space-y-1 text-left">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Pincode</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                            <input 
                                type="text"
                                className="input-field pl-12"
                                placeholder="6-digit"
                                maxLength={6}
                                value={searchParams.pincode}
                                onChange={(e) => setSearchParams({ ...searchParams, pincode: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary px-8 flex items-center justify-center gap-2 h-[46px] w-full md:w-auto" disabled={loading || (!searchParams.areaName && !searchParams.pincode)}>
                        {loading ? 'Searching...' : <><Search size={20} /> Search</>}
                    </button>
                </form>

                {error && (
                    <div className="text-accent-danger text-sm bg-accent-danger/10 border border-accent-danger/20 py-2 px-4 rounded-lg inline-block">
                        {error}
                    </div>
                )}
            </div>

            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Score Card */}
                    <div className="lg:col-span-1 glass p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wider">Overall Safety Score</h3>
                        <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center relative ${getScoreCategory(data.avgScore).bg}`} style={{ borderColor: getScoreCategory(data.avgScore).color }}>
                            <span className="text-4xl md:text-5xl font-black" style={{ color: getScoreCategory(data.avgScore).color }}>
                                {data.avgScore}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xl font-bold block" style={{ color: getScoreCategory(data.avgScore).color }}>
                                {getScoreCategory(data.avgScore).label}
                            </span>
                            <p className="text-xs text-text-dim">Based on {data.count} reports</p>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="lg:col-span-1 glass p-6 space-y-4">
                        <h3 className="text-md font-bold text-black flex items-center gap-2">
                            <TrendingUp size={18} className="text-primary" strokeWidth={2.5} /> Safety Factors
                        </h3>
                        <div className="h-[250px] flex items-center justify-center">
                            <Radar
                                data={radarData}
                                options={{
                                    scales: {
                                        r: {
                                            beginAtZero: true,
                                            max: 5,
                                            grid: { color: 'rgba(255,255,255,0.05)' },
                                            angleLines: { color: 'rgba(255,255,255,0.05)' },
                                            ticks: { display: false },
                                            pointLabels: { color: '#94a3b8', font: { size: 10, weight: '600' } }
                                        }
                                    },
                                    plugins: { legend: { display: false } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="lg:col-span-1 glass p-6 space-y-4">
                        <h3 className="text-md font-bold text-black flex items-center gap-2">
                            <Clock size={18} className="text-primary" strokeWidth={2.5} /> Time Comparison
                        </h3>
                        <div className="h-[250px]">
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Incident Type Pie Chart */}
                    <div className="lg:col-span-1 glass p-6 space-y-4">
                        <h3 className="text-md font-bold text-black flex items-center gap-2">
                            <AlertCircle size={18} className="text-primary" strokeWidth={2.5} /> Common Issues
                        </h3>
                        <div className="h-[250px] flex items-center justify-center">
                            <Pie
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true, padding: 15 }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gender Breakdown Details */}
                    <div className="glass p-6 md:p-8 space-y-6">
                        <h3 className="text-xl font-bold text-black border-b border-gray-100 pb-4">Reporter Demographics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-2xl bg-blue-50">
                                <span className="text-2xl font-black text-blue-600 block">{data.genderPercentages.Male}%</span>
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Male</span>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-pink-50">
                                <span className="text-2xl font-black text-pink-600 block">{data.genderPercentages.Female}%</span>
                                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Female</span>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-purple-50">
                                <span className="text-2xl font-black text-purple-600 block">{data.genderPercentages.Other}%</span>
                                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Other</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 text-sm font-medium text-text-dim border-t border-gray-100">
                            <span>Total Reporters</span>
                            <span className="text-black font-bold">{data.count}</span>
                        </div>
                    </div>

                    {/* Report Descriptions */}
                    <div className="glass p-8 space-y-6">
                        <h3 className="text-xl font-bold text-black border-b border-gray-100 pb-4">User Descriptions</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {data.descriptions.length > 0 ? (
                                data.descriptions.map((desc, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative text-text-main text-sm">
                                        <p className="italic mb-2 text-gray-700">"{desc.text}"</p>
                                        <div className="flex justify-end">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                                                desc.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 
                                                desc.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                                {desc.gender}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-text-dim text-center py-8">No descriptions provided for this area.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

