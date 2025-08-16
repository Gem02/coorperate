// controllers/bankWalletController.js
const User = require("../models/User");
const Wallet = require("../models/Wallet");


//crate bank
exports.handleBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bankName, accountNumber, accountName } = req.body;

    // Validation function
    const validateBankDetails = ({ bankName, accountNumber, accountName }) => {
      if (!bankName || !accountNumber || !accountName) {
        return { valid: false, message: "All bank details are required" };
      }

      if (bankName.trim().length < 2) {
        return { valid: false, message: "Bank name must be at least 2 characters" };
      }

      if (!/^\d{10,}$/.test(accountNumber.trim())) {
        return { valid: false, message: "Account number must be at least 10 digits" };
      }

      if (accountName.trim().length < 5) {
        return { valid: false, message: "Account name must be at least 5 characters" };
      }

      return { valid: true, message: "Bank details are valid" };
    };

    // Validate input
    const { valid, message } = validateBankDetails({
      bankName,
      accountNumber,
      accountName
    });
    
    if (!valid) {
      return res.status(400).json({ success: false, message });
    }

    // Find user and check if bank details exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const isNewRecord = !user.bankDetails;

    // Create/update bank details
    user.bankDetails = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      verified: isNewRecord ? false : user.bankDetails.verified // Maintain verification status if updating
    };

    await user.save();

    // Prepare response
    const responseData = {
      bankName: user.bankDetails.bankName,
      accountName: user.bankDetails.accountName,
      last4Digits: user.bankDetails.accountNumber.slice(-4),
      verified: user.bankDetails.verified,
      isNewRecord
    };

    return res.status(200).json({
      success: true,
      message: isNewRecord 
        ? "Bank details created successfully" 
        : "Bank details updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error handling bank details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing bank details",
      error: error.message
    });
  }
};

// Add or update bank details
exports.updateBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bankName, accountNumber, accountName } = req.body;

    // Validation function moved inside controller
    const validateBankDetails = ({ bankName, accountNumber, accountName }) => {
      if (!bankName || !accountNumber || !accountName) {
        return { valid: false, message: "All bank details are required" };
      }

      if (bankName.trim().length < 2) {
        return { valid: false, message: "Bank name must be at least 2 characters" };
      }

      if (!/^\d{10,}$/.test(accountNumber.trim())) {
        return { valid: false, message: "Account number must be at least 10 digits" };
      }

      if (accountName.trim().length < 5) {
        return { valid: false, message: "Account name must be at least 5 characters" };
      }

      return { valid: true, message: "Bank details are valid" };
    };

    // Validate input using the moved function
    const { valid, message } = validateBankDetails({
      bankName,
      accountNumber,
      accountName
    });
    
    if (!valid) {
      return res.status(400).json({ success: false, message });
    }

    // Rest of the controller remains the same...
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.bankDetails = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      verified: false
    };

    await user.save();

    const responseData = {
      bankName: user.bankDetails.bankName,
      accountName: user.bankDetails.accountName,
      last4Digits: user.bankDetails.accountNumber.slice(-4),
      verified: user.bankDetails.verified
    };

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating bank details",
      error: error.message
    });
  }
};

// Get bank details and wallet balance
exports.getBankAndWalletInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("bankDetails firstName lastName");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const wallet = await Wallet.findOne({ userId }).select("balance");

    if (!wallet) {
        return res.status(404).json({ 
        success: false, 
        message: "wallet not found" 
      });
    }
    const balance = wallet ? wallet.balance : 0;

    const responseData = {
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      bankDetails: user.bankDetails ? {
        bankName: user.bankDetails.bankName,
        accountName: user.bankDetails.accountName,
        last4Digits: user.bankDetails.accountNumber?.slice(-4),
        verified: user.bankDetails.verified
      } : null,
      walletBalance: balance
    };

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Error fetching bank and wallet info:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching information",
      error: error.message
    });
  }
};

// Initiate withdrawal request
exports.requestWithdrawal = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!user.bankDetails || !user.bankDetails.verified) {
      return res.status(400).json({
        success: false,
        message: "Verified bank details are required for withdrawal"
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < withdrawalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance for withdrawal"
      });
    }

    wallet.balance -= withdrawalAmount;
    wallet.transactions.push({
      type: "debit",
      amount: withdrawalAmount,
      description: `Withdrawal to ${user.bankDetails.bankName} (****${user.bankDetails.accountNumber.slice(-4)})`,
      status: "pending"
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: {
        newBalance: wallet.balance,
        transactionId: wallet.transactions[wallet.transactions.length - 1]._id
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