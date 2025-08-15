// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  lga: { type: String },

  password: { type: String, required: true },

  suspended: { type: Boolean, default: false },
  photo: { type: String }, // Base64 encoded image
  role: { 
    type: String, 
    enum: ["admin", "manager", "ambassador", "user"], 
    default: "user" 
  },

  lastLogin: { type: Date },

  // Bank details for payouts
  bankName: { type: String },
  accountNumber: { type: String },
  accountName: { type: String },

  // Commission balances
  pendingCommission: { type: Number, default: 0 }, // awaiting approval
  availableBalance: { type: Number, default: 0 }, // can withdraw now
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
