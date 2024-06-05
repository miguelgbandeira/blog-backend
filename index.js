const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

app.listen(3000, () => console.log("app listening on port 3000!"));
