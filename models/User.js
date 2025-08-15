// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    phone:     { type: String },
    country:   { type: String },
    state:     { type: String },
    lga:       { type: String },
    password:  { type: String, required: true },
    suspended: { type: Boolean, default: false },
    photo:     { type: String }, // base64 encoded image string

    // ROLES
    role: { type: String, enum: ["admin", "manager", "ambassador", "user"], default: "user" },

    // TRACKING / RELATIONSHIPS
    // manager this person belongs under (ambassadors + users will have this)
    managerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    // ambassador this person belongs under (users will have this)
    ambassadorId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    lastLogin:   { type: Date },
  },
  { timestamps: true }
);

// Indexes for fast lookups
userSchema.index({ role: 1 });
userSchema.index({ managerId: 1 });
userSchema.index({ ambassadorId: 1 });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
