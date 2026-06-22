import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { token, user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    return (
        <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
            <div className={`glass px-4 md:px-6 py-3 flex justify-between items-center bg-white/40 backdrop-blur-xl border-black/5 shadow-xl transition-all duration-300 ${isMenuOpen ? 'rounded-b-none' : ''}`}>
                <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                    <div className="w-8 h-8 md:w-10 md:h-10 aspect-square rounded-xl bg-gradient-to-tr from-primary to-primary-burgundy flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                        <Shield className="text-white" size={20} />
                    </div>
                    <span className="text-lg md:text-xl font-black text-bg-navy tracking-tighter">
                        SAFE<span className="text-primary">MAP</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/about" active={isActive('/about')}>About</NavLink>
                    <NavLink to="/feedback" active={isActive('/feedback')}>Feedback</NavLink>
                    {token && (
                        <>
                            <NavLink to="/report" active={isActive('/report')}>Report</NavLink>
                            <NavLink to="/incidents" active={isActive('/incidents')}>Incidents</NavLink>
                            <NavLink to="/data" active={isActive('/data')}>Safety Levels</NavLink>
                            <NavLink to="/profile" active={isActive('/profile')}>Profile</NavLink>
                            {user && user.role === 'admin' && (
                                <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>Admin Panel</NavLink>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Auth Button (Desktop) */}
                    <div className="hidden md:block">
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl text-text-dim hover:text-primary hover:bg-primary/10 transition-all group"
                                title="Logout"
                            >
                                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-primary py-2 px-6 text-sm rounded-xl font-bold transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:text-black"
                            >
                                Login
                            </Link>
                        )
                        }
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="p-2 md:hidden rounded-xl text-text-dim hover:text-primary hover:bg-primary/10 transition-all"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="md:hidden glass mt-0.5 px-4 py-4 flex flex-col gap-2 bg-white/60 backdrop-blur-2xl border-black/5 shadow-2xl animate-in slide-in-from-top-4 duration-300 rounded-t-none">
                    <MobileNavLink to="/about" active={isActive('/about')} onClick={closeMenu}>About</MobileNavLink>
                    <MobileNavLink to="/feedback" active={isActive('/feedback')} onClick={closeMenu}>Feedback</MobileNavLink>
                    {token ? (
                        <>
                            <MobileNavLink to="/report" active={isActive('/report')} onClick={closeMenu}>Report</MobileNavLink>
                            <MobileNavLink to="/incidents" active={isActive('/incidents')} onClick={closeMenu}>Incidents</MobileNavLink>
                            <MobileNavLink to="/data" active={isActive('/data')} onClick={closeMenu}>Safety Levels</MobileNavLink>
                            <MobileNavLink to="/profile" active={isActive('/profile')} onClick={closeMenu}>Profile</MobileNavLink>
                            {user && user.role === 'admin' && (
                                <MobileNavLink to="/admin" active={location.pathname.startsWith('/admin')} onClick={closeMenu}>Admin Panel</MobileNavLink>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-2 border border-red-100"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeMenu}
                            className="btn-primary py-3 px-6 text-center text-sm rounded-xl font-bold transition-all mt-2"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${active
            ? 'text-primary bg-primary/5 shadow-inner'
            : 'text-text-dim hover:text-bg-navy hover:bg-black/5'
            }`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ to, children, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${active
            ? 'text-primary bg-primary/10'
            : 'text-text-dim hover:text-bg-navy hover:bg-black/5'
            }`}
    >
        {children}
    </Link>
);

export default Navbar;
