const User = require("../models/user");

// Add a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const isPresent = await User.findOne({ where: { email: email } });
   
    if (isPresent === null) {
      const newUser = await User.create({ username, email, password });
      return res.status(201).json(newUser);
    }
    return res.status(400).json({message:"User already exists"});
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" }, error);
  }
};

// Login user by email and password
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // If all good, respond success 
    const { id, username } = user;
    return res.status(200).json({
      message: "Login successful.",
      user: { id, username, email }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};