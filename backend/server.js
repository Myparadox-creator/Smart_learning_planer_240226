const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initClerk } = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/* ── Global Middleware ── */

// CORS — allow the Vite dev server
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Parse JSON bodies
app.use(express.json());

/* ── Public Routes (no auth needed) ── */

app.use('/api/health', require('./routes/health'));

// Initialise Clerk on every request (must be before protected routes)
app.use(initClerk);

/* ── Protected Routes ── */

app.use('/api/plans', require('./routes/plans'));
app.use('/api/tasks', require('./routes/tasks'));

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

/* ── Start Server ── */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 SmartLearn API running on http://localhost:${PORT}`);
});
