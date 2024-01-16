const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");

const errorHandlers = require("./handlers/errorHandlers");
const authController = require("./controllers/authController");

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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const authRouter = require("./routes/auth");
const { verifyToken } = require("./middlewares/authMiddleware");

app.use("/auth", authRouter);

app.get("/", verifyToken, authController.verifyUser);

app.use(errorHandlers.notFound);

app.listen(PORT, () => {
  console.log(`🚀 App running on Port ${PORT}`);
});
