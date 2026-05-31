import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { marketCategories } from "../data/marketAssets.js";
import { useAuth } from "../store/authStore.js";
import { useStock } from "../store/stockStore.js";
import { useWatchlist } from "../store/watchlistStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common.js";

function Market() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Stocks");
  const [quantities, setQuantities] = useState({});

  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const buyStock = useStock((state) => state.buyStock);
  const loading = useStock((state) => state.loading);
  const addToWatchlist = useWatchlist((state) => state.addToWatchlist);

  const assets = marketCategories[activeCategory];

  const getDemoPrice = (symbol) => {
    const prices = {
      AAPL: 312.06,
      TSLA: 435.79,
      MSFT: 441.31,
      GOOGL: 380.85,
      AMZN: 185.25,
      NVDA: 950.4,
      NIFTY50: 23547.75,
      SENSEX: 74775.74,
      SPX: 7580.05,
      NDX: 30333.18,
      GOLD: 4593,
      SILVER: 75.8,
      CRUDE: 78.4,
      USDINR: 83.2,
      EURINR: 90.3,
      SPY: 520.4,
      QQQ: 445.6,
      GLD: 215.2,
    };

    return prices[symbol] || 100;
  };

  const getDemoChange = (symbol) => {
    const changes = {
      AAPL: "-0.14%",
      TSLA: "-1.43%",
      MSFT: "+3.35%",
      GOOGL: "-2.38%",
      AMZN: "+0.88%",
      NVDA: "+2.21%",
      NIFTY50: "-1.50%",
      SENSEX: "-1.44%",
      GOLD: "+1.34%",
      SILVER: "-0.05%",
      USDINR: "-0.71%",
      SPY: "+0.22%",
      QQQ: "+0.36%",
      GLD: "+1.10%",
    };

    return changes[symbol] || "+0.50%";
  };

  const handleQuantityChange = (symbol, value) => {
    setQuantities({ ...quantities, [symbol]: value });
  };

  const handleBuy = async (asset) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: { pathname: "/market" } } });
      return;
    }

    const quantity = Number(quantities[asset.symbol]);

    if (!quantity || quantity <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    const result = await buyStock({
      symbol: asset.symbol,
      companyName: asset.name,
      quantity,
      price: getDemoPrice(asset.symbol),
    });

    if (result.success) {
      toast.success(`${asset.symbol} bought successfully`);
      setQuantities({ ...quantities, [asset.symbol]: "" });
    } else {
      toast.error(result.message || "Failed to buy stock");
    }
  };

  const handleWatchlist = async (asset) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: { pathname: "/market" } } });
      return;
    }

    const result = await addToWatchlist({
      symbol: asset.symbol,
      companyName: asset.name,
      price: getDemoPrice(asset.symbol),
      change: getDemoChange(asset.symbol),
    });

    if (result.success) {
      toast.success("Added to watchlist");
    } else {
      toast.error(result.message || "Failed to add to watchlist");
    }
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Explore Market
        </p>

        <h1 className={pageTitleClass}>Market</h1>

        <p className={`${mutedText} mt-2 max-w-2xl`}>
          Explore stocks, indices, commodities, currency, and ETFs. Buy with
          virtual money or add assets to your watchlist.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.keys(marketCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={
              activeCategory === category
                ? "px-5 py-2 rounded-xl bg-green-500 text-black font-bold transition"
                : "px-5 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {assets.map((asset) => {
          const change = getDemoChange(asset.symbol);
          const isProfit = change.startsWith("+");

          return (
            <div key={asset.symbol} className={cardClass}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {asset.symbol}
                  </h2>

                  <p className="text-slate-500 dark:text-gray-400">
                    {asset.name}
                  </p>
                </div>

                <span
                  className={
                    isProfit
                      ? "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                      : "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                  }
                >
                  {change}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300 leading-relaxed min-h-[64px]">
                {asset.description}
              </p>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className={mutedText}>Price</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₹{getDemoPrice(asset.symbol).toFixed(2)}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0f1b2e] text-slate-600 dark:text-gray-300">
                  {asset.type}
                </span>
              </div>

              <div className="mt-5">
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={quantities[asset.symbol] || ""}
                  onChange={(e) =>
                    handleQuantityChange(asset.symbol, e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleBuy(asset)}
                  disabled={loading}
                  className={primaryBtn}
                >
                  Buy
                </button>

                <button
                  onClick={() => handleWatchlist(asset)}
                  className={secondaryBtn}
                >
                  Watchlist
                </button>
              </div>

              <button
                onClick={() => navigate(`/stock/${asset.symbol}`)}
                className="mt-3 w-full py-3 rounded-xl bg-slate-100 dark:bg-[#0f1b2e] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold transition"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Market;