const express = require("express");
const { register, login, getFlightById } = require("../controllers/user");

// Middleware for authentication
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/flights/:flight_id", authUser, getFlightById);

module.exports = router;
