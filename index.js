const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");

const initializePassport = require("./config/passport-config");
initializePassport(passport);

const mongoDb = process.env.MONGO_CONNECTION;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.use("/posts", postsRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
