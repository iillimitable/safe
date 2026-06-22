import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/welcome');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 md:mt-20 p-6 md:p-8 glass px-4 md:px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
                <p className="text-text-dim text-sm">Login to your Safe Map account</p>
            </div>

            {error && (
                <div className="bg-accent-danger/10 border border-accent-danger text-accent-danger px-4 py-2 rounded-lg mb-6 text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="input-field pl-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Password</label>
                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="input-field pl-12 pr-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-4">
                    Login
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-text-dim">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Login;

