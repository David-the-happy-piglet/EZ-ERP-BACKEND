import express from 'express';
import orderDAO from './dao.js';
import { OrderStatus, PaymentStatus } from './schema.js';

const router = express.Router();

// Middleware to validate order data
const validateOrderData = (req, res, next) => {
    const { orderNumber, customer, items, totalAmount } = req.body;

    // Required fields validation
    if (!orderNumber || !customer || !items || !totalAmount) {
        return res.status(400).json({ error: 'Order number, customer, items, and total amount are required' });
    }

    // Validate customer data
    if (!customer._id || !customer.companyName || !customer.name || !customer.email) {
        return res.status(400).json({ error: 'Customer ID, company name, name, and email are required' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate each item
    for (const item of items) {
        if (!item.productId || !item.productName || !item.quantity || !item.price) {
            return res.status(400).json({ error: 'Each item must have productId, productName, quantity, and price' });
        }
        if (item.quantity < 1) {
            return res.status(400).json({ error: 'Item quantity must be at least 1' });
        }
        if (item.price < 0) {
            return res.status(400).json({ error: 'Item price cannot be negative' });
        }
    }

    // Validate total amount
    if (totalAmount < 0) {
        return res.status(400).json({ error: 'Total amount cannot be negative' });
    }

    // Validate status if provided
    if (req.body.status && !Object.values(OrderStatus).includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid order status' });
    }

    // Validate payment status if provided
    if (req.body.paymentStatus && !Object.values(PaymentStatus).includes(req.body.paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
    }

    next();
};

// Create a new order
router.post('/', validateOrderData, async (req, res) => {
    try {
        const order = await orderDAO.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            res.status(409).json({ error: 'Order with this ID or order number already exists' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await orderDAO.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await orderDAO.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by order number
router.get('/number/:orderNumber', async (req, res) => {
    try {
        const order = await orderDAO.getOrderByNumber(req.params.orderNumber);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders by status
router.get('/status/:status', async (req, res) => {
    try {
        const orders = await orderDAO.getOrdersByStatus(req.params.status);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get orders by payment status
router.get('/payment/:paymentStatus', async (req, res) => {
    try {
        const orders = await orderDAO.getOrdersByPaymentStatus(req.params.paymentStatus);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update order
router.put('/:id', validateOrderData, async (req, res) => {
    try {
        const order = await orderDAO.updateOrder(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({ error: 'Valid order status is required' });
        }
        const order = await orderDAO.updateOrderStatus(req.params.id, status);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
            return res.status(400).json({ error: 'Valid payment status is required' });
        }
        const order = await orderDAO.updatePaymentStatus(req.params.id, paymentStatus);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await orderDAO.deleteOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
