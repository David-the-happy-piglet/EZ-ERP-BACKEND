import express from 'express';
import bcrypt from 'bcryptjs';
import UserDAO from './dao.js';
import { UserRole } from './schema.js';
import { verifySession } from '../middleware/auth.js';

const router = express.Router();

// User management routes
router.get('/', verifySession, async (req, res) => {
    try {
        const users = await UserDAO.getAllUsers();
        // Remove sensitive data before sending
        const sanitizedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            dob: user.dob,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        res.json(sanitizedUsers);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

router.post('/', verifySession, async (req, res) => {
    try {
        // Check if user is admin or HR
        if (req.session.user.role !== UserRole.ADMIN && req.session.user.role !== UserRole.HR) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { username, password, firstName, lastName, email, dob, role } = req.body;

        // Check if username or email already exists
        const existingUser = await UserDAO.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await UserDAO.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create user with plain text password
        const user = await UserDAO.createUser({
            username,
            password, // Store as plain text
            firstName,
            lastName,
            email,
            dob: new Date(dob),
            role: role || UserRole.MKT
        });

        // Return user info without sensitive data
        res.status(201).json({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            dob: user.dob
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message || 'Error creating user' });
    }
});

router.put('/:id', verifySession, async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        // Check if user is admin, HR, or updating their own profile
        if (req.session.user.role !== UserRole.ADMIN &&
            req.session.user.role !== UserRole.HR &&
            req.session.user.id !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Don't allow updating password through this route
        if (updateData.password) {
            return res.status(400).json({ message: 'Use change-password route to update password' });
        }

        const updatedUser = await UserDAO.updateUser(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

router.delete('/:id', verifySession, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user is admin or HR
        if (req.session.user.role !== UserRole.ADMIN && req.session.user.role !== UserRole.HR) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedUser = await UserDAO.deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

export default router; 