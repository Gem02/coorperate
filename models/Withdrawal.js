// models/Withdrawal.js
const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
