import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Filter, Search, MoreHorizontal, FileText, Trash2 } from 'lucide-react';
import ComplaintModal from './ComplaintModal';
import axios from 'axios';

const ComplaintTable = () => {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Complaints
    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('/api/complaints');
            if (Array.isArray(res.data)) {
                setComplaints(res.data);
            } else {
                console.error("Data is not array:", res.data);
                setComplaints([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setComplaints([]); // Fallback
            setLoading(false);
        }
    };

    const handleView = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleResolve = async (id) => {
        try {
            await axios.patch(`/api/complaints/${id}/close`);

            // Optimistic update
            setComplaints(complaints.map(c =>
                c._id === id ? { ...c, status: 'Closed' } : c
            ));
            if (selectedComplaint && selectedComplaint._id === id) {
                setSelectedComplaint(prev => ({ ...prev, status: 'Closed' }));
            }
        } catch (error) {
            console.error('Error closing complaint:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this complaint? This cannot be undone.")) {
            try {
                await axios.delete(`/api/complaints/${id}`);
                setComplaints(complaints.filter(c => c._id !== id));
            } catch (error) {
                console.error('Error deleting complaint:', error);
            }
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Name", "Role", "Department", "Category", "Date", "Status", "Description"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + complaints.map(c => [
                c._id,
                `"${c.name}"`,
                c.role,
                c.department,
                c.category,
                new Date(c.date).toLocaleDateString(),
                c.status,
                `"${c.description.replace(/"/g, '""')}"` // Escape quotes
            ].join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "complaints_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-outfit">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Recent Complaints</h3>
                    <p className="text-sm text-gray-500">Manage and resolve student/staff grievances</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 w-full md:w-64 transition-all" />
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        <FileText size={18} /> Export JSON/CSV
                    </button>
                    {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={18} /> Filter
                    </button> */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 pl-6 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted By</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 pr-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading complaints...</td></tr>
                        ) : !Array.isArray(complaints) || complaints.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No complaints found.</td></tr>
                        ) : (
                            complaints.map((complaint) => (
                                <tr key={complaint._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 pl-6 font-mono text-xs font-medium text-gray-400">
                                        <span className="bg-gray-100 px-2 py-1 rounded-md">#{complaint._id.slice(-4)}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{complaint.isAnonymous ? 'Anonymous' : complaint.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{complaint.role}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-900">{complaint.category}</div>
                                        <div className="text-xs text-gray-500">{complaint.department}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-medium">{new Date(complaint.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${complaint.status === 'Closed'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {complaint.status === 'Closed' ? (
                                                <>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Resolved
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div> Pending
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleView(complaint)}
                                            className="text-gray-400 hover:text-secondary-900 hover:bg-gray-100 p-2 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(complaint._id)}
                                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"
                                            title="Delete Complaint"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/30">
                <button className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                    View All Complaints
                </button>
            </div>

            <ComplaintModal
                isOpen={isModalOpen}
                complaint={selectedComplaint}
                onClose={() => setIsModalOpen(false)}
                onResolve={handleResolve}
            />
        </div>
    );
};

export default ComplaintTable;
