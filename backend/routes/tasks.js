const express = require('express');
const Task = require('../models/Task');
const { protect, getUserId } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(protect);

// GET /api/tasks — List all tasks for the authenticated user
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('GET /api/tasks error:', error.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /api/tasks — Create a new task
router.post('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { time, title, subject, duration } = req.body;

        const task = await Task.create({
            userId,
            time,
            title,
            subject,
            duration,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('POST /api/tasks error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id — Update a task (e.g. toggle status)
router.put('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { time, title, subject, duration, status } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId },
            { time, title, subject, duration, status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('PUT /api/tasks/:id error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/tasks/:id error:', error.message);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
