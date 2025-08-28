const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login Route
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.status(401).send({ message: "Invalid Username or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Username or Password" });

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
    );

    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
