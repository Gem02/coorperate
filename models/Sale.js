const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  ambassadorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  saleAmount: { 
    type: Number, 
    required: true 
  },
  commissionAmount: { 
    type: Number, 
    required: true 
  },
  paidCommission: { 
    type: Boolean, 
    default: false 
  },
  saleDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentReference: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);