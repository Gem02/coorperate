// controllers/paymentReceiptController.js
const PaymentReceipt = require("../models/PaymentReceipt");

// Save new payment receipt
exports.submitReceipt = async (req, res) => {
  try {
    const { paymentReceipt, transactionReference, firstName, lastName, quantity, productId, submittedBy } = req.body;

    if (!paymentReceipt || !transactionReference || !firstName || !lastName || !quantity || productId || submittedBy) {
      return res.status(400).json({ error: "All fields are required" });
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
    res.status(201).json({ message: "Payment receipt submitted successfully", data: newReceipt });
  } catch (err) {
    console.error("Error saving receipt:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionReference } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find the receipt
    const receipt = await PaymentReceipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Check transactionReference before approving
    if (status === "approved") {
      if (!transactionReference || transactionReference.trim() === "") {
        return res.status(400).json({ error: "Transaction reference is required to approve" });
      }

      if (receipt.transactionReference !== transactionReference) {
        return res.status(400).json({ error: "Transaction reference does not match" });
      }
    }

    // Update status
    receipt.status = status;
    const updatedReceipt = await receipt.save();

    res.json({ message: "Status updated successfully", data: updatedReceipt });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Internal server error" });
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