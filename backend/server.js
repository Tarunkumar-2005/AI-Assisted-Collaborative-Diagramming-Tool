const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/auth.routes.js");
// const diagramRoutes = require("./routes/diagram.routes.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow base64 image upload

// routes
app.use("/api/auth", userRoutes);
// app.use("/api/diagrams", diagramRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
