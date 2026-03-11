const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/health — Public health-check endpoint
router.get('/', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
        dbState === 1 ? 'connected' :
            dbState === 2 ? 'connecting' :
                dbState === 3 ? 'disconnecting' :
                    'disconnected';

    res.json({
        status: 'ok',
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
        database: dbStatus,
    });
});

module.exports = router;
