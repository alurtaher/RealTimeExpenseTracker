const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const premiumController = require('../controllers/premiumController')

router.get('/getAllUsers',authenticate,premiumController.getAllUsers)

module.exports = router;