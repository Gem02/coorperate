// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ✅ use bcryptjs as you're using that package

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  lga: {type: String},
  password: { type: String, required: true },
  suspended: { type: Boolean, default: false },
  photo: { type: String }, // base64 encoded image string
  role: { type: String, default: "user" }, // ✅ added role
  lastLogin: { type: Date }, // ✅ added lastLogin
}, { timestamps: true });

// ✅ Hash password before saving
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

// ✅ Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
