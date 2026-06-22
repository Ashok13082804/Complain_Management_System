const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: { type: String, default: 'Anonymous' },
    role: { type: String, enum: ['Student', 'Staff'], default: 'Student' },
    department: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    hasAttachment: { type: Boolean, default: false },
    attachmentUrl: { type: String }, // Placeholder for now
    status: { type: String, enum: ['Pending', 'Closed'], default: 'Pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
