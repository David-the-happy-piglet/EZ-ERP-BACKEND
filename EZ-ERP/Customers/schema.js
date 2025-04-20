import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,

        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
    { collection: 'customers' });

export default customerSchema;