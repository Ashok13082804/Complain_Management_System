const express = require('express');
const router = express.Router();
const Complaint = require('../models/ComplaintModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET all complaints (Admin)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            order: [['date', 'DESC']]
        });

        // Map 'id' to '_id' for frontend compatibility if needed, 
        // though we made 'id' string in model to match.
        // Frontend expects _id, let's include it in response if needed or relying on ID.
        // Sequelize returns plain objects with .toJSON()
        const formatted = complaints.map(c => {
            const json = c.toJSON();
            return { ...json, _id: json.id }; // Polyfill _id for frontend compatibility
        });

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUBLIC: Check Complaint Status by ID
router.get('/public/status/:id', async (req, res) => {
    try {
        let complaint = await Complaint.findByPk(req.params.id);

        // Fallback: search by suffix if exact ID not found (e.g., if user inputs only the last few digits)
        if (!complaint) {
            complaint = await Complaint.findOne({
                where: {
                    id: {
                        [Op.like]: `%${req.params.id}`
                    }
                }
            });
        }

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        res.json({
            id: complaint.id,
            _id: complaint.id, // Compat
            status: complaint.status,
            category: complaint.category,
            date: complaint.date,
            adminResponse: complaint.adminResponse || "No updates yet"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH: Add Admin Response
router.patch('/:id/respond', async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        complaint.adminResponse = req.body.adminResponse;
        complaint.status = 'Closed'; // Automatically resolve when responding
        await complaint.save();

        res.json({ ...complaint.toJSON(), _id: complaint.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new complaint
router.post('/', async (req, res) => {
    try {
        console.log("📥 Incoming Complaint Request:", req.body);
        const newComplaintData = {
            id: Date.now().toString(),
            name: req.body.name || 'Anonymous',
            role: req.body.role || 'Student',
            department: req.body.department || 'General',
            category: req.body.category || 'General',
            description: req.body.description || 'No description',
            isAnonymous: req.body.isAnonymous || false,
            hasAttachment: req.body.hasAttachment || false,
            userId: req.body.userId || null, // Capture userId from frontend
            status: 'Pending',
            date: new Date()
        };

        const savedComplaint = await Complaint.create(newComplaintData);

        console.log("✅ [SQL] Complaint Saved:", savedComplaint.id);
        res.status(201).json({ ...savedComplaint.toJSON(), _id: savedComplaint.id });
    } catch (err) {
        console.error("❌ Save Error Details:", err);
        res.status(400).json({ message: err.message, errors: err.errors });
    }
});

// PATCH close a complaint
router.patch('/:id/close', async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        complaint.status = 'Closed';
        await complaint.save();

        res.json({ ...complaint.toJSON(), _id: complaint.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET user's history
router.get('/my-history', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const history = await Complaint.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });

        res.json(history.map(c => ({ ...c.toJSON(), _id: c.id })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE user's history
router.delete('/my-history/clear', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        await Complaint.destroy({
            where: { userId }
        });

        res.json({ message: 'History cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a specific complaint (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        await complaint.destroy();
        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET complaints stats
router.get('/stats', async (req, res) => {
    try {
        const total = await Complaint.count();
        const pending = await Complaint.count({ where: { status: 'Pending' } });
        const closed = await Complaint.count({ where: { status: 'Closed' } });

        // Group by Category
        const byCategoryRaw = await Complaint.findAll({
            attributes: [
                'category',
                [sequelize.fn('COUNT', sequelize.col('category')), 'count']
            ],
            group: ['category']
        });

        // Format for frontend
        const byCategory = byCategoryRaw.map(item => ({
            _id: item.category,
            count: item.dataValues.count
        }));

        res.json({ total, pending, closed, byCategory });
    } catch (err) {
        console.error('Stats Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Need reference to sequelize for the fn/col calls in stats

module.exports = router;
