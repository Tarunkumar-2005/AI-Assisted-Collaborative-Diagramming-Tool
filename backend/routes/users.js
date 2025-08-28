const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

// Register Route
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if username already exists
    const user = await User.findOne({ username: req.body.username });
    if (user)
      return res.status(409).send({ message: "Username already exists!" });

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Save new user
    await new User({ username: req.body.username, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
