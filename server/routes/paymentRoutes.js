import express from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.js";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Payment Intent (for subscription or one-time payment)
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Payment and Save Payment Info
router.post("/confirm-payment", async (req, res) => {
  const { paymentIntentId, userId, plan, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Save payment information to the database
      const payment = new Payment({
        user: userId,
        plan,
        amount,
        status: "completed",
      });

      await payment.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
