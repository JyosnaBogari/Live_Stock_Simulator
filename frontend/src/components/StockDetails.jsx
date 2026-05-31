import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useAuth } from "../store/authStore.js";
import { useStock } from "../store/stockStore.js";
import { useSocket } from "../store/socketStore.js";
import TradingViewChart from "./TradingViewChart";

import {
  pageWrapper,
  mutedText,
  cardClass,
  inputClass,
  primaryBtn,
  dangerBtn,
} from "../styles/common.js";

const fallbackStocks = [
  {
    symbol: "AAPL",
    companyName: "Apple",
    price: 312.06,
    change: "-0.14%",
    about:
      "Apple is a technology company known for iPhone, Mac, iPad, Apple Watch, AirPods, and digital services.",
    related: ["MSFT", "GOOGL", "AMZN"],
  },
  {
    symbol: "TSLA",
    companyName: "Tesla",
    price: 435.79,
    change: "-1.43%",
    about:
      "Tesla manufactures electric vehicles, batteries, solar products, and energy storage systems.",
    related: ["NVDA", "AAPL", "AMZN"],
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft",
    price: 441.31,
    change: "+3.35%",
    about:
      "Microsoft builds Windows, Azure cloud, Office, Xbox, LinkedIn, and AI tools.",
    related: ["AAPL", "GOOGL", "NVDA"],
  },
  {
    symbol: "GOOGL",
    companyName: "Google",
    price: 380.85,
    change: "-2.38%",
    about:
      "Google provides search, YouTube, Android, advertising, cloud computing, and AI services.",
    related: ["MSFT", "META", "AMZN"],
  },
  {
    symbol: "AMZN",
    companyName: "Amazon",
    price: 185.25,
    change: "+0.88%",
    about:
      "Amazon operates e-commerce, AWS cloud, Prime, streaming, logistics, and digital services.",
    related: ["MSFT", "GOOGL", "NFLX"],
  },
  {
    symbol: "NVDA",
    companyName: "Nvidia",
    price: 950.4,
    change: "+2.21%",
    about:
      "Nvidia designs GPUs and AI chips used in gaming, data centers, cloud, and artificial intelligence.",
    related: ["MSFT", "TSLA", "AAPL"],
  },
  {
    symbol: "META",
    companyName: "Meta",
    price: 485.2,
    change: "+1.15%",
    about:
      "Meta owns Facebook, Instagram, WhatsApp, Threads, and invests in AI and metaverse technologies.",
    related: ["GOOGL", "NFLX", "AMZN"],
  },
  {
    symbol: "NFLX",
    companyName: "Netflix",
    price: 650.8,
    change: "+0.76%",
    about:
      "Netflix is a streaming entertainment company offering movies, series, documentaries, and original content.",
    related: ["AMZN", "META", "GOOGL"],
  },
  {
    symbol: "NIFTY50",
    companyName: "NIFTY 50",
    price: 23547.75,
    change: "-1.50%",
    about:
      "NIFTY 50 is an Indian stock market index representing 50 major companies listed on NSE.",
    related: ["SENSEX", "SPY", "QQQ"],
  },
  {
    symbol: "SENSEX",
    companyName: "SENSEX",
    price: 74775.74,
    change: "-1.44%",
    about:
      "SENSEX is a stock market index representing 30 major companies listed on BSE India.",
    related: ["NIFTY50", "SPY", "QQQ"],
  },
  {
    symbol: "GOLD",
    companyName: "Gold",
    price: 4593,
    change: "+1.34%",
    about:
      "Gold is a commodity often used as a safe-haven asset during inflation or uncertainty.",
    related: ["SILVER", "GLD", "USDINR"],
  },
  {
    symbol: "SILVER",
    companyName: "Silver",
    price: 75.8,
    change: "-0.05%",
    about:
      "Silver is a precious metal used in jewelry, electronics, industry, and investment.",
    related: ["GOLD", "GLD", "CRUDE"],
  },
  {
    symbol: "USDINR",
    companyName: "USD / INR",
    price: 83.2,
    change: "-0.71%",
    about:
      "USD/INR shows the value of the US Dollar compared to the Indian Rupee.",
    related: ["EURINR", "GOLD", "SENSEX"],
  },
  {
    symbol: "SPY",
    companyName: "SPY ETF",
    price: 520.4,
    change: "+0.22%",
    about:
      "SPY is an ETF that tracks the S&P 500 index and trades like a stock.",
    related: ["QQQ", "GLD", "AAPL"],
  },
  {
    symbol: "QQQ",
    companyName: "QQQ ETF",
    price: 445.6,
    change: "+0.36%",
    about: "QQQ is an ETF that tracks the NASDAQ 100 index.",
    related: ["SPY", "NVDA", "MSFT"],
  },
  {
    symbol: "GLD",
    companyName: "Gold ETF",
    price: 215.2,
    change: "+1.10%",
    about: "GLD is an ETF designed to track the price of gold.",
    related: ["GOLD", "SILVER", "SPY"],
  },
];

