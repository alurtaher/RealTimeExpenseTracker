const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authentication = require('../middleware/auth');

router.get('/get', authentication.authenticate, expenseController.getExpenses);
router.post('/add', authentication.authenticate, expenseController.addExpense);
router.put('/update-expense/:expenseId', authentication.authenticate, expenseController.updateExpense);
router.delete('/delete/:expenseId', authentication.authenticate, expenseController.deleteExpense);

module.exports = router;