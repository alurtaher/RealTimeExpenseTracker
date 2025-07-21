const Expense = require("../models/expense");
const User = require('../models/user')

exports.addExpense = async (req, res) => {
  
  try {
    const { amount, description, category } = req.body;
    const UserId = req.user.id;
    // const t = await sequelize.transaction();

    await User.update(
      {
        totalExpenses: req.user.totalExpenses + Number(amount),
      },
      { where: { id: UserId } },
      // { transaction: t }
    );

    const expense = await Expense.create({
      amount,
      description,
      category,
      UserId,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expenseId = req.params.expenseId; // or req.body.id if sent in body
    const UserId = req.user.id;

    const [updated] = await Expense.update(
      { amount, description, category },
      {
        where: {
          id: expenseId,
          UserId: UserId,
        },
      }
    );

    if (updated) {
      const updatedExpense = await Expense.findOne({
        where: {
          id: expenseId,
          UserId: UserId,
        },
      });
      return res.status(200).json(updatedExpense);
    }

    res.status(404).json({ message: "Expense not found or not owned by user" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const userId = req.user.id;

    const deleted = await Expense.destroy({
      where: {
        id: expenseId,
        UserId: userId
      }
    });

    if (deleted) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found or unauthorized" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};