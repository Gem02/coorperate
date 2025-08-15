// models/Wallet.js
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    unique: true, 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  transactions: [
    {
      type: { type: String, enum: ["credit", "debit"], required: true }, // credit for commissions, debit for withdrawals
      amount: { type: Number, required: true },
      description: String, // e.g. "Commission from sale", "Withdrawal"
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Wallet", walletSchema);
