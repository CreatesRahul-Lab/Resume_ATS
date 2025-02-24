import express from "express";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Payment Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new Payment({
      user: req.user.id,
      plan,
      amount,
      status: "pending",
    });
    await payment.save();

    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  const { paymentId } = req.body;
  try {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

export default router;
