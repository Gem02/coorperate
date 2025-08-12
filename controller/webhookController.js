// webhookController.js
import crypto from "crypto";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const handlePaystackWebhook = async (req, res) => {
  
  try {
    // 1. Verify the webhook secret exists
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error('ERROR: PAYSTACK_SECRET_KEY is not configured');
      return res.status(500).json({ status: false, message: "Server configuration error" });
    }

    // 2. Verify the webhook signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");
    
    const signature = req.headers["x-paystack-signature"];
    if (!signature) {
      console.error('ERROR: Missing Paystack signature header');
      return res.status(400).json({ status: false, message: "Missing signature header" });
    }

    if (hash !== signature) {
      console.error('ERROR: Invalid signature', {
        computedHash: hash,
        receivedSignature: signature
      });
      return res.status(400).json({ status: false, message: "Invalid signature" });
    }

    console.log('✓ Signature verification passed');

    // 3. Process the webhook event
    const event = JSON.parse(req.body.toString("utf8"));
    console.log('Event Type:', event.event);
    console.log('Event Data:', JSON.stringify(event.data, null, 2));

    // Always respond immediately to acknowledge receipt
    res.status(200).json({ received: true });

    // 4. Handle specific event types
    if (event.event === "charge.success") {
      await processSuccessfulCharge(event.data);
    } else if (event.event === "subscription.create") {
      console.log('Subscription created event received');
    } else {
      console.log(`Unhandled event type: ${event.event}`);
    }

  } catch (error) {
    console.error('ERROR processing webhook:', error);
    // Note: We already sent a 200 response, so we can't change it now
    // This is why we send the 200 immediately after signature verification
  }
};

async function processSuccessfulCharge(data) {
  try {
    console.log('\nProcessing successful charge...');

    // Extract transaction details
    const email = data.customer?.email;
    const amount = data.amount / 100; // Convert from kobo to naira
    const reference = data.reference;
    const transactionId = data.id;

    if (!email) {
      console.error('ERROR: No customer email in charge data');
      return;
    }

    console.log(`Processing transaction ${reference} for ${email}, amount: ₦${amount}`);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`ERROR: User not found for email: ${email}`);
      return;
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) {
      console.log(`No wallet found for user ${user._id}, creating new wallet`);
      wallet = new Wallet({ user: user._id, balance: 0 });
    }

    // Check for duplicate transaction
    const existingTx = await Transaction.findOne({ reference });
    if (existingTx) {
      console.log(`Transaction ${reference} already processed, skipping`);
      return;
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();
    console.log(`Updated wallet balance for user ${user._id}: ₦${wallet.balance}`);

    // Create transaction record
   /*  const transaction = await Transaction.create({
      user: user._id,
      type: "deposit",
      category: "income",
      amount,
      currency: "NGN",
      description: "Deposit via Paystack",
      status: "completed",
      reference,
      balanceAfter: wallet.balance,
      metadata: {
        paymentMethod: "paystack",
        gateway: "Paystack",
        gatewayTransactionId: transactionId,
        customerEmail: email,
        customerId: data.customer?.id,
      },
    }); */

    console.log(`Created transaction record: ${transaction._id}`);

    // ✅ Trigger referral reward for compounding deposit
    await rewardReferrerOnDeposit(user._id, amount);

  } catch (error) {
    console.error('ERROR in processSuccessfulCharge:', error);
  }
}
