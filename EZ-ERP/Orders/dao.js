import Order from './model.js';
import { OrderStatus, PaymentStatus } from './schema.js';
import { v4 as uuidv4 } from 'uuid';

class OrderDAO {
    // Create a new order
    async createOrder(orderData) {
        try {
            const order = new Order({
                ...orderData,
                _id: orderData._id || `ORD-${uuidv4().substring(0, 8)}`,
                status: orderData.status || OrderStatus.PENDING,
                paymentStatus: orderData.paymentStatus || PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return await order.save();
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    // Get all orders
    async getAllOrders() {
        try {
            return await Order.find({}).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching orders: ${error.message}`);
        }
    }

    // Get order by ID
    async getOrderById(id) {
        try {
            return await Order.findById(id);
        } catch (error) {
            throw new Error(`Error finding order: ${error.message}`);
        }
    }

    // Get order by order number
    async getOrderByNumber(orderNumber) {
        try {
            return await Order.findOne({ orderNumber });
        } catch (error) {
            throw new Error(`Error finding order by number: ${error.message}`);
        }
    }

    // Get orders by status
    async getOrdersByStatus(status) {
        try {
            if (!Object.values(OrderStatus).includes(status)) {
                throw new Error('Invalid order status');
            }
            return await Order.find({ status }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching orders by status: ${error.message}`);
        }
    }

    // Get orders by payment status
    async getOrdersByPaymentStatus(paymentStatus) {
        try {
            if (!Object.values(PaymentStatus).includes(paymentStatus)) {
                throw new Error('Invalid payment status');
            }
            return await Order.find({ paymentStatus }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching orders by payment status: ${error.message}`);
        }
    }

    // Update order
    async updateOrder(id, updateData) {
        try {
            const order = await Order.findByIdAndUpdate(
                id,
                {
                    ...updateData,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );
            return order;
        } catch (error) {
            throw new Error(`Error updating order: ${error.message}`);
        }
    }

    // Update order status
    async updateOrderStatus(id, status) {
        try {
            if (!Object.values(OrderStatus).includes(status)) {
                throw new Error('Invalid order status');
            }
            const order = await Order.findByIdAndUpdate(
                id,
                {
                    status,
                    updatedAt: new Date()
                },
                { new: true }
            );
            return order;
        } catch (error) {
            throw new Error(`Error updating order status: ${error.message}`);
        }
    }

    // Update payment status
    async updatePaymentStatus(id, paymentStatus) {
        try {
            if (!Object.values(PaymentStatus).includes(paymentStatus)) {
                throw new Error('Invalid payment status');
            }
            const order = await Order.findByIdAndUpdate(
                id,
                {
                    paymentStatus,
                    updatedAt: new Date()
                },
                { new: true }
            );
            return order;
        } catch (error) {
            throw new Error(`Error updating payment status: ${error.message}`);
        }
    }

    // Delete order
    async deleteOrder(id) {
        try {
            const order = await Order.findByIdAndDelete(id);
            return order;
        } catch (error) {
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }
}

export default new OrderDAO();
