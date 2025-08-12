// controllers/paymentController.js
const Payment = require("../models/paymentSchema");

// @desc   Get all payment details (Admin)
// @route  GET /api/payments
// @access Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "firstName lastName email")
      .populate("productId", "name price");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all payments",
    });
  }
};

// @desc   Get payment details by userId
// @route  GET /api/payments/user/:userId
// @access Private (User or Admin)
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId })
      .populate("productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments by user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user payments",
    });
  }
};
