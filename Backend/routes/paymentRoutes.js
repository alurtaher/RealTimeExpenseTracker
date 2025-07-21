const express = require('express')
const router = express.Router();
const {getPaymentPage,processPayment,getPaymentStatus} = require('../controllers/paymentController')
const authenticate = require('../middleware/auth');

router.get('/',authenticate,getPaymentPage)
router.post('/pay',authenticate,processPayment)
router.get('/payment-status/:orderId',getPaymentStatus)

module.exports = router;