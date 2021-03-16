const mongoose = require('mongoose');
const moment = require('moment'); 

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false,
    },
    imgUrl: {
        type: String,
        maxlength: 1500,
        minlength: 2,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        text: String,
        postedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    date: {
        type: String,
        default: moment().format('lll')
    },
})

module.exports = mongoose.model('Post', postSchema)