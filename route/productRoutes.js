// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProject } = require('../controller/productController');

router.post('/create', createProject);

module.exports = router;
