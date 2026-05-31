// import express
import exp from "express";
import { UserTypeModel } from "../models/UserTypeModel.js";
import { getAllStockPrices } from "../Services/stockPriceService.js";
import { PortfolioModel } from "../models/PortfolioModel.js";
import { TransactionModel } from "../models/TransactionModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { AlertModel } from "../models/AlertModel.js";
import { generateAIResponse } from "../Services/aiService.js";
import { WatchlistModel } from "../models/WatchlistModel.js";
import { getCompanyNews } from "../Services/newsService.js";
import { getStockAnalytics } from "../Services/stockAnalyticsService.js";
import axios from "axios";
// create stock router
export const stockRoute = exp.Router();

// buy stock api
stockRoute.post("/buy", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id from token middleware
    const userId = req.user._id;

    // get stock details from frontend
    const { symbol, companyName, quantity, price } = req.body;

    // convert quantity to number
    const stockQuantity = Number(quantity);

    // convert price to number
    const stockPrice = Number(price);

    // calculate total cost
    const totalAmount = stockQuantity * stockPrice;

    // find user from database
    const user = await UserTypeModel.findById(userId);

    // check if user exists
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // check wallet balance
    if (user.walletBalance < totalAmount) {
      const err = new Error("Insufficient wallet balance");
      err.status = 400;
      throw err;
    }

    // find if user already has this stock
    const existingStock = await PortfolioModel.findOne({
      userId,
      symbol,
    });

    // if stock already exists in portfolio
    if (existingStock) {
      // calculate old investment amount
      const oldInvestment = existingStock.quantity * existingStock.avgBuyPrice;

      // calculate new investment amount
      const newInvestment = stockQuantity * stockPrice;

      // calculate total quantity
      const totalQuantity = existingStock.quantity + stockQuantity;

      // calculate new average buy price
      const newAvgBuyPrice = (oldInvestment + newInvestment) / totalQuantity;

      // update portfolio quantity
      existingStock.quantity = totalQuantity;

      // update average buy price
      existingStock.avgBuyPrice = newAvgBuyPrice;

      // save updated portfolio
      await existingStock.save();
    } else {
      // create new portfolio stock
      await PortfolioModel.create({
        userId,
        symbol,
        companyName,
        quantity: stockQuantity,
        avgBuyPrice: stockPrice,
      });
    }

    // reduce wallet balance
    user.walletBalance = user.walletBalance - totalAmount;

    // save updated user wallet
    await user.save();

    // save transaction history
    await TransactionModel.create({
      userId,
      symbol,
      companyName,
      type: "BUY",
      quantity: stockQuantity,
      price: stockPrice,
      totalAmount,
    });

    // send success response
    res.status(200).json({
      message: "stock bought successfully",
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    // forward error to global error handler
    next(err);
  }
});

// sell stock api
stockRoute.post("/sell", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get stock details from frontend
    const { symbol, companyName, quantity, price } = req.body;

    // convert quantity to number
    const stockQuantity = Number(quantity);

    // convert price to number
    const stockPrice = Number(price);

    // calculate sell amount
    const totalAmount = stockQuantity * stockPrice;

    // find user
    const user = await UserTypeModel.findById(userId);

    // find stock in user portfolio
    const portfolioStock = await PortfolioModel.findOne({
      userId,
      symbol,
    });

    // check if user owns stock
    if (!portfolioStock) {
      const err = new Error("You do not own this stock");
      err.status = 400;
      throw err;
    }

    // check quantity
    if (portfolioStock.quantity < stockQuantity) {
      const err = new Error("Not enough shares to sell");
      err.status = 400;
      throw err;
    }

    // reduce stock quantity
    portfolioStock.quantity = portfolioStock.quantity - stockQuantity;

    // if quantity becomes zero remove from portfolio
    if (portfolioStock.quantity === 0) {
      await PortfolioModel.deleteOne({
        _id: portfolioStock._id,
      });
    } else {
      await portfolioStock.save();
    }

    // increase wallet balance
    user.walletBalance = user.walletBalance + totalAmount;

    // save updated wallet
    await user.save();

    // save sell transaction
    await TransactionModel.create({
      userId,
      symbol,
      companyName,
      type: "SELL",
      quantity: stockQuantity,
      price: stockPrice,
      totalAmount,
    });

    // send success response
    res.status(200).json({
      message: "stock sold successfully",
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    // forward error to global error handler
    next(err);
  }
});

// get portfolio api
stockRoute.get("/portfolio", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get all stocks of logged in user
    const portfolio = await PortfolioModel.find({ userId });

    // send portfolio response
    res.status(200).json({
      message: "portfolio fetched successfully",
      payload: portfolio,
    });
  } catch (err) {
    // forward error to global error handler
    next(err);
  }
});

