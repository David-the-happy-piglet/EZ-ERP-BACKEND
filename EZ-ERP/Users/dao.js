import User from './model.js';
import { v4 as uuidv4 } from 'uuid';

class UserDAO {
    // Create a new user
    async createUser(userData) {
        try {
            const user = new User({
                ...userData,
                _id: uuidv4()
            });
            return await user.save();
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Get user by ID
    async getUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    // Get user by username
    async getUserByUsername(username) {
        try {
            return await User.findOne({ username });
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            return await User.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    // Get all users
    async getAllUsers() {
        try {
            return await User.find({});
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    // Get users by role
    async getUsersByRole(role) {
        try {
            return await User.find({ role });
        } catch (error) {
            throw new Error(`Error fetching users by role: ${error.message}`);
        }
    }

    // Update user
    async updateUser(id, updateData) {
        try {
            return await User.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Delete user
    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    // Update user password (plain text)
    async updateUserPassword(id, newPassword) {
        try {
            return await User.findByIdAndUpdate(
                id,
                { password: newPassword },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating user password: ${error.message}`);
        }
    }
}

export default new UserDAO();
