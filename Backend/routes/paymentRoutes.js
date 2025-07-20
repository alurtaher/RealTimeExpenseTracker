const express = require('express')
const router = express.Router();
const {getPaymentPage,processPayment,getPaymentStatus} = require('../controllers/paymentController')
const authentication = require('../middleware/auth');

router.get('/',authentication.authenticate,getPaymentPage)
router.post('/pay',authentication.authenticate,processPayment)
router.get('/payment-status/:orderId',getPaymentStatus)

module.exports = router;