import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Shield, User, Mail, Lock, ArrowRight, Loader, Building, Briefcase } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        department: 'Computer Science', // Default
        role: 'Student' // Default
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, email, password, fullName, department, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const departments = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Business', 'Arts', 'Administration'];

    const onSubmit = async e => {
        e.preventDefault();
        setError('');



        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, fullName, department, role })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            login(data.user, data.token);
            navigate('/'); // Redirect to landing page after signup
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 my-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Create Account</h1>
                    <p className="text-slate-400 mt-2">Join YellowShield today</p>
                </div>

                {error && (
                    <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* User Info Group */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={onChange}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                placeholder="Username"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={fullName}
                                onChange={onChange}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>

                    {/* Role & Dept Group */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building size={20} className="text-slate-400" />
                            </div>
                            <select
                                name="department"
                                value={department}
                                onChange={onChange}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none text-sm"
                            >
                                {departments.map(d => <option key={d} value={d} className="bg-slate-800">{d}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase size={20} className="text-slate-400" />
                            </div>
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none text-sm"
                            >
                                <option value="Student" className="bg-slate-800">Student</option>
                                <option value="Staff" className="bg-slate-800">Staff</option>
                            </select>
                        </div>
                    </div>

                    {/* Password Group */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                minLength="6"
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary-500 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                placeholder="Password"
                            />
                        </div>


                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <Loader size={20} className="animate-spin" />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
