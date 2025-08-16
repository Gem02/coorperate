// controllers/managerReportController.js
const mongoose = require("mongoose");
const User = require("../models/User");
const Sale = require("../models/Sale");
const Commission = require("../models/Commission");
const { sendManagerReportEmail } = require("../utilities/reportEmail");

exports.getManagerReport = async (req, res) => {
  try {
    const { managerId } = req.params;

    if (!managerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Manager ID is required" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Manager ID format" 
      });
    }

    // 1️⃣ Verify manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ success: false, message: "Manager not found" });
    }

    // 2️⃣ Find all ambassadors under this manager
    const ambassadors = await User.find({ 
      role: "ambassador", 
      managerId: managerId 
    }).lean();

    const reportData = [];
    let totalAmbassadors = ambassadors.length;
    let totalUsers = 0;
    let totalTodaySales = 0;
    let totalAllTimeSales = 0;
    let totalCommission = 0;

    // Date boundaries for "today"
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 3️⃣ Get all users under manager's team (both direct and through ambassadors)
    const teamUserIds = await User.find({
      $or: [
        { managerId: managerId },
        { ambassadorId: { $in: ambassadors.map(a => a._id) } }
      ],
      role: "user"
    }).distinct("_id");
    totalUsers = teamUserIds.length;

    // 4️⃣ Get today's sales for entire team
    const todaySales = await Sale.aggregate([
      { 
        $match: { 
          $or: [
            { userId: { $in: teamUserIds } },
            { ambassadorId: { $in: ambassadors.map(a => a._id) } }
          ],
          saleDate: { $gte: startOfDay, $lte: endOfDay } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$saleAmount" } } }
    ]);
    totalTodaySales = todaySales[0]?.total || 0;

    // 5️⃣ Get all-time sales for team
    const allTimeSales = await Sale.aggregate([
      { 
        $match: { 
          $or: [
            { userId: { $in: teamUserIds } },
            { ambassadorId: { $in: ambassadors.map(a => a._id) } }
          ]
        } 
      },
      { $group: { _id: null, total: { $sum: "$saleAmount" } } }
    ]);
    totalAllTimeSales = allTimeSales[0]?.total || 0;

    // 6️⃣ Get manager's total commission (from wallet or commission records)
    const totalCommissionResult = await Commission.aggregate([
      { $match: { userId: managerId, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    totalCommission = totalCommissionResult[0]?.total || 0;

    // 7️⃣ Get sales by product/service
    const salesByProduct = await Sale.aggregate([
      { 
        $match: { 
          $or: [
            { userId: { $in: teamUserIds } },
            { ambassadorId: { $in: ambassadors.map(a => a._id) } }
          ]
        } 
      },
      { $group: { _id: "$productId", totalSales: { $sum: "$saleAmount" } } },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: { productName: "$product.name", totalSales: 1 } }
    ]);

    // 8️⃣ Prepare ambassador performance data
    const ambassadorsPerformance = await Promise.all(
      ambassadors.map(async (ambassador) => {
        const ambassadorUsers = await User.find({
          ambassadorId: ambassador._id
        }).distinct("_id");

        const ambassadorSales = await Sale.aggregate([
          {
            $match: {
              $or: [
                { userId: { $in: ambassadorUsers } },
                { ambassadorId: ambassador._id }
              ]
            }
          },
          {
            $facet: {
              today: [
                {
                  $match: {
                    saleDate: { $gte: startOfDay, $lte: endOfDay }
                  }
                },
                { $group: { _id: null, total: { $sum: "$saleAmount" } } }
              ],
              allTime: [
                { $group: { _id: null, total: { $sum: "$saleAmount" } } }
              ]
            }
          }
        ]);

        return {
          name: `${ambassador.firstName} ${ambassador.lastName}`,
          usersCount: ambassadorUsers.length,
          todaySales: ambassadorSales[0]?.today[0]?.total || 0,
          allTimeSales: ambassadorSales[0]?.allTime[0]?.total || 0
        };
      })
    );

    // 9️⃣ Prepare final report
    const report = {
      managerInfo: {
        name: `${manager.firstName} ${manager.lastName}`,
        email: manager.email,
        phone: manager.phone
      },
      teamStats: {
        totalAmbassadors,
        totalUsers,
        totalTodaySales,
        totalAllTimeSales,
        totalCommission
      },
      salesByProduct,
      ambassadorsPerformance
    };

    // 🔟 Send email report (fire and forget)
    sendManagerReportEmail(manager.email, report)
      .catch(err => console.error('Email sending failed:', err));

    // Return the JSON response
    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Error generating manager report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};