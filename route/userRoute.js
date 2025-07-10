const express = require('express');
const router = express.Router();
const { fetchUserProfile } = require('../controller/userController');

router.get('/profile/:userId', fetchUserProfile);

module.exports = router;