import mongoose from 'mongoose';
import customerSchema from '../Customers/schema.js';

// User roles enum


// Order status enum
export const OrderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};

// Payment status enum
export const PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: customerSchema,
        required: true
    },
    items: [{
        productId: {
            type: String,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
    { collection: 'orders' });

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default orderSchema;