import express from 'express';
import messageDAO from './dao.js';

const router = express.Router();

// Middleware to validate message data
const validateMessageData = (req, res, next) => {
    const { messageType, messageTitle, messageContent, postedBy } = req.body;

    // Required fields validation
    if (!messageType || !messageTitle || !messageContent || !postedBy) {
        return res.status(400).json({ error: 'Message type, title, content, and postedBy are required' });
    }

    // Validate message type
    const validTypes = ['new order', 'order status change', 'order update', 'others'];
    if (!validTypes.includes(messageType)) {
        return res.status(400).json({ error: 'Invalid message type' });
    }

    // Validate order-related fields
    if (req.body.orderRelated) {
        if (!req.body.orderNumber) {
            return res.status(400).json({ error: 'Order number is required for order-related messages' });
        }
    }

    next();
};

// Create a new message
router.post('/', validateMessageData, async (req, res) => {
    try {
        const message = await messageDAO.createMessage(req.body);
        res.status(201).json(message);
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            res.status(409).json({ error: 'Message with this ID already exists' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Get all messages
router.get('/', async (req, res) => {
    try {
        const messages = await messageDAO.getAllMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages by order number
router.get('/order/:orderNumber', async (req, res) => {
    try {
        const messages = await messageDAO.getMessagesByOrderNumber(req.params.orderNumber);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages by type
router.get('/type/:messageType', async (req, res) => {
    try {
        const messages = await messageDAO.getMessagesByType(req.params.messageType);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread messages
router.get('/unread', async (req, res) => {
    try {
        const messages = await messageDAO.getUnreadMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a message
router.put('/:id', validateMessageData, async (req, res) => {
    try {
        const message = await messageDAO.updateMessage(req.params.id, req.body);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark message as read
router.put('/:id/read', async (req, res) => {
    try {
        const message = await messageDAO.markMessageAsRead(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        const message = await messageDAO.deleteMessage(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 