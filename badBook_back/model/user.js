const mongoose = require("mongoose")
const schema = mongoose.Schema

const userSchema = new schema({
    firstname: {
        type: String,
    },
    lastname: {
    	type: String,
    },
    email: {
    	type: String,
    },


    notificationToken:{
        type: String,
        default: ""
    },


    password:{
        type: String,
    },
    avatar: {
        type: String,
        default: "https://tipsmake.com/data/thumbs/how-to-hide-facebook-profile-picture-thumb-EhRnrBzAY.jpg"
    },
    info:{
        type: String,
        default: "no information about user"
    }
})

module.exports = mongoose.model("User", userSchema)