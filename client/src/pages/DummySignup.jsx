import React, { useState, useContext } from 'react';
import { Shield, User, Mail, Lock, ArrowRight, Loader, Briefcase, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DummySignup = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        department: 'Computer Science',
        role: 'Student'
    });

    const [isLoading, setIsLoading] = useState(false);

    const departments = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Business', 'Arts', 'Administration'];

    const { username, email, password, confirmPassword, fullName, department, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Network Delay
        setTimeout(() => {
            setIsLoading(false);

            // Mock Success
            const demoUser = {
                id: 'demo-' + Date.now(),
                username: username || 'DemoUser',
                email: email,
                role: role,
                fullName: fullName || 'Demo User',
                department: department
            };

            const demoToken = 'demo-token-signup-' + Date.now();

            login(demoUser, demoToken);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative z-10 flex flex-col md:flex-row gap-8">

                {/* Form Section */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold mb-1">
                                OFFLINE DEMO
                            </div>
                            <h1 className="text-2xl font-bold text-white font-outfit">Create Demo Account</h1>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={fullName}
                                    onChange={onChange}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500 text-sm"
                                    placeholder="Full Name"
                                />
                            </div>

                            {/* Username */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500 text-sm"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Department */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building size={18} className="text-slate-400" />
                                </div>
                                <select
                                    name="department"
                                    value={department}
                                    onChange={onChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none text-sm"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Role */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase size={18} className="text-slate-400" />
                                </div>
                                <select
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none text-sm"
                                >
                                    <option value="Student" className="bg-slate-800">Student</option>
                                    <option value="Staff" className="bg-slate-800">Staff</option>
                                    <option value="Admin" className="bg-slate-800">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500 text-sm"
                                placeholder="Email Address"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500 text-sm"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? <Loader size={18} className="animate-spin" /> : 'Register Demo Account'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full text-slate-400 hover:text-white text-xs mt-2 hover:underline"
                        >
                            Return to Real Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DummySignup;
