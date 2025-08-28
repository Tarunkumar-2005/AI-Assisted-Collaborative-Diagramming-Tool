const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Login Route
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.status(401).send({ message: "Invalid Username or Password" });
    
    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Username or Password" });

    // Generate JWT token
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully", userid: user._id });
    // console.log(user._id);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Validation schema
const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
