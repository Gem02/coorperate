// routes/bankWalletRoutes.js
const express = require("express");
const router = express.Router();
const bankWalletController = require("../controllers/bankWalletController");
//const { authenticateUser, verifyOwnership } = require("../middleware/auth");

// Protected routes
router.put("/bank-details/:userId",  bankWalletController.updateBankDetails);

router.get("/bank-wallet/:userId", bankWalletController.getBankAndWalletInfo);

router.post("/withdraw/:userId",  bankWalletController.requestWithdrawal);

module.exports = router;