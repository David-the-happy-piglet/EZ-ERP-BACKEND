import mongoose from 'mongoose';
import messageSchema from './schema.js';

const Message = mongoose.model('Message', messageSchema);

export default Message;