const crypto = require("crypto");
const Payment = require("../models/paymentSchema");
const Product = require("../models/Product");
const User = require("../models/User");
const Commission = require("../models/Commission");
const Wallet = require("../models/Wallet");
const Sale = require("../models/Sale"); 

const handlePaystackWebhook = async (req, res) => {
  try {
    // 1. Verify Paystack signature
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

    // 2. Parse event data
    const event = JSON.parse(req.body.toString("utf8"));
    console.log("Event Type:", event.event);

    // 3. Respond early to prevent timeout
    res.status(200).json({ received: true });

    // 4. Process successful charges
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

    // Validate metadata
    if (!data.metadata || !data.metadata.userId) {
      console.error("No userId in metadata, skipping processing");
      return;
    }

    // Parse cart items
    let cartItems = [];
    try {
      cartItems = JSON.parse(data.metadata.cart_items || "[]");
    } catch (err) {
      console.error("Failed to parse cart_items:", err);
    }

    // 1. Save payment record
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
    }

    
    // 2. Process each product in cart
    const buyer = await User.findById(data.metadata.userId).lean();
    if (!buyer) {
      console.error("Buyer not found, skipping commission");
      return;
    }

    for (const item of cartItems) {
      // Update product sales count
      await Product.findByIdAndUpdate(item._id, {
        $inc: { salesCount: item.quantity || 1 },
      });

      // NEW: Record sale
      const saleAmount = item.price * (item.quantity || 1);
      const commissionAmount = saleAmount * 0.10; // 10% commission

      await Sale.create({
        productId: item._id,
        userId: data.metadata.userId,
        ambassadorId: buyer.ambassadorId,
        managerId: buyer.managerId,
        saleAmount: saleAmount,
        commissionAmount: commissionAmount,
        saleDate: new Date(),
        paymentReference: data.reference
      });
      console.log(`✓ Sale recorded for ${item.name} (₦${saleAmount})`);

      // 3. Process commissions (only for the first item to avoid duplicate commissions)
      if (item === cartItems[0]) {
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
          const existingCommission = await Commission.findOne({ 
            sourceId: data.reference 
          });

          if (!existingCommission) {
            // Save commission
            await Commission.create({
              userId: commissionTarget,
              sourceType: commissionSourceType,
              sourceId: data.reference,
              amount: commissionAmount,
              status: "approved",
            });

            // Update wallet
            await Wallet.findOneAndUpdate(
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

            console.log(`✓ Commission recorded: ₦${commissionAmount}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("ERROR in processSuccessfulCharge:", error);
  }
}

module.exports = { handlePaystackWebhook };