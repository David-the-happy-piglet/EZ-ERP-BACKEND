import Message from './model.js';
import { v4 as uuidv4 } from 'uuid';

class MessageDAO {
    // Create a new message
    async createMessage(messageData) {
        try {
            const message = new Message({
                ...messageData,
                _id: messageData._id || `MSG-${uuidv4().substring(0, 8)}`,
                postDate: messageData.postDate || new Date(),
                read: messageData.read || false
            });
            return await message.save();
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`);
        }
    }

    // Get all messages
    async getAllMessages() {
        try {
            return await Message.find({}).sort({ postDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching messages: ${error.message}`);
        }
    }

    // Get messages by order number
    async getMessagesByOrderNumber(orderNumber) {
        try {
            return await Message.find({
                orderRelated: true,
                orderNumber
            }).sort({ postDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching messages by order number: ${error.message}`);
        }
    }

    // Get messages by type
    async getMessagesByType(messageType) {
        try {
            return await Message.find({ messageType }).sort({ postDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching messages by type: ${error.message}`);
        }
    }

    // Get unread messages
    async getUnreadMessages() {
        try {
            return await Message.find({ read: false }).sort({ postDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching unread messages: ${error.message}`);
        }
    }

    // Update message
    async updateMessage(id, updateData) {
        try {
            const message = await Message.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return message;
        } catch (error) {
            throw new Error(`Error updating message: ${error.message}`);
        }
    }

    // Mark message as read
    async markMessageAsRead(id) {
        try {
            const message = await Message.findByIdAndUpdate(
                id,
                { read: true },
                { new: true }
            );
            return message;
        } catch (error) {
            throw new Error(`Error marking message as read: ${error.message}`);
        }
    }

    // Delete message
    async deleteMessage(id) {
        try {
            const message = await Message.findByIdAndDelete(id);
            return message;
        } catch (error) {
            throw new Error(`Error deleting message: ${error.message}`);
        }
    }
}

export default new MessageDAO(); 