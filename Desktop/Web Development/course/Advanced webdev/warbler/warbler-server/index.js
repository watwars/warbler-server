require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const errorHandler = require("./handlers/error");
const {loginRequired, ensureCorrectUser} = require('./middleware/auth')

//importing routes
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const db = require("./models");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/messages", loginRequired, async function(req, res, next){
  try{
    let messages = await db.Message.find().sort({createdAt: "desc"}).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(messages);
  }catch(e){
    return next(e);
  }
});

app.use('/api/auth', authRoutes)
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messagesRoutes)



//error handling
app.use(function (req, res, next) {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
