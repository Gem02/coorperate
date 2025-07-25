// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getAllproducts, updateProduct, deleteProduct } = require('../controller/productController');

router.post('/create', createProduct);
router.get('/', getAllproducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
