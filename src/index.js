const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
// const session = require("express-session");

const errorHandlers = require("./handlers/errorHandlers");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({
//     key: "userId",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     // cookie:{
//     //     expires:60*60*60*24,
//     // }
//   })
// );

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const authRouter = require("./routes/auth");
const { verifyToken } = require("./middlewares/authMiddleware");

app.use("/auth", authRouter);

app.get("/", verifyToken, (req, res) => {
  // Access the decoded user information from req.user
  const { username } = req.user;
  console.log(req);
  res.status(200).json({
    message: `Protected route accessed by ${username}.`,
    isLoggedIn: true,
  });
});

app.use(errorHandlers.notFound);

app.listen(PORT, () => {
  console.log(`🚀 App running on Port ${PORT}`);
});