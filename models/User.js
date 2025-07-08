// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String },
  stateOrCity: { type: String },
  password: { type: String, required: true },
  photo: { type: String }, // base64 encoded image string
}, { timestamps: true });



// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
