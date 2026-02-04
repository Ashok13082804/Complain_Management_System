import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Calendar, Tag, Building, FileText, Download, Send } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ComplaintModal = ({ isOpen, complaint, onClose, onResolve }) => {
    const [adminResponse, setAdminResponse] = useState(complaint?.adminResponse || '');
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when complaint changes (ensure each complaint gets its own fresh response field)
    React.useEffect(() => {
        setAdminResponse(complaint?.adminResponse || '');
    }, [complaint]);

    if (!isOpen || !complaint) return null;

    const generatePDF = () => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("YellowShield Official Report", margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Ticket ID: #${complaint._id}`, margin, y);
        doc.text(`Date: ${new Date(complaint.date).toLocaleDateString()}`, 150, y);
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, y, 190, y);
        y += 15;

        // Content
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Complaint Details", margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Submitted By: ${complaint.isAnonymous ? 'Anonymous' : complaint.name}`, margin, y);
        y += 7;
        doc.text(`Role: ${complaint.role}`, margin, y);
        y += 7;
        doc.text(`Department: ${complaint.department}`, margin, y);
        y += 7;
        doc.text(`Category: ${complaint.category}`, margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text("Description:", margin, y);
        y += 7;
        doc.setFontSize(10);
        doc.setTextColor(60);
        const splitDesc = doc.splitTextToSize(complaint.description, 170);
        doc.text(splitDesc, margin, y);
        y += (splitDesc.length * 5) + 15;

        // Admin Response
        if (adminResponse || complaint.adminResponse) {
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text("Administration Response & Suggestions", margin, y);
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(60);
            const splitResp = doc.splitTextToSize(adminResponse || complaint.adminResponse, 170);
            doc.text(splitResp, margin, y);
            y += (splitResp.length * 5) + 20;
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("This is a computer-generated document. No signature required.", margin, 280);

        doc.save(`YellowShield_Report_${complaint._id.slice(-6)}.pdf`);
    };

    const handleSaveResponse = async () => {
        if (!adminResponse.trim()) return alert("Please enter a response.");
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${complaint._id}/respond`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminResponse })
            });
            if (response.ok) {
                onResolve(complaint._id);
                onClose();
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-outfit">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-white p-8 border-b border-gray-100 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    #{complaint._id.slice(-6)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${complaint.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {complaint.status === 'Closed' ? <CheckCircle size={10} /> : <FileText size={10} />}
                                    {complaint.status === 'Closed' ? 'Resolved' : 'Pending'}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Complaint Evaluation</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={generatePDF}
                                title="Download as PDF"
                                className="bg-primary-50 hover:bg-primary-100 p-2 rounded-full transition-colors text-primary-600 shadow-sm"
                            >
                                <Download size={22} />
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500 hover:text-black"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-gray-400 border border-gray-100">
                                    <User size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Submitted By</label>
                                    <p className="font-semibold text-gray-900 text-lg">
                                        {complaint.isAnonymous ? (
                                            <span className="text-yellow-600 italic">Anonymous</span>
                                        ) : (
                                            complaint.name
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium">{complaint.role}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-gray-400 border border-gray-100">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Date</label>
                                    <p className="font-semibold text-gray-900 text-lg">{new Date(complaint.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={18} className="text-gray-400" />
                                <label className="text-xs font-bold text-gray-400 uppercase">Complaint Description</label>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                {complaint.description}
                            </div>
                        </div>

                        {/* Admin Response Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle size={18} className="text-primary-600" />
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Administration Response & Suggestions</label>
                            </div>
                            <textarea
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-medium text-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 min-h-[140px] resize-none leading-relaxed transition-all shadow-sm"
                                placeholder="Type your response/suggestion for the user here..."
                                disabled={complaint.status === 'Closed' && !complaint.adminResponse}
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            Back
                        </button>
                        {complaint.status !== 'Closed' && (
                            <button
                                onClick={handleSaveResponse}
                                disabled={isSaving}
                                className="px-8 py-3 rounded-xl font-extrabold bg-secondary-900 text-white shadow-lg shadow-secondary-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : <><Send size={18} /> Send & Resolve</>}
                            </button>
                        )}
                        {complaint.status === 'Closed' && (
                            <button
                                onClick={generatePDF}
                                className="px-8 py-3 rounded-xl font-extrabold bg-primary-500 text-secondary-900 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Download size={18} /> Download Letter
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComplaintModal;
