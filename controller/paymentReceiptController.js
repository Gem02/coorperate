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

      // Manager commission = ₦25,000
      if (sale.managerId) {
        let managerWallet = await Wallet.findOne({ userId: sale.managerId });
        if (!managerWallet) {
          managerWallet = await Wallet.create({ userId: sale.managerId, balance: 0 });
        }
        managerWallet.balance += 25000;
        managerWallet.transactions.push({
          type: "credit",
          amount: 25000,
          description: `Commission for sale ${sale._id}`,
          referenceType: "commission",
          referenceId: sale._id,
        });
        await managerWallet.save();
      }

      // Ambassador commission = ₦13,000
      if (sale.ambassadorId) {
        let ambassadorWallet = await Wallet.findOne({ userId: sale.ambassadorId });
        if (!ambassadorWallet) {
          ambassadorWallet = await Wallet.create({ userId: sale.ambassadorId, balance: 0 });
        }
        ambassadorWallet.balance += 13000;
        ambassadorWallet.transactions.push({
          type: "credit",
          amount: 13000,
          description: `Commission for sale ${sale._id}`,
          referenceType: "commission",
          referenceId: sale._id,
        });
        await ambassadorWallet.save();
      }

      // Mark commission as paid
      sale.paidCommission = true;
      await sale.save();
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

    const transaction = PaymentReceipt.findOne({transactionReference});

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


exports.viewPaymentReport = async (req, res) => {
    try {
        const payments = await PaymentReceipt.find().sort({ createdDate: -1 });
        return res.status(200).json(payments)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
    }
}