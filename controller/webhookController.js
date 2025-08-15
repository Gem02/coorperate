const crypto = require("crypto");
const Payment = require("../models/paymentSchema");
const Product = require("../models/Product");
const User = require("../models/User");
const Commission = require("../models/Commission");
const Wallet = require("../models/Wallet");

const handlePaystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("ERROR: PAYSTACK_SECRET_KEY is not configured");
      return res.status(500).json({ status: false, message: "Server configuration error" });
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");

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

    const event = JSON.parse(req.body.toString("utf8"));
    console.log("Event Type:", event.event);

    res.status(200).json({ received: true }); // Respond early

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

    if (!data.metadata || !data.metadata.userId) {
      console.error("No userId in metadata, skipping processing");
      return;
    }

    let cartItems = [];
    try {
      cartItems = JSON.parse(data.metadata.cart_items || "[]");
    } catch (err) {
      console.error("Failed to parse cart_items:", err);
    }

    // 1. Save payment if not exists
    const paymentExists = await Payment.findOne({ transactionRef: data.reference });
    if (!paymentExists) {
      await Payment.create({
        userId: data.metadata.userId,
        productId: cartItems[0]?._id || null,
        amount: data.amount / 100,
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

    // 2. Update sales count
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { salesCount: item.quantity || 1 },
      });
      console.log(`✓ Updated sales count for product: ${item.name}`);
    }

    // 3. Commission logic + Wallet update
    const buyer = await User.findById(data.metadata.userId).lean();
    if (!buyer) {
      console.error("Buyer not found, skipping commission");
      return;
    }

    let commissionTarget = null;
    let commissionSourceType = null;

    if (buyer.ambassadorId) {
      commissionTarget = buyer.ambassadorId;
      commissionSourceType = "referral";
    } else if (buyer.managerId) {
      commissionTarget = buyer.managerId;
      commissionSourceType = "sale";
    }

    if (commissionTarget) {
      const commissionAmount = (data.amount / 100) * 0.10;

      const existingCommission = await Commission.findOne({ sourceId: data.reference });
      if (!existingCommission) {
        // Save commission
        await Commission.create({
          userId: commissionTarget,
          sourceType: commissionSourceType,
          sourceId: data.reference,
          amount: commissionAmount,
          status: "approved", // instantly approved since payment is confirmed
        });

        // Update wallet (no upsert — we assume it exists now)
        const updatedWallet =  await Wallet.findOneAndUpdate(
          { userId: commissionTarget },
          {
            $inc: { balance: commissionAmount },
            $push: {
              transactions: {
                type: "credit",
                amount: commissionAmount,
                description: `Commission from ${commissionSourceType}`,
                createdAt: new Date()
              }
            }
          },
          { upsert: true, new: true }
        );

        if (!updatedWallet) {
          console.error(`Wallet not found for user ${commissionTarget}`);
        } else {
          console.log(`✓ Commission recorded & wallet updated: ₦${commissionAmount}`);
        }
      } else {
        console.log("Commission already exists for this transaction, skipping");
      }
    }

  } catch (error) {
    console.error("ERROR in processSuccessfulCharge:", error);
  }
}

module.exports = { handlePaystackWebhook };
