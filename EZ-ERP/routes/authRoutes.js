import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authController.js';
import { verifySession } from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

// Get current user profile (protected route)
router.get('/profile', verifySession, getProfile);

export default router; 