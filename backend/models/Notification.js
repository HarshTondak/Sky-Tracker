const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    required: true,
    unique: true,
  },
  flight_id: {
    type: mongoose.Schema.Types.String,
    ref: "Flight",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
