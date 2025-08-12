// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { getAllPayments, getPaymentsByUser } = require("../controller/paymentController");

// Get all payments (admin)
router.get("/", getAllPayments);

// Get payments for a specific user
router.get("/user/:userId", getPaymentsByUser);

module.exports = router;
