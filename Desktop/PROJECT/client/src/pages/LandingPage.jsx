import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, WifiOff, Search, CheckCircle, Clock, ChevronRight, Lock, FileText, Menu, X, LogOut, Download, Trash2, History } from 'lucide-react';
import { jsPDF } from 'jspdf';
import SuccessPopup from '../components/SuccessPopup';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const LandingPage = () => {
    const { logout, user } = useContext(AuthContext); // Get logout and user from context
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        name: '',
        role: 'Student',
        department: '',
        category: '',
        description: '',
        isAnonymous: false
    });
    const [statusId, setStatusId] = useState('');

    const generateResponsePDF = (data) => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("YellowShield Official Action Report", margin, y);
        y += 15;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Ticket ID: #${data.id}`, margin, y);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 130, y);
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, y, 190, y);
        y += 15;

        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Grievance Status Update", margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Category: ${data.category}`, margin, y);
        y += 7;
        doc.text(`Submission Date: ${new Date(data.date).toLocaleDateString()}`, margin, y);
        y += 7;
        doc.text(`Current Status: ${data.status}`, margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text("Administration Response & Suggestion:", margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(60);
        const splitText = doc.splitTextToSize(data.adminResponse || "Your case is currently under verification.", 160);
        doc.text(splitText, margin + 5, y);

        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("YellowShield Security Verification Module - [SEC-AUTH-001]", margin, 280);

        doc.save(`YellowShield_Response_${data.id.slice(-6)}.pdf`);
    };
    const [statusResult, setStatusResult] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverStatus, setServerStatus] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [history, setHistory] = useState([]);

    // Fetch History
    const fetchHistory = async () => {
        if (user && !String(user.id).startsWith('demo-')) {
            try {
                const res = await axios.get(`http://localhost:5000/api/complaints/my-history?userId=${user.id}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Fetch history error:", err);
            }
        } else {
            // Guest/Demo History from LocalStorage
            const localHistory = JSON.parse(localStorage.getItem('complaintHistory') || '[]');
            setHistory(localHistory);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    // Auto-fill from User Profile
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.fullName || prev.name,
                role: user.role || prev.role,
                department: user.department || prev.department
            }));
        }
    }, [user]);

    // Check Server Status
    useEffect(() => {
        const checkServer = async () => {
            try {
                await axios.get('http://localhost:5000/');
                setServerStatus(true);
            } catch (e) {
                setServerStatus(false);
            }
        };
        checkServer();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let ticketId = '';
            if (user && String(user.id).startsWith('demo-')) {
                // DEMO MODE BYPASS
                await new Promise(resolve => setTimeout(resolve, 1500));
                ticketId = 'DEMO-' + Date.now().toString().slice(-6);
                console.log("Demo Complaint Submitted:", formData);
            } else {
                const payload = { ...formData, userId: user?.id || null };
                const res = await axios.post('http://localhost:5000/api/complaints', payload);
                ticketId = res.data.id;
            }

            // Save to Local History for Guests or quick ref
            const newHistoryItem = {
                id: ticketId,
                category: formData.category,
                date: new Date(),
                status: 'Pending'
            };
            const updatedHistory = [newHistoryItem, ...history];
            setHistory(updatedHistory);
            if (!user) {
                localStorage.setItem('complaintHistory', JSON.stringify(updatedHistory));
            }

            setSuccessMessage(`Complaint Submitted Successfully! Your Ticket ID is: ${ticketId}. Please keep this safe to track your status.`);
            setShowSuccess(true);

            // Don't clear autofilled fields if user is logged in
            setFormData(prev => ({
                ...prev,
                category: '',
                description: '',
                isAnonymous: false,
                name: user ? user.fullName : '',
                role: user ? user.role : 'Student',
                department: user ? user.department : ''
            }));
        } catch (error) {
            console.error("Submission Error:", error);
            const serverMsg = error.response?.data?.message || error.message || 'Server unreachable';
            const validationErrors = error.response?.data?.errors?.map(e => e.message).join(', ');
            alert(`Submission Failed: ${serverMsg}${validationErrors ? ` (${validationErrors})` : ''}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const checkStatus = async (e) => {
        e.preventDefault();
        if (!statusId) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/complaints/public/status/${statusId}`);
            setStatusResult(res.data);
        } catch (err) {
            setStatusResult({ error: 'ID not found. Verify your Ticket ID.' });
        }
    };

    const clearHistory = async () => {
        if (window.confirm("Are you sure you want to clear your complaint history?")) {
            if (user && !String(user.id).startsWith('demo-')) {
                try {
                    await axios.delete('http://localhost:5000/api/complaints/my-history/clear', { data: { userId: user.id } });
                } catch (err) {
                    console.error("Clear history error:", err);
                }
            }
            localStorage.removeItem('complaintHistory');
            setHistory([]);
        }
    };

    const departments = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Business', 'Arts', 'Administration'];
    const categories = ['Infrastructure', 'College Property', 'Toilets', 'Classrooms', 'Other (Non-Moving)'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-200 selection:text-primary-900 overflow-x-hidden">

            {/* Navbar - Glassmorphism */}
            <nav className="fixed top-0 w-full z-50 glass transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                            <Shield size={20} className="text-secondary-900" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-secondary-900 block leading-none">YellowShield</span>
                            {!serverStatus && (
                                <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 leading-none mt-1 animate-pulse">
                                    <WifiOff size={8} /> Offline
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm text-secondary-600">
                        <a href="#hero" className="hover:text-primary-600 transition-colors">Home</a>
                        <a href="#report" className="hover:text-primary-600 transition-colors">Report</a>
                        <a href="#status" className="hover:text-primary-600 transition-colors">Check Status</a>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-500 uppercase">{user.username}</span>
                                <button onClick={() => logout()} className="bg-secondary-900 text-white px-6 py-2.5 rounded-full hover:bg-secondary-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-xs tracking-wide uppercase font-bold flex items-center gap-2">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-secondary-900 text-white px-6 py-2.5 rounded-full hover:bg-secondary-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-xs tracking-wide uppercase font-bold">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 relative">
                {/* Background Blobs - Golden/Warm */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-200/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 animate-blob mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-2000 mix-blend-multiply"></div>

                <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-primary-200 shadow-sm">
                            <Lock size={12} /> Secure & Anonymous
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-extrabold font-outfit text-secondary-900 leading-[1.1] mb-8 tracking-tight">
                            Speak Up. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-amber-600">We Listen.</span>
                        </h1>
                        <p className="text-xl text-secondary-600 mb-10 leading-relaxed max-w-lg font-medium">
                            Submit grievances safely without revealing your identity.
                            Our encrypted portal ensures your voice reaches the right authority instantly.
                        </p>

                        <div className="flex gap-4">
                            <a href="#report" className="px-8 py-4 bg-secondary-900 text-white rounded-2xl font-bold shadow-xl shadow-secondary-900/10 hover:shadow-2xl hover:shadow-secondary-900/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                                File Complaint <ChevronRight size={18} />
                            </a>
                            <a href="#status" className="px-8 py-4 bg-white text-secondary-700 border border-secondary-200 rounded-2xl font-bold hover:bg-secondary-50 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
                                Track Status
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-secondary-200/60 pt-8">
                            <div>
                                <h4 className="text-3xl font-bold text-secondary-900 font-outfit">500+</h4>
                                <p className="text-sm text-secondary-500 font-medium">Cases Solved</p>
                            </div>
                            <div className="w-px h-10 bg-secondary-200"></div>
                            <div>
                                <h4 className="text-3xl font-bold text-secondary-900 font-outfit">24h</h4>
                                <p className="text-sm text-secondary-500 font-medium">Avg. Response</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Status Checker Card */}
                    <motion.div
                        id="status"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="glass rounded-[2rem] p-10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 text-primary-600">
                            <FileText size={120} />
                        </div>

                        <h3 className="text-2xl font-bold font-outfit text-secondary-900 mb-2">Track Your Ticket</h3>
                        <p className="text-secondary-500 mb-8">Enter your Ticket ID to check the progress of your complaint.</p>

                        <form onSubmit={checkStatus} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-32 py-4 bg-white/50 border-secondary-200 rounded-xl font-medium focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all shadow-inner"
                                placeholder="e.g. 65c1..."
                                value={statusId}
                                onChange={(e) => setStatusId(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary-500 hover:bg-primary-600 text-secondary-900 px-6 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg">
                                Check
                            </button>
                        </form>

                        <AnimatePresence>
                            {statusResult && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    {statusResult.error ? (
                                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
                                            {statusResult.error}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-primary-500/5 relative">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status Report</p>
                                                    <p className="font-mono font-bold text-secondary-900 text-lg">#{statusResult.id.slice(-6)}</p>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${statusResult.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                                                    {statusResult.status === 'Closed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    {statusResult.status === 'Closed' ? 'Resolved' : 'In Review'}
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Authority Response</p>
                                                    <p className="text-secondary-700 font-medium leading-relaxed italic">
                                                        "{statusResult.adminResponse || "Your case is currently under verification by the respective department."}"
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => generateResponsePDF(statusResult)}
                                                className="w-full py-3 bg-secondary-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary-800 transition-all shadow-lg shadow-secondary-900/10"
                                            >
                                                <Download size={14} /> Download Response Letter
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Complaint Form Section */}
            <section id="report" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -z-10"></div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold font-outfit text-slate-900 mb-4">File a New Complaint</h2>
                        <p className="text-lg text-slate-500">Structured, secure, and simple. Your identity is safe with us.</p>
                    </div>

                    <motion.div
                        className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-secondary-900/5"
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div
                                onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                                className={`p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${formData.isAnonymous ? 'border-primary-500 bg-primary-50/50' : 'border-secondary-200 hover:border-primary-200 hover:bg-white'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${formData.isAnonymous ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-secondary-900 shadow-lg shadow-primary-500/30' : 'bg-secondary-100 text-secondary-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-secondary-900 font-outfit">Stay Anonymous</h4>
                                        <p className="text-sm text-secondary-500">We will hide your personal details from the admin.</p>
                                    </div>
                                </div>
                                <div className={`w-14 h-8 rounded-full p-1 transition-colors ${formData.isAnonymous ? 'bg-primary-500' : 'bg-secondary-200'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${formData.isAnonymous ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {!formData.isAnonymous && !user && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="grid md:grid-cols-2 gap-6 overflow-hidden"
                                    >
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block pl-1">Full Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block pl-1">Role</label>
                                            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 appearance-none">
                                                <option>Student</option>
                                                <option>Staff</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Only show Department if NOT logged in, otherwise auto-fill handles it invisibly (or show read-only) 
                                    Requester said "I dont want in inner of website to ask about these details".
                                    So we hide it if logged in.
                                */}
                                {!user && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block pl-1">Department</label>
                                        <select name="department" value={formData.department} onChange={handleChange} className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20" required={!user}>
                                            <option value="">Select Department...</option>
                                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className={user ? "col-span-2" : ""}>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block pl-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20" required>
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block pl-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-5 bg-white/50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 min-h-[160px] resize-none leading-relaxed"
                                    placeholder="Please provide full details about the incident..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-gradient-to-r from-primary-500 to-amber-600 text-white font-extrabold font-outfit text-lg rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none transform-gpu"
                            >
                                {isSubmitting ? (
                                    'Authenticating & Submitting...'
                                ) : (
                                    <>Submit Secure Report <Send size={20} /></>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* History Section */}
            {history.length > 0 && (
                <section id="history" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-extrabold font-outfit text-slate-900 mb-2">Submission History</h2>
                                <p className="text-slate-500 font-medium">Keep track of your previous reports and their status.</p>
                            </div>
                            <button
                                onClick={clearHistory}
                                className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
                            >
                                <Trash2 size={18} /> Clear Records
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item, idx) => (
                                <motion.div
                                    key={item.id + idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-white p-3 rounded-2xl shadow-sm text-primary-600 group-hover:scale-110 transition-transform">
                                            <History size={20} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                                            {item.status === 'Closed' ? 'Resolved' : 'Pending'}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-slate-900 mb-1">{item.category}</h4>
                                    <p className="text-xs text-slate-400 font-medium mb-4">{new Date(item.date).toLocaleDateString()}</p>

                                    <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket ID</span>
                                        <span className="text-sm font-mono font-bold text-primary-600">{item.id.slice(-6)}</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setStatusId(item.id);
                                            document.getElementById('status').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="w-full py-3 bg-white text-secondary-900 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary-900 hover:text-white hover:border-secondary-900 transition-all shadow-sm"
                                    >
                                        Track Details
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg">
                                <Shield size={16} className="text-secondary-900" />
                            </div>
                            <span className="text-2xl font-bold font-outfit">YellowShield</span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            The #1 trusted platform for campus safety. We bridge the gap between students and administration with transparency and trust.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 font-outfit">Platform</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-primary-500 transition-colors">Home</a></li>
                            <li><a href="#report" className="hover:text-primary-500 transition-colors">Report Issue</a></li>
                            <li><a href="#status" className="hover:text-primary-500 transition-colors">Check Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 font-outfit">Legal</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary-500 transition-colors">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2026 YellowShield Systems. All rights reserved.
                </div>
            </footer>

            <SuccessPopup
                isOpen={showSuccess}
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />
        </div>
    );
};

export default LandingPage;
