const express = require("express")
const Post = require('../model/post')
const User = require('../model/user')
const Comment = require('../model/Comments')

const router = express.Router()
const checkToken = require("./checkToken")

router.get('/:id',checkToken, async (req, res) => {
    try {
        const data = await Comment.find({ postId: req.params.id }).populate("userId", "firstname lastname avatar _id")
        res.send(data)
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.post('/add', checkToken, async (req, res) => {
    const postData = { ...req.body }
    console.log(req.body)
    postData.userId = req.user
    try {
        const comment = new Comment(postData)
        console.log(comment)
        const data = await comment.save()
        res.send(data)
    } catch (error) {
        res.status(400).send({ error: error })
    }
})
module.exports = router