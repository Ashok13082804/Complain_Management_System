const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Connect to SQLite
const sequelize = require('./config/database');
sequelize.sync()
    .then(() => console.log('✅ SQLite Database Connected & Synced'))
    .catch(err => console.error('❌ Database connection error:', err));

// Routes
console.log("Loading Routes...");
const complaintRoutes = require('./routes/complaints');
const authRoutes = require('./routes/auth');
console.log("Routes Loaded. Mounting...");
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
console.log("Routes Mounted.");

// Basic Route
app.get('/', (req, res) => {
    res.send('YellowShield API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
