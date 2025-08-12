// webhookController.js
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Product = require("../models/Product");

const handlePaystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("ERROR: PAYSTACK_SECRET_KEY is not configured");
      return res.status(500).json({ status: false, message: "Server configuration error" });
    }

    const hash = crypto.createHmac("sha512", secret).update(req.body).digest("hex");
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      console.error("ERROR: Missing Paystack signature header");
      return res.status(400).json({ status: false, message: "Missing signature header" });
    }

    if (hash !== signature) {
      console.error("ERROR: Invalid signature");
      return res.status(400).json({ status: false, message: "Invalid signature" });
    }

    console.log("✓ Signature verification passed");

    // Paystack sends body as Buffer when using express.raw()
    const event = JSON.parse(req.body.toString("utf8"));
    console.log("Event Type:", event.event);

    // Acknowledge webhook first
    res.status(200).json({ received: true });

    // Process the event asynchronously
    if (event.event === "charge.success") {
      await processSuccessfulCharge(event.data);
    }
  } catch (error) {
    console.error("ERROR processing webhook:", error);
  }
};

async function processSuccessfulCharge(data) {
  try {
    console.log("\nProcessing successful charge...");

    // Parse cart items from metadata
    let cartItems = [];
    try {
      cartItems = JSON.parse(data.metadata.cart_items || "[]");
    } catch (err) {
      console.error("Failed to parse cart_items:", err);
    }

    // 1. Save payment to DB
    const paymentExists = await Payment.findOne({ transactionRef: data.reference });
    if (!paymentExists) {
      await Payment.create({
        userId: data.metadata.userId,
        productId: cartItems[0]?._id || null,
        amount: data.amount / 100, // convert from kobo
        currency: data.currency,
        status: "success",
        transactionRef: data.reference,
        paymentGateway: "Paystack",
        paidAt: data.paid_at,
      });
      console.log("✓ Payment saved to database");
    } else {
      console.log("Payment already exists, skipping creation");
    }

    // 2. Update salesCount for each product in cart
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { salesCount: item.quantity || 1 },
      });
      console.log(`✓ Updated sales count for product: ${item.name}`);
    }
  } catch (error) {
    console.error("ERROR in processSuccessfulCharge:", error);
  }
}

module.exports = { handlePaystackWebhook };
