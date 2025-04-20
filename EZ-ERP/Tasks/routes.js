import express from 'express';
import taskDAO from './dao.js';

const router = express.Router();

// Middleware to validate task data
const validateTaskData = (req, res, next) => {
    const { title, description, assignedTo, assignedBy, dueDate } = req.body;

    // Required fields validation
    if (!title || !description || !assignedTo || !assignedBy || !dueDate) {
        return res.status(400).json({ error: 'Title, description, assignedTo, assignedBy, and dueDate are required' });
    }

    // Validate due date
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid due date format' });
    }

    // Validate status if provided
    if (req.body.status) {
        const validStatuses = ['pending', 'in progress', 'completed'];
        if (!validStatuses.includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid task status' });
        }
    }

    // Validate priority if provided
    if (req.body.priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(req.body.priority)) {
            return res.status(400).json({ error: 'Invalid task priority' });
        }
    }

    // Validate order-related fields
    if (req.body.orderRelated) {
        if (!req.body.orderNumber) {
            return res.status(400).json({ error: 'Order number is required for order-related tasks' });
        }
    }

    next();
};

// Create a new task
router.post('/', validateTaskData, async (req, res) => {
    try {
        const task = await taskDAO.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            res.status(409).json({ error: 'Task with this ID already exists' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await taskDAO.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await taskDAO.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
    try {
        const tasks = await taskDAO.getTasksByStatus(req.params.status);
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get tasks by priority
router.get('/priority/:priority', async (req, res) => {
    try {
        const tasks = await taskDAO.getTasksByPriority(req.params.priority);
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get tasks by assignee
router.get('/assignee/:assignedTo', async (req, res) => {
    try {
        const tasks = await taskDAO.getTasksByAssignee(req.params.assignedTo);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tasks by order number
router.get('/order/:orderNumber', async (req, res) => {
    try {
        const tasks = await taskDAO.getTasksByOrderNumber(req.params.orderNumber);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task
router.put('/:id', validateTaskData, async (req, res) => {
    try {
        const task = await taskDAO.updateTask(req.params.id, req.body);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark task as completed
router.patch('/:id/complete', async (req, res) => {
    try {
        const task = await taskDAO.markTaskAsCompleted(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const task = await taskDAO.deleteTask(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 