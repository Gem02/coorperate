// controllers/ProductController.js
const Product = require('../models/Product');
const moment = require("moment");

const createProduct = async (req, res) => {
  try {
    const {
      description,
      images,
      name,
      price,
      salesCount,
      userId,
    } = req.body;

    const newProduct = new Product({
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

//product stats

const getUserSalesPerformance = async (req, res) => {
  const { userId } = req.params;

  try {
    const sales = await Product.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdDate" },
            year: { $year: "$createdDate" },
          },
          totalSales: { $sum: "$salesCount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formattedSales = Array.from({ length: 12 }, (_, i) => {
      const found = sales.find((s) => s._id.month === i + 1);
      return {
        month: moment().month(i).format("MMM"),
        sales: found ? found.totalSales : 0,
      };
    });

    res.status(200).json({ success: true, data: formattedSales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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



module.exports = {createProduct, getAllproducts, updateProduct, deleteProduct, getUserSalesPerformance};