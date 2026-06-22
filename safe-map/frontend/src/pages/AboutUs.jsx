import React from 'react';
import { Info, Target, HelpCircle, Shield, TrendingUp, Users } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass p-6 md:p-12 text-center space-y-6">
                <div className="inline-flex p-4 rounded-3xl bg-primary/10 border border-primary/20 mb-4">
                    <Info size={48} className="text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-black leading-tight">About Safe Map</h1>
                <p className="text-xl text-text-dim max-w-2xl mx-auto leading-relaxed">
                    Safe Map is a data-driven community initiative dedicated to improving public safety through collective reporting and analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 space-y-4">
                    <div className="flex items-center gap-3 text-black mb-2">
                        <Target className="text-primary" />
                        <h2 className="text-2xl font-bold">Our Mission</h2>
                    </div>
                    <p className="text-text-dim leading-relaxed">
                        To empower citizens with tools to report safety conditions and visualize risk levels, promoting a safer environment for everyone through transparency and data.
                    </p>
                </div>

                <div className="glass p-8 space-y-6">
                    <div className="flex items-center gap-3 text-black mb-2">
                        <HelpCircle className="text-primary" />
                        <h2 className="text-2xl font-bold">How It Works</h2>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                            <div className="mt-1 p-1 rounded-full bg-primary/20 text-primary">
                                <Users size={16} />
                            </div>
                            <span className="text-text-dim text-sm">Users submit reports based on infrastructure, law & order, and personal experiences.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="mt-1 p-1 rounded-full bg-primary/20 text-primary">
                                <Shield size={16} />
                            </div>
                            <span className="text-text-dim text-sm">Our scientific algorithm calculates a safety score (0-100) for the area based on multi-factor input.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="mt-1 p-1 rounded-full bg-primary/20 text-primary">
                                <TrendingUp size={16} />
                            </div>
                            <span className="text-text-dim text-sm">Dynamic charts visualize the data, helping users identify safe and risky zones in real-time.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

