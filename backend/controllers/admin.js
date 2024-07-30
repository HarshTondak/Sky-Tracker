const Notification = require("../models/Notification");
const Flight = require("../models/Flight");
const { v4: uuidv4 } = require("uuid");

// Controller function to add a new flight
exports.addFlight = async (req, res) => {
  try {
    const {
      flight_id,
      airline,
      status,
      departure_gate,
      arrival_gate,
      scheduled_departure,
      scheduled_arrival,
      actual_departure,
      actual_arrival,
    } = req.body;

    // Validate input data
    if (
      !flight_id ||
      !airline ||
      !status ||
      !departure_gate ||
      !arrival_gate ||
      !scheduled_departure ||
      !scheduled_arrival
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Check if the flight_id already exists
    const existingFlight = await Flight.findOne({ flight_id });
    if (existingFlight) {
      return res
        .status(400)
        .json({ message: "Flight with this ID already exists." });
    }

    // Create a new flight document
    const newFlight = new Flight({
      flight_id,
      airline,
      status,
      departure_gate,
      arrival_gate,
      scheduled_departure,
      scheduled_arrival,
      actual_departure,
      actual_arrival,
    });

    // Save the flight to the database
    await newFlight.save();

    res.status(201).json({
      message: "Flight added successfully.",
      flight: newFlight,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { flight_id, message, timestamp } = req.body;

    // Validate flight_id
    const flight = await Flight.findById(flight_id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    // Generate a new notification_id using UUID
    const notification_id = uuidv4();

    // Create a new notification
    const notification = new Notification({
      notification_id,
      flight_id,
      message,
      timestamp,
    });

    await notification.save();

    res.status(201).json({
      message: "Notification created successfully.",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
