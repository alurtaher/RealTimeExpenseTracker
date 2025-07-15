const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/get/:userId', expenseController.getExpenses);
router.post('/add/:userId', expenseController.addExpense);
router.put('/update-expense/:userId',expenseController.updateExpense)
router.delete('/delete/:userId', expenseController.deleteExpense);

module.exports = router;