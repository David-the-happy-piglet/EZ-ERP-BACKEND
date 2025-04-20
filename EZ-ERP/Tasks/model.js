import mongoose from 'mongoose';
import taskSchema from './schema.js';

const Task = mongoose.model('Task', taskSchema);

export default Task; 