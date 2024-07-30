const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
require("dotenv").config();

const app = express();

app.use(express.json());

// Using this because we are working on the local host itself
app.use(cors());

// ------------------------------- ROUTES ------------------------------------
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// ------------------------------ DATABASE -----------------------------------
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log("Error found", err));

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
