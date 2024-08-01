const bcrypt = require("bcrypt");
const User = require("../models/User");
const Flight = require("../models/Flight");
const Notification = require("../models/Notification");
const { generateToken } = require("../helpers/tokens");
const { validateUsername } = require("../helpers/validation");

// Function to register new users
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const checkExistingID = await User.findOne({ email });
    if (checkExistingID) {
      return res.status(400).json({
        message:
          "This Email address already exists, try with a different email address",
      });
    }

    // Encrypting the Passwords (using BCrypt)
    // Here, 12 is the salt value, greater the salt value is more harder is the encryption method
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Validate Usernames (usernames are made using first + last name)
    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);

    // Check if the new username is "Admin"
    if (newUsername === "Admin") {
      // Check if there's already an admin
      const existingAdmin = await User.findOne({ username: "Admin" });
      if (existingAdmin) {
        return res.status(400).json({
          message: "You cannot register as 'Admin'",
        });
      }
    } else {
      // Ensure that no other user can use the username "Admin"
      const adminUser = await User.findOne({ username: "Admin" });
      if (adminUser && newUsername === "Admin") {
        return res.status(400).json({
          message: "You cannot register as 'Admin'",
        });
      }
    }

    // Creating a new User
    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUsername,
    }).save();

    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to Login the accounts of new users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking the email id
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "The Email address you entered is not connected to an account.",
      });
    }

    // Checking the password
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again!",
      });
    }

    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Controller function to get flight details by flight_id
// exports.getFlightById = async (req, res) => {
//   try {
//     const { flight_id } = req.params;
//     fid = flight_id.replace(/-/g, " ");

//     const flight = await Flight.findOne({ flight_id: fid });

//     if (!flight) {
//       return res.status(500).json({
//         message: "Flight not found.",
//       });
//     }

//     res.json(flight);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Controller function to get flight details by flight_id and fetch all notifications
exports.getFlightById = async (req, res) => {
  try {
    const { flight_id } = req.params;
    const formattedFlightId = flight_id.replace(/-/g, " "); // Format the flight_id

    // Fetch flight details
    const flight = await Flight.findOne({ flight_id: formattedFlightId });

    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    // Fetch notifications for the flight and sort by timestamp in descending order
    const notifications = await Notification.find({
      flight_id: formattedFlightId,
    }).sort({ timestamp: -1 }); // Sort notifications by timestamp in descending order

    // Combine flight details and notifications
    const result = {
      flight,
      notifications,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
