// routes/paymentReceiptRoutes.js
const express = require("express");
const router = express.Router();
const { submitReceipt, updateReceiptStatus, viewPaymentReport, viewUserPaymentReports } = require("../controller/paymentReceiptController");

router.post("/", submitReceipt); // submit receipt
router.put("/status/:id", updateReceiptStatus); // update status
router.get('/status', viewPaymentReport);
router.get('/:userId', viewUserPaymentReports)

module.exports = router;
