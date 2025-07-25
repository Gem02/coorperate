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

// Update a Product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true, // returns the updated document
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Product', details: error.message });
  }
};

// Delete a Product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Product', details: error.message });
  }
};



module.exports = {createProduct, getAllproducts, updateProduct, deleteProduct};