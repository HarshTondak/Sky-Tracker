const mongoose = require("mongoose");
require("dotenv").config();
const Flight = require("../models/Flight");
const FlightData = require("../data/FlightData"); // Path to your FlightData file

const feedFlightData = async () => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
      .then(() => console.log("Database Connected Successfully"))
      .catch((err) => console.log("Error found", err));

    // Insert flight data
    const result = await Flight.insertMany(FlightData);
    console.log("Flight data inserted:", result);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Error inserting flight data:", error);
  }
};

feedFlightData();