// get transaction history api
stockRoute.get("/transactions", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get user transactions latest first
    const transactions = await TransactionModel.find({ userId }).sort({
      createdAt: -1,
    });

    // send transaction response
    res.status(200).json({
      message: "transactions fetched successfully",
      payload: transactions,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// leaderboard api
stockRoute.get("/leaderboard", verifyToken, async (req, res, next) => {
  try {
    // get all users without password
    const users = await UserTypeModel.find().select("-password");

    // create empty leaderboard array
    const leaderboard = [];

    // loop all users
    for (const user of users) {
      // get current user's portfolio
      const portfolio = await PortfolioModel.find({ userId: user._id });

      // calculate invested amount
      const investedAmount = portfolio.reduce((total, stock) => {
        // add each stock investment
        return total + stock.quantity * stock.avgBuyPrice;
      }, 0);

      // calculate total account value
      const totalValue = user.walletBalance + investedAmount;

      // push user ranking data
      leaderboard.push({
        // user id
        userId: user._id,

        // user first name
        firstName: user.firstName,

        // user email
        email: user.email,

        // wallet balance
        walletBalance: user.walletBalance,

        // invested amount
        investedAmount,

        // total value
        totalValue,
      });
    }

    // sort users by total value highest first
    leaderboard.sort((a, b) => b.totalValue - a.totalValue);

    // send leaderboard response
    res.status(200).json({
      message: "leaderboard fetched successfully",
      payload: leaderboard,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// create alert api
stockRoute.post("/alerts", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get alert data from frontend
    const { symbol, companyName, targetPrice, condition } = req.body;

    // create alert in database
    const alert = await AlertModel.create({
      userId,
      symbol,
      companyName,
      targetPrice: Number(targetPrice),
      condition,
    });

    // send success response
    res.status(201).json({
      message: "alert created successfully",
      payload: alert,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// get user alerts api
stockRoute.get("/alerts", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get alerts of logged in user
    const alerts = await AlertModel.find({ userId }).sort({
      createdAt: -1,
    });

    // send alerts response
    res.status(200).json({
      message: "alerts fetched successfully",
      payload: alerts,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// delete alert api
stockRoute.delete("/alerts/:alertId", verifyToken, async (req, res, next) => {
  try {
    // get alert id from url
    const { alertId } = req.params;

    // get logged in user id
    const userId = req.user._id;

    // delete only logged in user's alert
    const deletedAlert = await AlertModel.findOneAndDelete({
      _id: alertId,
      userId,
    });

    // check alert exists
    if (!deletedAlert) {
      const err = new Error("Alert not found");
      err.status = 404;
      throw err;
    }

    // send delete response
    res.status(200).json({
      message: "alert deleted successfully",
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// get real market prices api
stockRoute.get("/market-prices", async (req, res, next) => {
  try {
    // get live prices from external api
    const stocks = await getAllStockPrices();

    // send response
    res.status(200).json({
      message: "market prices fetched successfully",
      payload: stocks,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// ai assistant api
stockRoute.post("/ai-chat", async (req, res, next) => {
  try {
    // get message from frontend
    const { message } = req.body;

    // validate message
    if (!message) {
      const err = new Error("Message is required");
      err.status = 400;
      throw err;
    }

    // generate ai response
    const aiReply = await generateAIResponse(message);

    // send ai response
    res.status(200).json({
      message: "AI response generated successfully",
      payload: aiReply,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});


// add stock to watchlist api
stockRoute.post("/watchlist", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get stock data from frontend
    const { symbol, companyName, price, change } = req.body;

    // check if stock already exists in user's watchlist
    const existingStock = await WatchlistModel.findOne({
      userId,
      symbol,
    });

    // if already exists throw error
    if (existingStock) {
      const err = new Error("Stock already in watchlist");
      err.status = 409;
      throw err;
    }

    // create watchlist item
    const watchlistStock = await WatchlistModel.create({
      userId,
      symbol,
      companyName,
      price,
      change,
    });

    // send success response
    res.status(201).json({
      message: "stock added to watchlist",
      payload: watchlistStock,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// get user watchlist api
stockRoute.get("/watchlist", verifyToken, async (req, res, next) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // get watchlist stocks of logged in user
    const watchlist = await WatchlistModel.find({ userId }).sort({
      createdAt: -1,
    });

    // send watchlist response
    res.status(200).json({
      message: "watchlist fetched successfully",
      payload: watchlist,
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// remove stock from watchlist api
stockRoute.delete("/watchlist/:watchlistId", verifyToken, async (req, res, next) => {
  try {
    // get watchlist id from url
    const { watchlistId } = req.params;

    // get logged in user id
    const userId = req.user._id;

    // delete only logged in user's watchlist item
    const deletedStock = await WatchlistModel.findOneAndDelete({
      _id: watchlistId,
      userId,
    });

    // check if stock exists
    if (!deletedStock) {
      const err = new Error("Watchlist stock not found");
      err.status = 404;
      throw err;
    }

    // send success response
    res.status(200).json({
      message: "stock removed from watchlist",
    });
  } catch (err) {
    // forward error
    next(err);
  }
});

// get company news api
stockRoute.get("/news/:symbol",async (req, res, next) => {
  try {
    // get symbol from url
    const { symbol } = req.params;

    // fetch news from finnhub
    const news = await getCompanyNews(symbol);

    // send news response
    res.status(200).json({
      message: "news fetched successfully",
      payload: news,
    });
  } catch (err) {
    // forward error to global error handler
    next(err);
  }
});

stockRoute.get("/details/:symbol", async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const analytics = await getStockAnalytics(symbol);

    res.status(200).json({
      message: "stock analytics fetched",
      payload: analytics,
    });
  } catch (err) {
    next(err);
  }
});

