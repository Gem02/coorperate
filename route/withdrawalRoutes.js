// routes/withdrawalRoutes.js
const express = require("express");
const router = express.Router();
const withdrawalController = require("../controller/withdrawalController");
//const { authenticateUser, isAdmin } = require("../middleware/auth");

// User routes (require authentication)
router.post(
  "/request/:userId",
  withdrawalController.requestWithdrawal
);

router.get(
  "/history/:userId",
  withdrawalController.getWithdrawalHistory
);

// Admin routes (require admin privileges)
router.patch(
  "/admin/status/:withdrawalId",
  withdrawalController.updateWithdrawalStatus
);

router.get(
  "/admin/pending",
  withdrawalController.getPendingWithdrawals
);

module.exports = router;

