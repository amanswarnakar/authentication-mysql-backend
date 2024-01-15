const db = require("../database/index.js");
const { isEmail, checkUsername } = require("../validations/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const queryDatabase = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Utility functions for Register

// function to hash a password
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

const checkIfUsernameExists = (username) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  const values = [username];
  return queryDatabase(sql, values);
};

const checkIfEmailExists = (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const values = [email];
  return queryDatabase(sql, values);
};

const insertUserIntoDatabase = (username, email, password) => {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  const values = [username, email, password];
  return queryDatabase(sql, values);
};

// Utility functions for Login

const getUserFromDatabase = (userOrEmail, email) => {
  const sql = `SELECT * FROM users WHERE ${userOrEmail} = ?`;
  const values = [email];
  return queryDatabase(sql, values);
};

const compareHashedPassword = (req, res, result) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(req.body.password, result[0].password, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports.registerController = async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!isEmail(email)) {
      res.status(203).send({
        msg: "Invalid email",
      });
      return;
    }

    /* This is checking if the username is valid. */
    if (!checkUsername(username)) {
      res.status(203).send({
        msg: "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.",
      });
      return;
    }

    /* This is checking if the password is at least 8 characters long. */
    if (password.length < 8) {
      return res.status(203).send({
        msg: "Password must be at least 8 characters long.",
      });
    }

    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists.length > 0) {
      return res.status(203).send({
        msg: "Username already registered",
      });
    }

    const emailExists = await checkIfEmailExists(email);
    if (emailExists.length > 0) {
      return res.status(203).send({
        msg: "Email already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    await insertUserIntoDatabase(username, email, hashedPassword);

    // Generate JWT token
    const token = jwt.sign({ username: username }, process.env.SESSION_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({
      msg: "User successfully registered",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.loginController = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    // const password = req.body.password;
    // Password is taken from request http object in the compareHashedPassword function
    var userOrEmail = "username";

    /* This is checking if the email or username. */
    if (isEmail(email)) {
      userOrEmail = "email";
    } else {
      if (!checkUsername(email)) {
        res.status(203).send({
          msg: "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.",
          code: 102,
        });
        return;
      }
    }

    const result = await getUserFromDatabase(userOrEmail, email);

    // console.log(result);

    if (result.length > 0) {
      const passwordMatch = await compareHashedPassword(req, res, result);
      if (!passwordMatch) {
        res.status(203).send({
          msg: "Incorrect password",
        });
      } else {
        // if (req.session.user) {
        //   res.status(200).send({
        //     user: req.session.user,
        //   });
        // } else {
        //   console.log("User not logged in");
        //   req.session.user = {
        //     userID: result[0].userID,
        //     id: result[0].id,
        //     username: result[0].username,
        //     email: result[0].email,
        //     loggedIn: true,
        //   };

        //! Make sessions table and access from cookies
        // getSessionIDCookie(req, res);
        // creatSessionOnDB(req);

        // Generate JWT token
        const token = jwt.sign(
          { user: email },
          process.env.SESSION_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).send({
          msg: "Login successful",
          token: token,
        });
        // }
      }
    } else {
      res.status(203).send({
        msg: "User not registered",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
