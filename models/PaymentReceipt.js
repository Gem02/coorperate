// models/PaymentReceipt.js
const mongoose = require("mongoose");

const paymentReceiptSchema = new mongoose.Schema({
  paymentReceipt: {
    type: String, // base64 string
    required: true
  },
  transactionReference: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
   productId: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"
   }
}, { timestamps: true });

module.exports = mongoose.model("PaymentReceipt", paymentReceiptSchema);
