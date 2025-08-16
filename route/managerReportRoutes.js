// routes/managerReportRoutes.js
const express = require('express');
const router = express.Router();
const managerReportController = require('../controller/managerReportController');

// GET manager performance report
router.get('/:managerId', managerReportController.getManagerReport);

module.exports = router;