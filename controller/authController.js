// this file is in the controller/authController

const UserModel = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utilities/generateToken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const forgotPasswordModel = require('../models/forgotPassword');
const {welcomeEmail} = require('../utilities/emailTemplate');



const sendForgotPasswordCode = async (req, res) =>{
    try {
        const email = validator.normalizeEmail(req.body.email || '');
        if (!email) {
            return res.status(400).json({ message: 'Valid email is required' });
        }
        const userExists = await UserModel.findOne({ email });
        if (!userExists) {
            return res.status(400).json({message: 'No account found with this email'})
        }
        const token = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    
        let user = await forgotPasswordModel.findOne({email});
        if (user) {
            return res.status(400).json({message: 'Try again after 5 mins'})
        }

        user = await forgotPasswordModel.create({ email, token });
        sendVerificationEmail(email, token);
        return res.status(200).json({message: 'verification sent', status: true});
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Sorry a server error occured' });
    }
};

const verifyCode = async (req, res) => {
    try {
        const email = validator.normalizeEmail(req.body.email || '');
        const code = validator.escape(req.body.code || '');

        if (!email || !code) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await forgotPasswordModel.findOne({ email });

        if (!user || user.token !== code) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        
        await forgotPasswordModel.deleteOne({ email });

        res.status(200).json({ message: 'Email verified successfully', status: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
  try {
    const {userId} = req.params; 
    const currentPassword = validator.escape(req.body.currentPassword || '');
    const newPassword = validator.escape(req.body.newPassword || '');

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const registerUser = async (req, res) => {

  try {
    // Extract and sanitize fields
    const firstName = validator.escape(req.body.firstName || '');
    const lastName = validator.escape(req.body.lastName || '');
    const email = validator.normalizeEmail(req.body.email || '');
    const phone = validator.escape(req.body.phone || '');
    const country = validator.escape(req.body.country || '');
    const state = validator.escape(req.body.state || '');
    const lga = validator.escape(req.body.lga || '');
    const role = validator.escape(req.body.role || 'user');
    const photo = req.body.photo || '';
    let password = req.body.password || '';


    // Fallback: use phone as password if none provided
    if (!password) {
      if (!phone) {
      return res.status(400).json({ message: "Phone number or password is required" });
    }
      password = phone;
    }

    // Check for required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required" });
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      country,
      state,
      lga,
      password,
      photo,
      role,
    });

    await welcomeEmail({email: user.email, firstName:user.firstName, lastName:user.lastName});

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      message: "Registration failed due to server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const email = validator.normalizeEmail(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userInfo = await UserModel.findOne({ email }).select("+password");

    if (!userInfo) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ❌ Deny login if user is suspended
    if (userInfo.suspended) {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    const isCorrect = await bcrypt.compare(password, userInfo.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    userInfo.lastLogin = new Date();
    await userInfo.save();

    const accessToken = generateAccessToken(userInfo._id, userInfo.email, userInfo.role);
    const refreshToken = generateRefreshToken(userInfo._id, userInfo.email, userInfo.role);

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      role: userInfo.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};

//ambassador login
const ambassadorLogin = async (req, res) => {
  try {
    const email = validator.normalizeEmail(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userInfo = await UserModel.findOne({ email }).select("+password");

    if (!userInfo) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (userInfo.role != 'ambassador') {
      return res.status(401).json({ message: "Invalid Role. You are not an Ambassador" });
    }

    // ❌ Deny login if user is suspended
    if (userInfo.suspended) {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    const isCorrect = await bcrypt.compare(password, userInfo.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    userInfo.lastLogin = new Date();
    await userInfo.save();

    const accessToken = generateAccessToken(userInfo._id, userInfo.email, userInfo.role);
    const refreshToken = generateRefreshToken(userInfo._id, userInfo.email, userInfo.role);

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      role: userInfo.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};

//admin login
const adminLogin = async (req, res) => {
  try {
    const email = validator.normalizeEmail(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userInfo = await UserModel.findOne({ email }).select("+password");

    if (!userInfo) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (userInfo.role != 'admin') {
      return res.status(401).json({ message: "Invalid Role. You are not an Admin" });
    }

    // ❌ Deny login if user is suspended
    if (userInfo.suspended) {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    const isCorrect = await bcrypt.compare(password, userInfo.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    userInfo.lastLogin = new Date();
    await userInfo.save();

    const accessToken = generateAccessToken(userInfo._id, userInfo.email, userInfo.role);
    const refreshToken = generateRefreshToken(userInfo._id, userInfo.email, userInfo.role);

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      role: userInfo.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};

//manager login
const managerLogin = async (req, res) => {
  try {
    const email = validator.normalizeEmail(req.body.email || '');
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userInfo = await UserModel.findOne({ email }).select("+password");

    if (!userInfo) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (userInfo.role != 'manager') {
      return res.status(401).json({ message: "Invalid Role. You are not a Manager" });
    }

    // ❌ Deny login if user is suspended
    if (userInfo.suspended) {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    const isCorrect = await bcrypt.compare(password, userInfo.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    userInfo.lastLogin = new Date();
    await userInfo.save();

    const accessToken = generateAccessToken(userInfo._id, userInfo.email, userInfo.role);
    const refreshToken = generateRefreshToken(userInfo._id, userInfo.email, userInfo.role);

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      role: userInfo.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updates = {};

    // Validate and add allowed fields only
    if (req.body.firstName) {
      updates.firstName = validator.escape(req.body.firstName);
    }

    if (req.body.lastName) {
      updates.lastName = validator.escape(req.body.lastName);
    }

    if (req.body.email) {
      const email = validator.normalizeEmail(req.body.email);
      const existing = await UserModel.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    if (req.body.phone) {
      updates.phone = validator.escape(req.body.phone);
    }

    if (req.body.country) {
      updates.country = validator.escape(req.body.country);
    }

    if (req.body.state) {
      updates.state = validator.escape(req.body.state);
    }

    if (req.body.photo) {
      updates.photo = req.body.photo; 
    }

    if (req.body.password) {
      return res.status(400).json({ message: "Password cannot be updated here" });
    }

    // Prevent update if nothing is changing
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country, 
        state: updatedUser.state,
        photo: updatedUser.photo,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const email = validator.normalizeEmail(req.body.email || '');
    const password = validator.escape(req.body.password || '');

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !['admin', 'super-admin'].includes(user.role)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid role or user.' });
    }

    
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id, user.email, user.role);

    res.cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None'
    });


    return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    return res.status(200).json({ message: 'Logged out successfully', logout:true });

}

/* const passResetRegisteration = async(req, res) =>{
    try {
        const {email} = req.body;
        const token = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    
        let user = await forgotPasswordModel.findOne({email});
        if (user) {
            return res.status(400).json({message: 'Error try again later'})
        }
        const validUser = await UserModel.findOne({email});

        if (validUser){
            const name = 'UNKNOWN';
            user = await forgotPasswordModel.create({ email, name, token });
            sendVerificationPassword(email, token);
            return res.status(200).json({message: 'verification sent', status: true});
        } else{
            return res.status(400).json({message: 'No account is linked to this email'})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Sorry a server error occured' });
    }
} */

module.exports = { registerUser, login, updateUserProfile, logout, sendForgotPasswordCode, verifyCode, changePassword, loginAdmin};