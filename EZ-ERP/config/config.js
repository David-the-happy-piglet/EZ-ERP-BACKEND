import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Database configuration
export const dbConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ez-erp',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

// Server configuration
export const serverConfig = {
    port: process.env.PORT || 3000
};

// JWT configuration
export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h'
};

// Connect to MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.uri, dbConfig.options);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}; 