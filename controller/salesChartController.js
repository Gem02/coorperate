const mongoose = require("mongoose");
const Sale = require("../models/Sale");

// Helper: always return 12 months with zeros
const formatMonthlyData = (sales) => {
  const monthlyData = Array(12).fill(0);
  sales.forEach(sale => {
    monthlyData[sale._id.month - 1] = sale.count; // month is 1-based
  });
  return monthlyData;
};

// Ambassador Controller
exports.getAmbassadorMonthlySales = async (req, res) => {
  try {
    const { ambassadorId } = req.params;

    const sales = await Sale.aggregate([
      { $match: { ambassadorId: new mongoose.Types.ObjectId(ambassadorId) } },
      {
        $group: {
          _id: { month: { $month: "$saleDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    return res.json([
      {
        name: "Sales",
        data: formatMonthlyData(sales)
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ambassador sales", details: err.message });
  }
};


// Manager Controller
exports.getManagerMonthlySales = async (req, res) => {
  try {
    const { managerId } = req.params;

    const sales = await Sale.aggregate([
      { $match: { managerId: new mongoose.Types.ObjectId(managerId) } },
      {
        $group: {
          _id: { month: { $month: "$saleDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    return res.json([
      {
        name: "Sales",
        data: formatMonthlyData(sales)
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch manager sales", details: err.message });
  }
};

// Admin Controller (all sales)
exports.getAdminMonthlySales = async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { month: { $month: "$saleDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    return res.json([
      {
        name: "Sales",
        data: formatMonthlyData(sales)
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin sales", details: err.message });
  }
};
