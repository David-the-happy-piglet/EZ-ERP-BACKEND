import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
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
    messageType: {
        type: String,
        required: true,
        enum: ['new order', 'order status change', 'order update', 'others', 'task started', 'task completed'],
        trim: true
    },
    messageTitle: {
        type: String,
        required: true,
        trim: true
    },
    messageContent: {
        type: String,
        required: true,
        trim: true
    },
    postedBy: {
        type: String,
        required: true,
        trim: true
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    collection: 'messages'
});

export default messageSchema; 