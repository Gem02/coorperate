// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now }, // Used for monthly breakdown
  description: { type: String, required: true },
  images: { type: String }, // base64 image string
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salesCount: { type: Number, default: 0 }, // Total units sold
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Better type
});

module.exports = mongoose.model("Product", ProductSchema);
