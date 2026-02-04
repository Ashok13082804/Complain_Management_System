import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintTable from '../components/ComplaintTable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        closed: 0,
        byCategory: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            console.log("Fetching Dashboard Stats...");
            try {
                const res = await axios.get('http://localhost:5000/api/complaints/stats');
                console.log("Stats Received:", res.data);
                if (res.data) {
                    setStatsData(res.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="p-10 text-center">Loading Dashboard Data...</div>;
    }

    // Prepare Chart Data
    const chartLabels = statsData.byCategory?.map(item => item._id) || [];
    const chartValues = statsData.byCategory?.map(item => item.count) || [];

    const chartData = {
        labels: chartLabels.length > 0 ? chartLabels : ['No Data'],
        datasets: [
            {
                label: 'Complaints',
                data: chartValues.length > 0 ? chartValues : [0],
                backgroundColor: '#f59e0b',
                borderRadius: 8,
                hoverBackgroundColor: '#fbbf24',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        },
        maintainAspectRatio: false
    };

    const stats = [
        { title: 'Total Complaints', value: statsData.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Pending Review', value: statsData.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { title: 'Resolved Cases', value: statsData.closed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 ml-72 p-10 bg-slate-50 min-h-screen">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
                        <p className="text-slate-500">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to="/admin/complaints"
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 w-full group cursor-pointer active:scale-95"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-500 group-hover:text-primary-600 transition-colors">{stat.title}</p>
                                    <h3 className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                                </div>
                                <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${stat.bg}`}>
                                    <stat.icon className={stat.color} size={28} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10"
                >
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Complaints Overview</h3>
                    </div>
                    <div className="h-64 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </motion.div>

                {/* Complaint Table */}
                <div className="mb-8">
                    <ComplaintTable />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
