const express = require("express");
const { addFlight, createNotification } = require("../controllers/admin");
const { authUser, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Route to add a new flight (admin access required)
router.post("/add", authUser, isAdmin, addFlight);
// Route to create a new notification (admin access required)
router.post("/create", authUser, isAdmin, createNotification);

module.exports = router;
