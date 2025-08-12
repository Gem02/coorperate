// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  amount: { type: Number, required: true }, // in kobo if using Paystack
  currency: { type: String, default: "NGN" },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  transactionRef: { type: String, required: true, unique: true },
  paymentGateway: { type: String, default: "Paystack" },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
