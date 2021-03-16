const {Schema, Types, model} = require('mongoose');

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    readBy: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    from: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromUserName: {
        type: String,
        required: true
    },
    conversation: {
        type: Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
}, { 
    timestamps: true
});

module.exports = model('Message', MessageSchema);