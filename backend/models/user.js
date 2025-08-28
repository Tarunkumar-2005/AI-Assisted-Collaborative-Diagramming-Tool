const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// JWT method
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Validation
const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().label("Username"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
