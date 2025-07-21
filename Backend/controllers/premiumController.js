const sequelize = require("../config/database");
const User = require("../models/user");

//This will sent all the users present in the database
exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const requestingUser = await User.findByPk(userId);
    if (!requestingUser || !requestingUser.isPremium) {
      return res
        .status(403)
        .json({ message: "Access denied. Premium users only." });
    }

    User.findAll({
      attributes: [
        [sequelize.col("username"), "username"],
        [sequelize.col("totalExpenses"), "totalExpenses"],
      ],
      order: [[sequelize.col("totalExpenses"), "DESC"]],
    }).then((users) => {
      const result = users.map((user) => ({
        name: user.getDataValue("username"),
        totalExpenses: user.getDataValue("totalExpenses"),
      }));
      res.send(JSON.stringify(result));
    });
  } catch (error) {
    console.log(error);
  }
};