function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState("");

  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  const buyStock = useStock((state) => state.buyStock);
  const sellStock = useStock((state) => state.sellStock);
  const loading = useStock((state) => state.loading);
  const portfolio = useStock((state) => state.portfolio);
  const fetchPortfolio = useStock((state) => state.fetchPortfolio);
  const stockDetails = useStock((state) => state.stockDetails);
  const fetchStockDetails = useStock((state) => state.fetchStockDetails);

  const liveStocks = useSocket((state) => state.liveStocks);
  const isConnected = useSocket((state) => state.isConnected);
  const connectSocket = useSocket((state) => state.connectSocket);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  useEffect(() => {
    fetchStockDetails(symbol);
  }, [symbol, fetchStockDetails]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
    }
  }, [isAuthenticated, fetchPortfolio]);

  const stocks = fallbackStocks.map((item) => {
    const liveStock = liveStocks.find((live) => live.symbol === item.symbol);

    if (liveStock) {
      return {
        ...item,
        price: liveStock.price,
        change: liveStock.change,
      };
    }

    return item;
  });

  const stock = stocks.find(
    (item) => item.symbol.toUpperCase() === symbol?.toUpperCase()
  );

  const ownedStock = portfolio.find((item) => item.symbol === stock?.symbol);

  if (!stock) {
    return (
      <div className={pageWrapper}>
        <div className={cardClass}>
          <h1 className="text-2xl font-bold text-red-500">Stock not found</h1>
          <p className="text-slate-600 dark:text-gray-300 mt-2">
            The asset you are looking for is not available in this simulator.
          </p>
        </div>
      </div>
    );
  }

  const handleBuy = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: { pathname: `/stock/${symbol}` } } });
      return;
    }

    const stockQuantity = Number(quantity);

    if (!stockQuantity || stockQuantity <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    const result = await buyStock({
      symbol: stock.symbol,
      companyName: stock.companyName,
      quantity: stockQuantity,
      price: stock.price,
    });

    if (result.success) {
      toast.success("Stock bought successfully");
      setQuantity("");
      fetchPortfolio();
    } else {
      toast.error(result.message || "Failed to buy stock");
    }
  };

  const handleSell = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: { pathname: `/stock/${symbol}` } } });
      return;
    }

    const stockQuantity = Number(quantity);

    if (!stockQuantity || stockQuantity <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    const result = await sellStock({
      symbol: stock.symbol,
      companyName: stock.companyName,
      quantity: stockQuantity,
      price: stock.price,
    });

    if (result.success) {
      toast.success("Stock sold successfully");
      setQuantity("");
      fetchPortfolio();
    } else {
      toast.error(result.message || "Failed to sell stock");
    }
  };

  const analytics = stockDetails;

  const stats = [
    [
      "Current Price",
      analytics?.currentPrice
        ? `₹${Number(analytics.currentPrice).toFixed(2)}`
        : "Loading...",
    ],
    ["Day Change", analytics?.change || "Loading..."],
    ["Market Cap", analytics?.marketCap || "Loading..."],
    ["Volume", analytics?.volume || "Loading..."],
    ["P/E Ratio", analytics?.peRatio || "Loading..."],
    ["52 Week High", analytics?.high52 || "Loading..."],
    ["52 Week Low", analytics?.low52 || "Loading..."],
  ];

  const rating = analytics?.rating || {
    buy: 0,
    hold: 0,
    sell: 0,
  };

  return (
    <div className={pageWrapper}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
            Stock Details
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {stock.symbol}
          </h1>

          <p className="text-slate-500 dark:text-gray-400 mt-1">
            {stock.companyName}
          </p>
        </div>

        <span
          className={
            isConnected
              ? "px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold"
              : "px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold"
          }
        >
          {isConnected ? "Live Connected" : "Disconnected"}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-green-500">
                {stock.symbol}
              </h2>

              <p className="text-lg text-slate-600 dark:text-gray-300 mt-2">
                {stock.companyName}
              </p>
            </div>

            <span className="w-fit px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0f1b2e] text-slate-600 dark:text-gray-300 text-sm font-semibold">
              Simulator Asset
            </span>
          </div>

          <p className="text-4xl font-bold mt-6 text-slate-900 dark:text-white">
            ₹{Number(stock.price).toFixed(2)}
          </p>

          <p
            className={
              stock.change.startsWith("+")
                ? "text-green-500 mt-2 font-bold"
                : "text-red-500 mt-2 font-bold"
            }
          >
            {stock.change}
          </p>

          <p className="text-slate-600 dark:text-gray-300 mt-6 leading-relaxed">
            {stock.about}
          </p>

          {isAuthenticated && (
            <div className="mt-6 bg-slate-100 dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-xl p-4">
              <p className={mutedText}>You Own</p>

              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {ownedStock ? `${ownedStock.quantity} shares` : "0 shares"}
              </p>

              {ownedStock && (
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                  Avg Price: ₹{ownedStock.avgBuyPrice.toFixed(2)}
                </p>
              )}
            </div>
          )}

          <div className="mt-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className={inputClass}
            />

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleBuy}
                disabled={loading}
                className={primaryBtn}
              >
                {loading ? "Processing..." : "Buy Stock"}
              </button>

              <button
                onClick={handleSell}
                disabled={loading}
                className={dangerBtn}
              >
                {loading ? "Processing..." : "Sell Stock"}
              </button>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Live Candlestick Chart
              </h2>

              <p className={mutedText}>
                Powered by TradingView chart widget.
              </p>
            </div>
          </div>

          <TradingViewChart symbol={stock.symbol} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map(([label, value]) => (
          <div key={label} className={cardClass}>
            <p className={mutedText}>{label}</p>

            <h3 className="font-bold mt-2 text-slate-900 dark:text-white break-words">
              {value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className={cardClass}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analyst Rating
          </h2>

          <div className="mt-5 space-y-4">
            {[
              ["Buy", rating.buy, "bg-green-500"],
              ["Hold", rating.hold, "bg-amber-500"],
              ["Sell", rating.sell, "bg-red-500"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between mb-2 text-sm font-medium text-slate-700 dark:text-gray-300">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-[#0f1b2e] rounded-full overflow-hidden">
                  <div
                    className={`${color} h-full rounded-full`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Related Assets
          </h2>

          <div className="flex flex-wrap gap-3 mt-5">
            {(stock.related || []).map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/stock/${item}`)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition font-semibold"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`${cardClass} mt-8`}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Educational AI View
        </h2>

        <p className="mt-3 text-slate-600 dark:text-gray-300 leading-relaxed">
          {analytics?.recommendation || "Loading analysis."}
        </p>

        <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">
          Source: {analytics?.source || "Finnhub"} | This is educational
          information only, not financial advice.
        </p>
      </div>

      <p className="mt-8 text-sm text-slate-500 dark:text-gray-400">
        Educational simulator only. This is not financial advice.
      </p>
    </div>
  );
}

export default StockDetails;