const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/auth'); // ✅ directly import the function

router.get('/get', authenticate, expenseController.getExpenses); // ✅ use the function directly
router.post('/add', authenticate, expenseController.addExpense);
router.put('/update-expense/:expenseId', authenticate, expenseController.updateExpense);
router.delete('/delete/:expenseId', authenticate, expenseController.deleteExpense);

module.exports = router;