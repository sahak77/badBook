const express = require("express")
const Post = require('../model/post')
const checkToken = require("./checkToken")
const moment = require('moment'); 

const router = express.Router()

router.get('/posts/:limit', async (req, res) => {
    try {
        const data = await Post.find().populate("userId", "firstname lastname email notificationToken avatar info _id").limit(parseInt(req.params.limit))
        res.send(data)
    }
    catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.delete('/delete/:id', checkToken, async (req, res) => {
    const data = await Post.findById(req.params.id)
    if (data.userId._id == req.user) {
        await Post.deleteOne({ _id: req.params.id }, function (err) {
            if (err) {
                return handleError(err);
            }
            res.send("all right")
        });
    }
    else {
        res.send("<h1>error</h1>")
    }
})
router.get('/userpost', checkToken, async (req, res) => {
    try {
        const data = await Post.find({ userId: req.user }).populate("userId", "firstname lastname email notificationToken avatar info _id")
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" })
    }
})
//guest posts
router.get('/user/:userId', checkToken, async (req, res) => {
    try {
        const data = await Post.find({ userId: req.params.userId }).populate("userId", "firstname lastname email notificationToken avatar info _id")
        console.log(data)
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.post('/add', checkToken, async (req, res) => {
    const postData = { ...req.body }
    postData.userId = req.user
    try {
        const post = new Post(postData)
        const data = await post.save()
        res.send(data)
    }
    catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.delete('/delete/:id', checkToken, async (req, res) => {
    const data = await Post.findById(req.params.id)
    if (data.userId._id == req.user) {
        await Post.deleteOne({ _id: req.params.id }, function (err) {
            if (err) {
                return handleError(err);
            }
            res.send("all right")
        });
    }
    else {
        res.send("<h1>error</h1>")
    }
})
router.patch("/update/:id", checkToken ,async (req, res) => {
    const postData = { ...req.body }
    const data = await Post.findById(req.params.id)
    console.log(data.userId._id, req.user);
    try {
        if (data.userId._id == req.user) {
            await Post.updateOne({ _id: req.params.id }, {
                imgUrl: postData.imgUrl,
                text: postData.text,
                date: moment().format("lll")
            }, (err, res) => {
                if (err) {
                    return handleError(err);
                }
            });
            return res.send("sax lava")
        }
        else {
            res.send("<h1>error</h1>")
        }
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})





///like / unlike

router.put('/like/:id', checkToken, (req, res) => {
    console.log(req.user)
    Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike/:id', checkToken, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

module.exports = router