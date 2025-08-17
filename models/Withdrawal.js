// models/Withdrawal.js
const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled", "failed"],
    default: "pending"
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  processedAt: Date,
  cancellationReason: String,
  transactionReference: String
}, { timestamps: true });

module.exports = mongoose.model("Withdrawal", withdrawalSchema);