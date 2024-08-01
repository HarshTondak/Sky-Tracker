const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const Flight = require("../models/Flight"); // Adjust the path as needed
const Notification = require("../models/Notification"); // Adjust the path as needed

// Array of possible message templates
const messageTemplates = [
  "Your flight {flightId} is on time. Departure gate: {gate}.",
  "Flight {flightId} is now boarding at gate {gate}.",
  "Flight {flightId} has been delayed. New departure time: {time}.",
  "Flight {flightId} gate has changed. New gate: {gate}.",
  "Reminder: Your flight {flightId} departs in 2 hours.",
  "Flight {flightId} is now ready for boarding at gate {gate}.",
  "Weather delay for flight {flightId}. Please check the departure board.",
  "Flight {flightId} has been cancelled. Please contact customer service.",
  "Baggage claim for flight {flightId} will be at carousel {carousel}.",
  "Flight {flightId} is expected to arrive 15 minutes early.",
];

// Array of possible gates
const gates = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
  "D1",
  "D2",
  "D3",
  "D4",
  "E1",
  "E2",
  "E3",
  "E4",
];

// Function to generate a random time
function getRandomTime() {
  const hours = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Main function to generate notifications
async function generateNotifications() {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
      .then(() => console.log("Database Connected Successfully"))
      .catch((err) => console.log("Error found", err));

    // Get all flights from the database
    const flights = await Flight.find({});

    for (let flight of flights) {
      const messageTemplate =
        messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      const gate = gates[Math.floor(Math.random() * gates.length)];
      const time = getRandomTime();
      const carousel = Math.floor(Math.random() * 10) + 1;

      let message = messageTemplate
        .replace("{flightId}", flight.flight_id)
        .replace("{gate}", gate)
        .replace("{time}", time)
        .replace("{carousel}", carousel);

      const notification = new Notification({
        notification_id: uuidv4(),
        flight_id: flight.flight_id,
        message: message,
        timestamp: new Date(),
      });

      await notification.save();
      console.log(`Generated notification for flight ${flight.flight_id}`);
    }

    console.log("Finished generating notifications");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error generating notifications:", error);
    mongoose.connection.close();
  }
}

generateNotifications();
