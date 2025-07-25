// controllers/ProductController.js
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const {
      createdDate,
      description,
      images,
      name,
      price,
      salesCount,
      userId,
    } = req.body;

    const newProduct = new Product({
      createdDate,
      description,
      images,
      name,
      price,
      salesCount,
      userId,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Product', details: error.message });
  }
};

// Fetch all products
const getAllproducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdDate: -1 }); // optional sorting
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
};

// Optional: Fetch products by userId
const getproductsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ userId }).sort({ createdDate: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user products', details: error.message });
  }
};


module.exports = {createProduct, getAllproducts};