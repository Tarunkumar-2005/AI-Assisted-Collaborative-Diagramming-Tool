const mongoose = require("mongoose");

const diagramSchema = new mongoose.Schema({
  img: {
    type: String, // store image URL or Base64 string
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Diagram", diagramSchema);