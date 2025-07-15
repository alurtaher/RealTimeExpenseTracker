const User = require("../models/user");
const bcrypt = require("bcrypt");

// Add a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const isPresent = await User.findOne({ where: { email: email } });

    if (isPresent === null) {
      // Hash the password with salt rounds = 10
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      // const { id, username, email } = newUser;
      // return res.status(201).json({ id, username, email });
      // avoid redeclaring username and email
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    }
    return res.status(400).json({ message: "User already exists" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Login user by email and password
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register." });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // If all good, respond success
      const { id, username } = user;
      return res.status(200).json({
        message: "Login successful.",
        username,
        id
      });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};