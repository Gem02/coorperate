// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  description: { type: String, required: true },
  images: { type: String }, // base64 string
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salesCount: { type: Number, default: 0 },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
