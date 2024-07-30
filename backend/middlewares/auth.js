const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authUser = async (req, res, next) => {
  try {
    // Retrieve the token from the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing." });
    }

    // Extract the token from the header
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    if (!token) {
      return res.status(401).json({ message: "Token is missing." });
    }

    // Verify the token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid authentication token." });
      }
      // Attach the user info to the request object
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.username === "Admin") {
      return next();
    }

    return res.status(403).json({ message: "Access denied. Admins only." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
