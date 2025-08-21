// routes/paymentReceiptRoutes.js
const express = require("express");
const router = express.Router();
const { submitReceipt, updateReceiptStatus } = require("../controller/paymentReceiptController");

router.post("/", submitReceipt); // submit receipt
router.put("/status/:id/", updateReceiptStatus); // update status

module.exports = router;
