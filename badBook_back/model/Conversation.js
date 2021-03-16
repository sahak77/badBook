const {Schema, Types, model} = require('mongoose');

const ConveresationSchema = new Schema({
    messages: [{
        type: Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    allUsers: [{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }],
    usersOnline: [{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: Types.ObjectId,
        ref: 'Message',
    },
    name: {
        type: String,
        required: true,
        maxlength: 15
    }
},{
    timestamps: true
});

module.exports = model('Conversation', ConveresationSchema)