// controllers/withdrawalController.js
const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const User = require("../models/User");

// Apply for withdrawal
exports.requestWithdrawal = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Valid withdrawal amount is required"
      });
    }

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Withdrawal amount must be positive"
      });
    }

    // Get user and wallet
    const user = await User.findById(userId).select("bankDetails role");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Only ambassadors and managers can withdraw
    if (!["ambassador", "manager"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only ambassadors and managers can withdraw funds"
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: "Wallet not found" 
      });
    }

    // Check sufficient balance
    if (wallet.balance < withdrawalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance for withdrawal"
      });
    }

    // Verify bank details
    if (!user.bankDetails || !user.bankDetails.verified) {
      return res.status(400).json({
        success: false,
        message: "Verified bank details are required for withdrawal"
      });
    }

    // Create withdrawal record
    const withdrawal = await Withdrawal.create({
      userId,
      walletId: wallet._id,
      amount: withdrawalAmount,
      bankDetails: {
        bankName: user.bankDetails.bankName,
        accountNumber: user.bankDetails.accountNumber,
        accountName: user.bankDetails.accountName
      },
      status: "pending",
      requestedBy: userId
    });

    // Deduct from wallet but mark as pending
    wallet.balance -= withdrawalAmount;
    wallet.transactions.push({
      type: "debit",
      amount: withdrawalAmount,
      description: `Withdrawal request to ${user.bankDetails.bankName}`,
      status: "pending",
      referenceType: "withdrawal",
      referenceId: withdrawal._id,
      metadata: {
        initiatedBy: userId,
        bankDetails: {
          last4Digits: user.bankDetails.accountNumber.slice(-4)
        }
      }
    });

    await wallet.save();

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: {
        withdrawalId: withdrawal._id,
        newBalance: wallet.balance,
        status: "pending",
        transactionDetails: {
          amount: withdrawalAmount,
          bankName: user.bankDetails.bankName,
          accountName: user.bankDetails.accountName,
          last4Digits: user.bankDetails.accountNumber.slice(-4)
        }
      }
    });

  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing withdrawal",
      error: error.message
    });
  }
};

// Admin updates withdrawal status
exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, adminId, cancellationReason, transactionReference } = req.body;

    if (!["processing", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ 
        success: false, 
        message: "Withdrawal not found" 
      });
    }

    // Get wallet and user
    const wallet = await Wallet.findById(withdrawal.walletId);
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: "Wallet not found" 
      });
    }

    const user = await User.findById(withdrawal.userId).select("bankDetails");

    // Find the pending withdrawal transaction
    const transactionIndex = wallet.transactions.findIndex(
      t => t.referenceId?.equals(withdrawal._id) && 
           t.referenceType === "withdrawal" && 
           t.status === "pending"
    );

    if (transactionIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Pending withdrawal transaction not found"
      });
    }

    // Handle status transitions
    if (status === "processing") {
      withdrawal.status = "processing";
      withdrawal.processedBy = adminId;
      withdrawal.processedAt = new Date();

      // Update transaction status
      wallet.transactions[transactionIndex].status = "processing";
      wallet.transactions[transactionIndex].metadata.processedBy = adminId;
    } 
    else if (status === "completed") {
      // Complete the withdrawal
      withdrawal.status = "completed";
      withdrawal.processedBy = adminId;
      withdrawal.processedAt = new Date();
      withdrawal.transactionReference = transactionReference;

      // Update transaction status
      wallet.transactions[transactionIndex].status = "completed";
      wallet.transactions[transactionIndex].metadata.processedBy = adminId;
      wallet.transactions[transactionIndex].metadata.completedAt = new Date();
      wallet.transactions[transactionIndex].metadata.transactionReference = transactionReference;
    } 
    else if (status === "cancelled") {
      // Refund the amount
      wallet.balance += withdrawal.amount;
      
      // Update transaction status and mark as failed
      wallet.transactions[transactionIndex].status = "failed";
      wallet.transactions[transactionIndex].description = `Withdrawal cancelled: ${cancellationReason || "No reason provided"}`;
      wallet.transactions[transactionIndex].metadata.cancelledBy = adminId;
      wallet.transactions[transactionIndex].metadata.cancellationReason = cancellationReason;

      withdrawal.status = "cancelled";
      withdrawal.processedBy = adminId;
      withdrawal.processedAt = new Date();
      withdrawal.cancellationReason = cancellationReason;
    }

    await withdrawal.save();
    await wallet.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      data: {
        withdrawal,
        newBalance: wallet.balance,
        transactionStatus: wallet.transactions[transactionIndex].status
      }
    });

  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating withdrawal status",
      error: error.message
    });
  }
};

// Get user's withdrawal history with transaction details
exports.getWithdrawalHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 10, page = 1 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const withdrawals = await Withdrawal.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Get wallet transactions for additional details
    const wallet = await Wallet.findOne({ userId }).select("transactions");
    
    // Enrich withdrawal data with transaction details
    const enrichedWithdrawals = withdrawals.map(withdrawal => {
      const transaction = wallet?.transactions.find(
        t => t.referenceId?.equals(withdrawal._id)
      );
      
      return {
        ...withdrawal,
        transactionDetails: transaction ? {
          status: transaction.status,
          processedAt: transaction.metadata?.processedAt,
          completedAt: transaction.metadata?.completedAt,
          transactionReference: transaction.metadata?.transactionReference
        } : null
      };
    });

    const total = await Withdrawal.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: enrichedWithdrawals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching withdrawal history",
      error: error.message
    });
  }
};

// Admin gets all pending withdrawals
exports.getPendingWithdrawals = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const withdrawals = await Withdrawal.find({ status: "pending" })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: 1 }) // Oldest first
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Withdrawal.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: withdrawals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error("Error fetching pending withdrawals:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending withdrawals",
      error: error.message
    });
  }
};

