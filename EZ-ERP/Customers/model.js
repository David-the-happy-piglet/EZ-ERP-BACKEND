import mongoose from 'mongoose';
import customerSchema from './schema.js';

const Customer = mongoose.model('Customer', customerSchema);

export default Customer; 