// models/Commission.js
const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sourceType: { 
    type: String, 
    enum: ["referral", "sale"], 
    required: true 
  },
  sourceId: { type: mongoose.Schema.Types.ObjectId }, // e.g. saleId or referralId
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved"], 
    default: "pending" 
  },
  earnedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Commission", commissionSchema);
