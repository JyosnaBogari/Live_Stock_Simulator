import exp from "express";
import http from "http";
import { Server } from "socket.io";
import { connect } from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRoute } from "./API's/userAPI.js";
import { adminRoute } from "./API's/adminAPI.js";
import { stockRoute } from "./API's/stockAPI.js";
import { reportRoute } from "./API's/reportAPI.js";
import helmet from "helmet"; // import helmet for security headers
import rateLimit from "express-rate-limit";  // import rate limit for preventing too many requests

// load .env variables
config();

// create express app
const app = exp();

// create http server using express app
const server = http.createServer(app);

// create socket io server
const io = new Server(server, {
  // allow frontend socket connection
  cors: {
    // frontend url
    origin: "http://localhost:5173",
    // allow cookies
    credentials: true,
  },
});


// get port from .env
const PORT = process.env.PORT || 3000;

// allow frontend API calls
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

// limit too many api requests
const apiLimiter = rateLimit({
  // time window
  windowMs: 15 * 60 * 1000,
  // max requests per ip
  max: 200,
  // response message
  message: {
    message: "error occurred",
    error: "Too many requests, please try again later",
  },
});


app.use(helmet()); // add security headers
app.use(apiLimiter); // apply limiter to all api routes
app.use(exp.json());
app.use(cookieParser());
app.use("/user-api", userRoute);
app.use("/admin-api", adminRoute);
app.use("/stock-api", stockRoute);
app.use("/report-api", reportRoute);


// demo stock prices
let liveStocks = [
  { symbol: "AAPL", companyName: "Apple", price: 312.06, change: "+0.00%" },
  { symbol: "TSLA", companyName: "Tesla", price: 435.79, change: "+0.00%" },
  { symbol: "MSFT", companyName: "Microsoft", price: 441.31, change: "+0.00%" },
  { symbol: "GOOGL", companyName: "Google", price: 380.85, change: "+0.00%" },
  { symbol: "AMZN", companyName: "Amazon", price: 185.25, change: "+0.00%" },
  { symbol: "NVDA", companyName: "Nvidia", price: 950.4, change: "+0.00%" },
  { symbol: "META", companyName: "Meta", price: 485.2, change: "+0.00%" },
  { symbol: "NFLX", companyName: "Netflix", price: 650.8, change: "+0.00%" },
  { symbol: "TCS", companyName: "TCS", price: 4020, change: "+0.00%" },
  { symbol: "INFY", companyName: "Infosys", price: 1520, change: "+0.00%" },
];

let stockHistory = {};

liveStocks.forEach((stock) => {
  stockHistory[stock.symbol] = [
    {
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      price: stock.price,
    },
  ];
});

// function to update demo stock prices randomly
const updateLivePrices = () => {
  liveStocks = liveStocks.map((stock) => {
    const randomPercent = Math.random() * 2 - 1;
    const priceChange = stock.price * (randomPercent / 100);
    const newPrice = Number((stock.price + priceChange).toFixed(2));

    const changeText = `${randomPercent >= 0 ? "+" : ""}${randomPercent.toFixed(
      2
    )}%`;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    stockHistory[stock.symbol] = [
      ...(stockHistory[stock.symbol] || []),
      {
        time,
        price: newPrice,
      },
    ].slice(-20);

    return {
      ...stock,
      price: newPrice,
      change: changeText,
    };
  });

  io.emit("stockPrices", liveStocks);
  io.emit("stockHistory", stockHistory);
};


// socket connection event
io.on("connection", (socket) => {
  // show socket connected message
  console.log("Socket connected:", socket.id);
  // send current prices immediately after connection
  socket.emit("stockPrices", liveStocks);
  socket.emit("stockHistory", stockHistory);
  // socket disconnect event
  socket.on("disconnect", () => {
    // show socket disconnected message
    console.log("Socket disconnected:", socket.id);
  });
});


global.io = io;

// update prices every 3 seconds
setInterval(updateLivePrices, 3000);


// database connection function
const connectDB = async () => {
  try {
    // connect mongodb
    await connect(process.env.DB_URL);

    // show success message
    console.log("MongoDB connected");

    // start http server instead of app.listen
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    // show database error
    console.log("Database connection failed:", err.message);
  }
};

// call database connection
connectDB();

// invalid path handler
app.use((req, res) => {
  // send invalid path response
  res.status(404).json({
    message: `${req.url} is invalid path`,
  });
});

// global error handler
app.use((err, req, res, next) => {
  // print backend error
  console.log("FULL BACKEND ERROR:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      message: "error occurred",
      error: "Email already exists",
    });
  }

  // custom error
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: err.message || "Server side error",
  });
});