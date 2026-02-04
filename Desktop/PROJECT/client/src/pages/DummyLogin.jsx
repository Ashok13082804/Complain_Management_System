import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DummyLogin = () => {
    const [formData, setFormData] = useState({
        email: 'demo@demo.com',
        password: 'demo'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate Network Delay
        setTimeout(() => {
            setIsLoading(false);

            // Allow any login
            const demoUser = {
                id: 'demo-' + Date.now(),
                username: 'Demo User',
                email: email,
                role: 'Student',
                fullName: 'Demo User',
                department: 'Computer Science'
            };

            const demoToken = 'demo-token-12345';

            login(demoUser, demoToken);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                        OFFLINE DEMO MODE
                    </div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Demo Login</h1>
                    <p className="text-slate-400 mt-2">Enter anything to continue</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <Loader size={20} className="animate-spin" />
                        ) : (
                            <>
                                <span>Enter Demo Mode</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full text-slate-400 hover:text-white text-sm mt-4 hover:underline"
                    >
                        Return to Real Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DummyLogin;
