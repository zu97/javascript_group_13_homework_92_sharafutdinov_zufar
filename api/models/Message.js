const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
