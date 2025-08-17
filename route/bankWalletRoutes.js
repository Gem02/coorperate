// routes/bankWalletRoutes.js
const express = require("express");
const router = express.Router();
const bankWalletController = require("../controller/bankWalletController");
//const { authenticateUser, verifyOwnership } = require("../middleware/auth");

// Protected routes
router.post('/bank-details/:userId',  bankWalletController.handleBankDetails);

router.put("/bank-details/:userId",  bankWalletController.updateBankDetails);

router.get("/bank-wallet/:userId", bankWalletController.getBankAndWalletInfo);


module.exports = router;