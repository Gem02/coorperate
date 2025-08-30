// controllers/paymentReceiptController.js
const PaymentReceipt = require("../models/PaymentReceipt");
const Sale = require("../models/Sale");
const Wallet = require("../models/Wallet");
const Product = require("../models/Product");

exports.updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionReference } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // 1️⃣ Ensure receipt exists and transactionReference matches
    const receipt = await PaymentReceipt.findById(id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }
    if (receipt.transactionReference !== transactionReference) {
      return res.status(400).json({ error: "Invalid Transaction reference" });
    }

    // 2️⃣ Update receipt status
    receipt.status = status;
    await receipt.save();

    // 3️⃣ If approved, handle commissions
    if (status === "approved") {
      const sale = await Sale.findOne({ paymentReference: transactionReference });
      if (!sale) {
        return res.status(404).json({ error: "Sale not found for this reference" });
      }

      const product = await Product.findById(sale.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (sale.saleAmount < product.price) {
        return res.status(400).json({ error: "Sale amount cannot be less than product price" });
      }

      if (sale.paidCommission) {
        return res.status(400).json({ error: "Commission already paid for this sale" });
      }

      // Manager commission
if (sale.managerId) {
  console.log("🔎 Looking for manager wallet with userId:", sale.managerId);

  let managerWallet = await Wallet.findOne({ userId: sale.managerId });

  if (!managerWallet) {
    console.log("⚠️ Manager wallet not found. Creating new wallet...");
    managerWallet = new Wallet({ userId: sale.managerId, balance: 0, transactions: [] });
  } else {
    console.log("✅ Manager wallet found:", {
      walletId: managerWallet._id,
      currentBalance: managerWallet.balance,
      transactionsCount: managerWallet.transactions.length,
    });
  }

  const oldBalance = managerWallet.balance || 0;
  const commissionAmount = 25000;
  const newBalance = oldBalance + commissionAmount;

  console.log(`💰 Adding commission: ${commissionAmount}. Old balance: ${oldBalance}, New balance: ${newBalance}`);

  managerWallet.balance = newBalance;

  const newTransaction = {
    type: "credit",
    amount: commissionAmount,
    description: `Commission for sale ${sale._id}`,
    referenceType: "commission",
    referenceId: sale._id,
  };

  console.log("📝 Pushing transaction:", newTransaction);

  managerWallet.transactions.push(newTransaction);
  managerWallet.markModified("transactions");

  await managerWallet.save();
  console.log("✅ Manager wallet saved successfully. Updated wallet:", {
    walletId: managerWallet._id,
    userId: managerWallet.userId,
    newBalance: managerWallet.balance,
    transactionsCount: managerWallet.transactions.length,
  });
}

// Ambassador commission
if (sale.ambassadorId) {
  console.log("🔎 Looking for ambassador wallet with userId:", sale.ambassadorId);

  let ambassadorWallet = await Wallet.findOne({ userId: sale.ambassadorId });

  if (!ambassadorWallet) {
    console.log("❌ Ambassador wallet not found. Cannot credit commission.");
    return res.status(400).json({ error: "Ambassador wallet not found" });
  }

  console.log("✅ Ambassador wallet found:", {
    walletId: ambassadorWallet._id,
    currentBalance: ambassadorWallet.balance,
    transactionsCount: ambassadorWallet.transactions.length,
  });

  const oldBalance = ambassadorWallet.balance || 0;
  const commissionAmount = 13000;
  const newBalance = oldBalance + commissionAmount;

  console.log(`💰 Adding commission: ${commissionAmount}. Old balance: ${oldBalance}, New balance: ${newBalance}`);

  ambassadorWallet.balance = newBalance;

  const newTransaction = {
    type: "credit",
    amount: commissionAmount,
    description: `Commission for sale ${sale._id}`,
    referenceType: "commission",
    referenceId: sale._id,
  };

  console.log("📝 Pushing transaction:", newTransaction);

  ambassadorWallet.transactions.push(newTransaction);
  ambassadorWallet.markModified("transactions");

  await ambassadorWallet.save();
  console.log("✅ Ambassador wallet saved successfully. Updated wallet:", {
    walletId: ambassadorWallet._id,
    userId: ambassadorWallet.userId,
    newBalance: ambassadorWallet.balance,
    transactionsCount: ambassadorWallet.transactions.length,
  });
}

// Finally mark commission as paid
sale.paidCommission = true;
await sale.save();
console.log("🎉 Sale updated: paidCommission set to true for sale", sale._id);

    }

    res.json({ message: "Status updated successfully", data: receipt });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Save new payment receipt
exports.submitReceipt = async (req, res) => {
  try {
    const { paymentReceipt, transactionReference, firstName, lastName, quantity, productId, submittedBy } = req.body;

    if (!paymentReceipt || !transactionReference || !firstName || !lastName || !quantity || !productId || !submittedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await PaymentReceipt.findOne({transactionReference});

    if (transaction) {
        return res.status(400).json({ error: "Transaction reference has been used" });
    }

    const newReceipt = new PaymentReceipt({
      paymentReceipt,
      transactionReference,
      firstName,
      lastName,
      quantity,
      productId,
      submittedBy
    });

    await newReceipt.save();
    return res.status(201).json({ message: "Payment receipt submitted successfully", data: newReceipt });
  } catch (err) {
    console.error("Error saving receipt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch payment reports for a specific user
exports.viewUserPaymentReports = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const payments = await PaymentReceipt.find({ submittedBy: userId })
      .sort({ createdAt: -1 }) // use createdAt since your schema has timestamps
      .populate("productId", "name price") // optional: show product details
      .populate("submittedBy", "firstName lastName email"); // optional: show user details

    return res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments", details: error.message });
  }
};


exports.viewPaymentReport = async (req, res) => {
    try {
        const payments = await PaymentReceipt.find().sort({ createdDate: -1 });
        return res.status(200).json(payments)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
    }
}