/* 
User: {
    firstname,
    lastname,
    email,
    password
}
Post: {
    text,
    imgUrl,
    userId
}
Message: {
    text,
    readBy: [],
    from,
    fromUserNamem
    conversation
}
Conversation: {
    messages: [],
    allUsers: [],
    usersOnline: [],
    lastMessage,
    name
}
*/
// validation
const { body, validationResult } = require('express-validator');
// router
const router = require('express').Router();
// proccessor that turns req.user into id of the currrent user
const checkToken = require("./checkToken");
// Schemas
const User = require('../model/user');
const Message = require('../model/Message');
const Conversation = require('../model/Conversation');
// Conversation

// creating a conv.
router.post('/conversation/direct', checkToken,[
    body('IdOfAnother').isLength({min:24}).exists()
], async (req,res) => {
    try{
        // checking for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array()[0])
            return res.status(400).json({ errors: errors.array()[0] });
        }

        // getting needed info
        const userId = req.user;
        const {IdOfAnother} = req.body;
        
        //checking if the other user exists
        const otherUser = await User.findById(IdOfAnother);
        if(!otherUser){
            res.status(400).json({message: 'Something went wrong with the other participant. Please check if that user can found in search'});
            return ;
        }
        // checking if there is another convo with  this two users
        const exists = await Conversation.find({allUsers: [userId, otherUser]});
        if(exists) {
            res.status(400).json({message: 'you have already DM\'d this person. Try using that convo.'});
            return ;
        }
        // creating new Convo
        const newConvo = new Conversation({
            messages: [],
            allUsers: [userId, otherUser],
            usersOnline: [userId],
            lastMesssage: null,
            name: otherUser.firstname
        })

        await newConvo.save();
        res.status(200).json({message: 'new convo added'})
        return ;
    }
    catch(err){
        res.status(402).json({message: err});
        return ;
    }
})

// Messages