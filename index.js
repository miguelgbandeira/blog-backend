const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");

const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");

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
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({ extended: false }));
const hashedPassword = async () => {
  return await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
};

const createUser = async () => {
  try {
    const password = await hashedPassword();
    const userExists = await User.findOne({ username: "admin" }).exec();

    if (userExists) {
      console.log("Admin user already exists");
    } else {
      const user = new User({
        first_name: "Miguel",
        last_name: "Bandeira",
        username: "admin",
        password: password,
      });

      await user.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createUser().catch((err) => console.error("Error creating admin user:", err));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/login", authRouter);
app.use("/posts", postsRouter);
app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000, () => console.log("app listening on port 3000!"));
