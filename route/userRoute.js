const express = require('express');
const router = express.Router();
const { fetchUserProfile, getAllUsers,getAllUsersForAmbassador, getAllUsersForManager, deleteUser, suspendUser, unsuspendUser } = require('../controller/userController');

router.get('/profile/:userId', fetchUserProfile);
router.get('/', getAllUsers);
router.get('/manager/:userId', getAllUsersForManager);  
router.get('/ambassador/:userId', getAllUsersForAmbassador);          // GET all users
router.delete('/:id', deleteUser); 
router.patch('/suspend/:id', suspendUser); 
router.patch('/activate/:id', unsuspendUser)

module.exports = router;