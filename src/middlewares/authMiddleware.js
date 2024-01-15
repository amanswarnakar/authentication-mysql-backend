// Middleware to check if the user is logged in
module.exports.checkLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    // If the user is logged in, proceed to the next middleware or route handler
    next();
  } else {
    // If the user is not logged in, redirect or send an unauthorized response
    // res.status(401).json({ error: "Unauthorized - User not logged in" });
    res.redirect("/auth/login");
  }
};

// Middleware to verify JWT token
module.exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token.split(" ")[1], process.env.SESSION_SECRET);
    
    // Attach the decoded user information to the request
    req.user = decoded;
    // console.log(decoded);
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
