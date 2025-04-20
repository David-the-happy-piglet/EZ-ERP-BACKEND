import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        trim: true
    },
    orderRelated: {
        type: Boolean,
        required: true,
        default: false
    },

    orderNumber: {
        type: String,
        trim: true
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    assignedTo: {
        type: String,
        required: true,
        trim: true
    },
    assignedBy: {
        type: String,
        required: true,
        trim: true
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true,
    collection: 'tasks'
});

export default taskSchema;
