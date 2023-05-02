const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

// sign up route
router.post("/signup", async (req, res) => {
  // logic
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("Email already in use");
    }

    const user = new User({ name, email, password });
    await user.save();

    req.session.userId = user._id;
    res.status(201).send("User created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password.");
    }
  
    req.session.userId = user._id;
    res.redirect("/members");
  });
  

// sign out route
router.post("/signout", (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send("Logged out");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
});

module.exports = router;
