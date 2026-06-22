import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, FileText, ChevronRight, MessageSquare } from 'lucide-react';

const AdminPanel = () => {
    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100-rem)]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex flex-col gap-2">
                <div className="glass p-4 mb-4">
                    <h2 className="text-xl font-bold text-bg-navy flex items-center gap-2">
                        <LayoutDashboard className="text-primary" size={24} />
                        Admin Panel
                    </h2>
                </div>
                
                <nav className="flex flex-col gap-2">
                    <AdminNavLink to="/admin" end icon={<LayoutDashboard size={20} />}>
                        Dashboard
                    </AdminNavLink>
                    <AdminNavLink to="/admin/users" icon={<Users size={20} />}>
                        Users
                    </AdminNavLink>
                    <AdminNavLink to="/admin/incidents" icon={<AlertTriangle size={20} />}>
                        Incidents
                    </AdminNavLink>
                    <AdminNavLink to="/admin/reports" icon={<FileText size={20} />}>
                        Safety Reports
                    </AdminNavLink>
                    <AdminNavLink to="/admin/feedback" icon={<MessageSquare size={20} />}>
                        User Feedback
                    </AdminNavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="glass p-6 min-h-[600px] animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const AdminNavLink = ({ to, children, icon, end = false }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `
            flex items-center justify-between p-4 rounded-xl font-bold transition-all duration-300
            ${isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-text-dim hover:bg-white/40 hover:text-bg-navy glass'}
        `}
    >
        <div className="flex items-center gap-3">
            {icon}
            {children}
        </div>
        <ChevronRight size={18} className="opacity-50" />
    </NavLink>
);

export default AdminPanel;
