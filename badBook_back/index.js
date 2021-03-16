const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config')

const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');


// const PORT = config.get('PORT');
const app = express();

// some rules for API
app.use(cors());
app.use(bodyParser.json());

// configuring the routes
app.use("/auth" , authRoute);
app.use("/posts" , postsRoute);
app.use("/comment", commentRoute)


// starting sever
const PORT = process.env.PORT || 3333
app.listen(PORT, (req,res)=>{
    console.log(`server started on port: ${PORT}`);
})

// connecting mongo
mongoose.connect(config.get('MongoUrl'), 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
}, ()=>{
    console.log("db connected");
});
