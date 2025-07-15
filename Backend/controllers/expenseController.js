const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const UserId = req.params.userId;
    console.log(req.params);
    const expense = await Expense.create({ amount, description, category, UserId });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.params.userId } });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const UserId = req.params.userId;

    const [updated] = await Expense.update(
      { amount, description, category },
      { where: { UserId : UserId} }
    );

    if (updated) {
      const updatedExpense = await Expense.findOne({ where: { UserId: UserId } })
      return res.status(200).json(updatedExpense);
    }

    res.status(404).json({ message: "Expense not found" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.userId;
    await Expense.destroy({ where: {UserId: id } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};