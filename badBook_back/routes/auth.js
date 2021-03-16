const express = require('express')
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require("../model/user")
const checkToken = require("./checkToken");

const { body, validationResult } = require('express-validator');

router.post('/registration', [
    body('firstname').not().isEmpty().withMessage('firstname is required'),
    body('lastname').not().isEmpty().withMessage('lastname is required'),
    body('email').isEmail().withMessage('invalid email addres')
        .custom(async (value) => {
            return await User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already exist');
                }
            });
        }),
    body('password').isLength({ min: 6 }).withMessage('must be at least 6 chars long')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = new User({ ...req.body })
        const hash = await bcrypt.hash(req.body.password, 10)
        user.password = hash;
        await user.save()
        res.send(user)
    } catch (e) {
        res.send(e)
    }
})

router.post('/login', [
    body('email')
        .custom(async (value) => {
            return await User.findOne({ email: value }).then(user => {
                if (!user) {
                    return Promise.reject('Please register, this email doesnt exist');
                }
            });
        }),
    body('password')
        .custom(async (value, { req }) => {
            const emailExist = await User.findOne({ email: req.body.email })
            console.log(emailExist);
            console.log(req.body.email);
            return await bcrypt.compare(value, emailExist.password).then(pass => {
                if (!pass) {
                    return Promise.reject("Please input right password");
                }
            });
        }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const emailExist = await User.findOne({ email: req.body.email })
        // if (!emailExist) {
        //     return res.status(400).send({ error: "Please register, this email doesn't exist" })
        // } 
        // const samePassword = await bcrypt.compare(req.body.password, emailExist.password)
        // if (!samePassword) {
        //     return res.status(400).send({ error: "Please input right password" })
        // }
        const token = jwt.sign({ id: emailExist._id }, 'pult77');
        res.send({ token: token, id: emailExist._id })
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.get("/profile", checkToken, async (req, res) => {
    try {
        const data = await User.findById(req.user)
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Something went wrong" })
    }
})
router.get("/users", checkToken, async (req, res) => {
    try {
        const data = await User.find()
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Something went wrong" })
    }
})

router.patch("/profile/pass/:id", [
    body('oldPassword')
    .custom(async (value, { req }) => {
        const emailExist = await User.findById(req.params.id)
        console.log(req.params.id);
        return await bcrypt.compare(value, emailExist.password).then(pass => {
            if (!pass) {
                return Promise.reject("Please input right password");
            }
        });
    }),
    body('newPassword').isLength({ min: 6 }),
    body("repeatPassword").custom(async (value, {req}) =>{
        console.log(req.body.newPassword);
        if (value != req.body.newPassword) {
            return Promise.reject("Please input right password");
        }
    })
],checkToken, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const data = await User.findById(req.user)
    const samePassword = await bcrypt.compare(req.body.oldPassword, data.password)
    console.log(samePassword);
    try {
        if (!samePassword) {
            return res.status(400).send({ error: "Please input right password" })
        }
        else {
            const hash = await bcrypt.hash(req.body.newPassword, 10)
            if (data._id == req.user) {
                await User.updateOne({ _id: req.user }, {
                    password: hash
                }, (err, res) => {
                    if (err) {
                        return handleError(err);
                    }
                });
                return res.send({})
            }
            else {
                res.send("<h1>error</h1>")
            }
        }
    }
    catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }

})
router.patch("/updateUserInfo/:id", [
    body('firstname').not().isEmpty(),
    body('lastname').not().isEmpty(),
    body('email').isEmail()
        .custom(async (value, { req }) => {
            const userEmail = await User.findById(req.params.id)
            return await User.findOne({ email: value }).then((user) => {
                if (user && userEmail.email !== value) {
                    return Promise.reject('E-mail already exist');
                }
            });
        }),
], checkToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userData = { ...req.body }
    const data = await User.findById(req.params.id)
    console.log(data._id, req.user);
    try {
        if (data._id == req.user) {
            await User.updateOne({ _id: req.params.id }, {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                avatar: userData.avatar,
                info: userData.info,
            }, (err, res) => {
                if (err) {
                    return handleError(err);
                }
            });
            return res.send({})
        }
        else {
            res.send("<h1>error</h1>")
        }
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})




router.patch("/setNotificationToken", checkToken, async (req, res) => {
    const userData = { ...req.body }
    const data = await User.findById(req.user)
    console.log(data._id, req.user);
    try {
        if (data._id == req.user) {
            await User.updateOne({ _id: req.user }, {
                notificationToken: userData.notificationToken,
            }, (err, res) => {
                if (err) {
                    return handleError(err);
                }
            });
            return res.send("exav")
        }
        else {
            res.send("<h1>error</h1>")
        }
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }
})


module.exports = router