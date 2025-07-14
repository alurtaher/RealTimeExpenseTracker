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

// Get all users
/*exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await User.destroy({
      where: { id: userId }
    });

    if (deleted) {
      res.json({ message: `User with ID ${userId} deleted successfully.` });
    } else {
      res.status(404).json({ error: `User with ID ${userId} not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};*/
