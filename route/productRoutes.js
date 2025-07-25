// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getAllproducts } = require('../controller/productController');

router.post('/create', createProduct);
router.get('/products', getAllproducts);

module.exports = router;
