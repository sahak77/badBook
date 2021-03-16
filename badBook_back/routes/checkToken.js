const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.header("token")
    if (!token) {
        res.status(400).send({error: "Access denied"})
        return;
    }
    try {
        const verifyToken = jwt.verify(token, 'pult77');
        console.log(verifyToken);
        req.user = verifyToken.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "invalid token"});
    }
}