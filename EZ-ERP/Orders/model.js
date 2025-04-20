import mongoose from 'mongoose';
import orderSchema from './schema.js';

const Order = mongoose.model('Order', orderSchema);

export default Order;
