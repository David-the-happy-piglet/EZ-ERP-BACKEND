import Task from './model.js';
import { v4 as uuidv4 } from 'uuid';

class TaskDAO {
    // Create a new task
    async createTask(taskData) {
        try {
            const task = new Task({
                ...taskData,
                _id: taskData._id || `TASK-${uuidv4().substring(0, 8)}`,
                postDate: taskData.postDate || new Date(),
                status: taskData.status || 'pending',
                priority: taskData.priority || 'medium'
            });
            return await task.save();
        } catch (error) {
            throw new Error(`Error creating task: ${error.message}`);
        }
    }

    // Get all tasks
    async getAllTasks() {
        try {
            return await Task.find({}).sort({ dueDate: 1 });
        } catch (error) {
            throw new Error(`Error fetching tasks: ${error.message}`);
        }
    }

    // Get task by ID
    async getTaskById(id) {
        try {
            return await Task.findById(id);
        } catch (error) {
            throw new Error(`Error finding task: ${error.message}`);
        }
    }

    // Get tasks by status
    async getTasksByStatus(status) {
        try {
            const validStatuses = ['pending', 'in progress', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid task status');
            }
            return await Task.find({ status }).sort({ dueDate: 1 });
        } catch (error) {
            throw new Error(`Error fetching tasks by status: ${error.message}`);
        }
    }

    // Get tasks by priority
    async getTasksByPriority(priority) {
        try {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(priority)) {
                throw new Error('Invalid task priority');
            }
            return await Task.find({ priority }).sort({ dueDate: 1 });
        } catch (error) {
            throw new Error(`Error fetching tasks by priority: ${error.message}`);
        }
    }

    // Get tasks by assignee
    async getTasksByAssignee(assignedTo) {
        try {
            return await Task.find({ assignedTo }).sort({ dueDate: 1 });
        } catch (error) {
            throw new Error(`Error fetching tasks by assignee: ${error.message}`);
        }
    }

    // Get tasks by order number
    async getTasksByOrderNumber(orderNumber) {
        try {
            return await Task.find({
                orderRelated: true,
                orderNumber
            }).sort({ dueDate: 1 });
        } catch (error) {
            throw new Error(`Error fetching tasks by order number: ${error.message}`);
        }
    }

    // Update task
    async updateTask(id, updateData) {
        try {
            const task = await Task.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return task;
        } catch (error) {
            throw new Error(`Error updating task: ${error.message}`);
        }
    }

    // Mark task as completed
    async markTaskAsCompleted(id) {
        try {
            const task = await Task.findByIdAndUpdate(
                id,
                {
                    status: 'completed',
                    updatedAt: new Date()
                },
                { new: true }
            );
            return task;
        } catch (error) {
            throw new Error(`Error marking task as completed: ${error.message}`);
        }
    }

    // Delete task
    async deleteTask(id) {
        try {
            const task = await Task.findByIdAndDelete(id);
            return task;
        } catch (error) {
            throw new Error(`Error deleting task: ${error.message}`);
        }
    }
}

export default new TaskDAO();

