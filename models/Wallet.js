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
      type: { type: String, enum: ["credit", "debit"], required: true },
      amount: { type: Number, required: true },
      description: String,
      createdAt: { type: Date, default: Date.now },
      // Add these new fields as optional
      status: {
        type: String,
        enum: ["completed", "pending", "failed"],
        default: "completed" // Maintain backward compatibility
      },
      referenceType: {
        type: String,
        enum: ["withdrawal", "commission", "other"],
        default: "other"
      },
      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false // Make it optional
      }
    }
  ]
});

module.exports = mongoose.model("Wallet", walletSchema);