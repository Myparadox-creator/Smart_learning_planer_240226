const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Plan name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        topics: {
            type: [String],
            default: [],
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ['Active', 'In Progress', 'Completed', 'Paused'],
            default: 'Active',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Plan', planSchema);
