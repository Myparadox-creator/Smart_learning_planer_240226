const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        time: {
            type: String,
            required: [true, 'Task time is required'],
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        subject: {
            type: String,
            default: '',
        },
        duration: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['done', 'pending'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Task', taskSchema);
