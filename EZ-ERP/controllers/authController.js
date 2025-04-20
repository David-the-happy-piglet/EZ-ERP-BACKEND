import bcrypt from 'bcryptjs';
import userDAO from '../Users/dao.js';
import { UserRole } from '../Users/schema.js';

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, dob, role } = req.body;

        // Validate required fields
        if (!username || !password || !firstName || !lastName || !email || !dob) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await userDAO.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingEmail = await userDAO.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create user with plain text password
        const userData = {
            username,
            password, // Store password as plain text
            firstName,
            lastName,
            email,
            dob: new Date(dob),
            role: role || UserRole.MKT
        };

        const user = await userDAO.createUser(userData);

        // Store user info in session
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Return user info
        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dob: user.dob,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const user = await userDAO.getUserByUsername(username);
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (plain text comparison)
        if (password !== user.password) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store user info in session
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        console.log('Session after login:', req.session);
        console.log('Session ID:', req.sessionID);

        // Return user info
        res.json({
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dob: user.dob,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        console.log('Session in getProfile:', req.session);
        console.log('Session ID in getProfile:', req.sessionID);

        if (!req.session.user) {
            console.log('No user in session');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await userDAO.getUserById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dob: user.dob,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Logout user
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
}; 