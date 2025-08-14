// this file is in the route/authRoutes
const express = require('express');
const { registerUser, login, ambassadorLogin, adminLogin, managerLogin, updateUserProfile, logout, sendForgotPasswordCode, verifyCode, changePassword, loginAdmin } = require('../controller/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/adminLogin', adminLogin);
router.post('/managerLogin', managerLogin);
router.post('/ambassadorLogin', ambassadorLogin);
router.patch('/updateProfile', updateUserProfile);
router.post('/logout', logout);
router.post('/forgotPassword', sendForgotPasswordCode);
router.post('/verifyCode', verifyCode);
router.patch('/setPassword/:userId', changePassword);
router.post('/admin/login', loginAdmin);

module.exports = router;
