const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
module.exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log("Verify Token", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token.split(" ")[1], process.env.SESSION_SECRET);

    // Attach the decoded user information to the request
    req.user = decoded;
    // console.log("decoded:",decoded);
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};


