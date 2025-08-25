// routes/diagramRoutes.js
const express = require("express");
const router = express.Router();
const Diagram = require("../models/Diagram");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "secret_key"); // use your JWT_SECRET
    req.user = decoded.id; // store user id from token
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

// Save diagram
router.post("/save", auth, async (req, res) => {
  try {
    const { img } = req.body;

    if (!img) return res.status(400).json({ error: "Image data is required" });

    const diagram = new Diagram({
      img,
      user: req.user
    });

    await diagram.save();

    res.json({ message: "Diagram saved successfully", diagram });
  } catch (error) {
    console.error("Error saving diagram:", error);
    res.status(500).json({ error: "Failed to save diagram" });
  }
});

// Get diagrams of logged in user
router.get("/my-diagrams", auth, async (req, res) => {
  try {
    const diagrams = await Diagram.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(diagrams);
  } catch (error) {
    console.error("Error fetching diagrams:", error);
    res.status(500).json({ error: "Failed to fetch diagrams" });
  }
});

module.exports = router;
