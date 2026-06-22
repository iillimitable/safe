import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, Calendar } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: 18,
        gender: 'Male',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.length < 3) return setError('Name must be at least 3 characters');
        if (formData.password.length < 6) return setError('Password must be at least 6 characters');
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

        try {
            await register({
                name: formData.name,
                email: formData.email,
                age: formData.age,
                gender: formData.gender,
                password: formData.password
            });
            navigate('/welcome');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-6 md:mt-10 p-6 md:p-8 glass px-4 md:px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-2">Register yourself</h2>
                <p className="text-text-dim text-sm">Create an account to start reporting</p>
            </div>

            {error && (
                <div className="bg-accent-danger/10 border border-accent-danger text-accent-danger px-4 py-2 rounded-lg mb-6 text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Full Name</label>
                    <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Khushi Tiwari"
                            className="input-field pl-12"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            className="input-field pl-12"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Age</label>
                    <div className="relative group">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type="number"
                            name="age"
                            min="18"
                            max="60"
                            className="input-field pl-12"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Gender</label>
                    <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <select
                            name="gender"
                            className="input-field pl-12"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Password</label>
                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            className="input-field pl-12"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main ml-1">Confirm Password</label>
                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="••••••••"
                            className="input-field pl-12 pr-12"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                    Register
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-text-dim">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Register;

