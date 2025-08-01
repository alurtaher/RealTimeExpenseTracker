const cashfreeService = require("../services/cashfreeService");
const Order = require("../models/order");
const user = require("../models/user");

// Create Order
exports.processPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Check if user is already premium
    const existingUser = await user.findByPk(userId);
    if (existingUser && existingUser.isPremium) {
      return res.status(200).json({
        message: "You are already premium User.",
        isPremium: true,
      });
    }

    // Proceed with new order creation
    const orderId =
      "order_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const orderAmount = 2000.0;
    const customerPhone = "8499089094";

    // ✅ Create DB Order and store result
    const order = await Order.create({
      order_id: orderId,
      status: "PENDING",
      UserId: userId,
    });

    // ✅ Optional safety check
    if (!order || !order.id) {
      console.error("❌ Order creation failed — missing ID");
      return res.status(500).json({ message: "Order creation failed" });
    }

    // ✅ Proceed with payment
    const paymentSessionId = await cashfreeService.createOrder({
      orderId,
      orderAmount,
      userId,
      customerPhone,
      dbOrderId: order.id.toString(), // optional if you want to track DB order ID
    });

    res.status(201).json({ paymentSessionId,orderId});
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create payment session" });
  }
};

// Check Payment Status
exports.getPaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = await cashfreeService.getPaymentStatus(orderId);

    // Update Order table based on result
    const order = await Order.findOne({ where: { order_id: orderId } });
    if (order) {
      await order.update({ status });
      if (status === "Success") {
        // Make user premium
        const user = await order.getUser();
        user.isPremium = true;
        await user.save();
      }
    }
    return res.json({status})
  } catch (error) {
    console.error("Error fetching payment status:", error);
    await Order.update({ status: "FAILED" });
    res
      .status(500)
      .json({ message: "Error fetching payment status", status: "Failed" });
  }
};

// Render Payment Page (Optional)
exports.getPaymentPage = async (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Make Payment</title>
        <script src="https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js"></script>
      </head>
      <body>
        <h1>Click to Pay</h1>
        <button onclick="payNow()">Pay</button>
        <script>
          async function payNow() {
            const response = await fetch('/payment/pay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            const cashfree = new Cashfree(data.paymentSessionId);
            cashfree.redirect({ redirectTarget: "_self" });
          }
        </script>
      </body>
    </html>
  `);
};
