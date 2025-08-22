// controllers/paymentReceiptController.js
const PaymentReceipt = require("../models/PaymentReceipt");

// Save new payment receipt
exports.submitReceipt = async (req, res) => {
  try {
    const { paymentReceipt, transactionReference, firstName, lastName, quantity, productId } = req.body;

    if (!paymentReceipt || !transactionReference || !firstName || !lastName || !quantity || productId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newReceipt = new PaymentReceipt({
      paymentReceipt,
      transactionReference,
      firstName,
      lastName,
      quantity,
      productId
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
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedReceipt = await PaymentReceipt.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

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