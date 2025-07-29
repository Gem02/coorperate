const express = require('express');
const router = express.Router();
const { fetchUserProfile, getAllUsers,deleteUser } = require('../controller/userController');

router.get('/profile/:userId', fetchUserProfile);
router.get('/', getAllUsers);          // GET all users
router.delete('/:id', deleteUser); 

module.exports = router;