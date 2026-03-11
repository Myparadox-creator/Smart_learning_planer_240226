const express = require('express');
const Plan = require('../models/Plan');
const { protect, getUserId } = require('../middleware/auth');

const router = express.Router();

// All plan routes require authentication
router.use(protect);

// GET /api/plans — List all plans for the authenticated user
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const plans = await Plan.find({ userId }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('GET /api/plans error:', error.message);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

// POST /api/plans — Create a new plan
router.post('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, description, topics, startDate, endDate } = req.body;

        const plan = await Plan.create({
            userId,
            name,
            description,
            topics,
            startDate,
            endDate,
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('POST /api/plans error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

// PUT /api/plans/:id — Update a plan
router.put('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, description, topics, progress, status, startDate, endDate } = req.body;

        const plan = await Plan.findOneAndUpdate(
            { _id: req.params.id, userId },
            { name, description, topics, progress, status, startDate, endDate },
            { new: true, runValidators: true }
        );

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('PUT /api/plans/:id error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update plan' });
    }
});

// DELETE /api/plans/:id — Delete a plan
router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const plan = await Plan.findOneAndDelete({ _id: req.params.id, userId });

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/plans/:id error:', error.message);
        res.status(500).json({ error: 'Failed to delete plan' });
    }
});

module.exports = router;
