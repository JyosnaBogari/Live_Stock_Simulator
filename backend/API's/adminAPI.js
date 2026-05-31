import exp from "express";
import { UserTypeModel } from "../Models/UserTypeModel.js";
import { PortfolioModel } from "../Models/PortfolioModel.js";
import { TransactionModel } from "../Models/TransactionModel.js";
import { ReportModel } from "../Models/ReportModel.js";
import { verifyToken } from "../Middleware/verifyToken.js";
import { verifyAdmin } from "../Middleware/verifyAdmin.js";
import axios from "axios";

export const adminRoute = exp.Router();

adminRoute.get("/stats", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const userFilter = {
      $or: [{ role: "USER" }, { role: { $exists: false } }],
    };

    const totalUsers = await UserTypeModel.countDocuments(userFilter);

    const activeUsers = await UserTypeModel.countDocuments({
      ...userFilter,
      isActive: true,
    });

    const blockedUsers = await UserTypeModel.countDocuments({
      ...userFilter,
      isActive: false,
    });

    const totalTrades = await TransactionModel.countDocuments();
    const buyTrades = await TransactionModel.countDocuments({ type: "BUY" });
    const sellTrades = await TransactionModel.countDocuments({ type: "SELL" });

    const investedData = await TransactionModel.aggregate([
      { $match: { type: "BUY" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const mostTraded = await TransactionModel.aggregate([
      {
        $group: {
          _id: "$symbol",
          trades: { $sum: 1 },
          quantity: { $sum: "$quantity" },
        },
      },
      { $sort: { trades: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      message: "stats fetched",
      payload: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalTrades,
        buyTrades,
        sellTrades,
        totalVirtualMoneyInvested: investedData[0]?.total || 0,
        mostTradedStock: mostTraded[0]?._id || "N/A",
      },
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.get("/users", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const users = await UserTypeModel.find({ role: "USER" })
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithPortfolioCount = await Promise.all(
      users.map(async (user) => {
        const portfolioCount = await PortfolioModel.countDocuments({
          userId: user._id,
        });

        return {
          ...user.toObject(),
          portfolioCount,
        };
      })
    );

    res.status(200).json({
      message: "users fetched",
      payload: usersWithPortfolioCount,
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.put(
  "/users/:userId/status",
  verifyToken,
  verifyAdmin,
  async (req, res, next) => {
    try {
      const { isActive } = req.body;

      const updatedUser = await UserTypeModel.findByIdAndUpdate(
        req.params.userId,
        { isActive },
          { returnDocument: "after" }
      ).select("-password");

      res.status(200).json({
        message: isActive ? "user unblocked" : "user blocked",
        payload: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

adminRoute.get("/analytics", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const recentTrades = await TransactionModel.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const mostTradedStocks = await TransactionModel.aggregate([
      {
        $group: {
          _id: "$symbol",
          trades: { $sum: 1 },
          quantity: { $sum: "$quantity" },
        },
      },
      { $sort: { trades: -1 } },
      { $limit: 5 },
    ]);

    const buySell = await TransactionModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: "analytics fetched",
      payload: {
        recentTrades,
        mostTradedStocks,
        buySell,
      },
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.post("/reports", verifyToken, async (req, res, next) => {
  try {
    const { type, subject, message } = req.body;

    if (!type || !subject || !message) {
      return res.status(400).json({
        message: "error occurred",
        error: "Type, subject, and message are required",
      });
    }

    const report = await ReportModel.create({
      userId: req.userObj._id,
      type,
      subject,
      message,
      status: "OPEN",
    });

    res.status(201).json({
      message: "report submitted",
      payload: report,
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.get("/reports", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const reports = await ReportModel.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "reports fetched",
      payload: reports,
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.put(
  "/reports/:reportId/resolve",
  verifyToken,
  verifyAdmin,
  async (req, res, next) => {
    try {
      const { adminReply } = req.body;

      const report = await ReportModel.findByIdAndUpdate(
        req.params.reportId,
        {
          status: "RESOLVED",
          adminReply,
          resolvedAt: new Date(),
        },
         { returnDocument: "after" }
      ).populate("userId", "firstName lastName email");

      res.status(200).json({
        message: "report resolved",
        payload: report,
      });
    } catch (err) {
      next(err);
    }
  }
);

adminRoute.get("/my-reports", verifyToken, async (req, res, next) => {
  try {
    const userId = req.userObj?._id || req.user?._id || req.userId || req.id;

    if (!userId) {
      return res.status(401).json({
        message: "error occurred",
        error: "Please login again",
      });
    }

    const reports = await ReportModel.find({
      userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "user reports fetched",
      payload: reports,
    });
  } catch (err) {
    next(err);
  }
});

adminRoute.get("/monitor", verifyToken, verifyAdmin, async (req, res) => {
  const checks = {
    backendStatus: "Running",
    databaseStatus: "Checking",
    finnhubStatus: "Checking",
    newsStatus: "Checking",
    aiStatus: "Checking",
    socketStatus: global.io?.engine?.clientsCount > 0 ? "Live" : "No Clients",
    activeSockets: global.io?.engine?.clientsCount || 0,
    lastChecked: new Date(),
  };

  try {
    await UserTypeModel.findOne().limit(1);
    checks.databaseStatus = "Connected";
  } catch {
    checks.databaseStatus = "Down";
  }

  try {
    const response = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol: "AAPL",
        token: process.env.FINNHUB_API_KEY,
      },
      timeout: 5000,
    });

    checks.finnhubStatus = response.data?.c ? "Connected" : "Issue";
  } catch {
    checks.finnhubStatus = "Down";
  }

  try {
    const response = await axios.get("https://finnhub.io/api/v1/company-news", {
      params: {
        symbol: "AAPL",
        from: "2026-05-01",
        to: "2026-05-30",
        token: process.env.FINNHUB_API_KEY,
      },
      timeout: 5000,
    });

    checks.newsStatus = Array.isArray(response.data) ? "Connected" : "Fallback";
  } catch {
    checks.newsStatus = "Fallback";
  }

  checks.aiStatus = process.env.GEMINI_API_KEY ? "Configured" : "Missing Key";

  res.status(200).json({
    message: "monitor fetched",
    payload: checks,
  });
});