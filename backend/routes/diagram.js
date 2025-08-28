const express = require("express");
const router = express.Router();
const Diagram = require("../models/Diagram");
const {User} = require("../models/user");

// Save diagram for a user
router.post("/save/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { img } = req.body;

    // 1. Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Save diagram
    const newDiagram = new Diagram({
      img,
      user: userId
    });

    await newDiagram.save();

    res.status(201).json({ message: "Diagram saved successfully", diagram: newDiagram });
  } catch (error) {
    console.error("Error saving diagram:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all diagrams of a user
router.get("/user/:userId", async (req, res) => {
  try {
    const diagrams = await Diagram.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(diagrams);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//delete diagram
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const diagram = await Diagram.findByIdAndDelete(id);
    if (!diagram) return res.status(404).json({ message: "Diagram not found" });
    res.status(200).json({ message: "Diagram deleted successfully" });
  } catch (error) {
    console.error("Error deleting diagram:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
