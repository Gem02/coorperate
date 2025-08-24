const express = require("express");
const router = express.Router();
const salesController = require("../controller/salesChartController");


router.get("/ambassador/:ambassadorId", salesController.getAmbassadorMonthlySales);

router.get("/manager/:managerId", salesController.getManagerMonthlySales);

router.get("/admin", salesController.getAdminMonthlySales);

module.exports = router;
