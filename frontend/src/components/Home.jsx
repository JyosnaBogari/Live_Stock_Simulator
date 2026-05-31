import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSocket } from "../store/socketStore.js";

function Home() {
  const navigate = useNavigate();

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const liveStocks = useSocket((state) => state.liveStocks);
  const stockHistory = useSocket((state) => state.stockHistory);
  const isConnected = useSocket((state) => state.isConnected);
  const connectSocket = useSocket((state) => state.connectSocket);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const selectedStock = liveStocks.find(
    (stock) => stock.symbol === selectedSymbol
  );

  const chartData = stockHistory[selectedSymbol] || [];

  const topMovers = useMemo(() => {
    if (!liveStocks.length) return [];

    return [...liveStocks]
      .sort(
        (a, b) =>
          Math.abs(parseFloat(b.change)) - Math.abs(parseFloat(a.change))
      )
      .slice(0, 4);
  }, [liveStocks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08111f] text-slate-900 dark:text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Virtual Stock Market Simulator
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-950 dark:text-white">
            Learn Stock Trading With Virtual Money
          </h1>

          <p className="mt-5 text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Practice trading, track your portfolio, explore live simulator
            prices, read market news, and learn investing safely without using
            real money.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/market")}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition shadow-sm"
            >
              View Market
            </button>

            <button
              onClick={() => navigate("/learn")}
              className="px-6 py-3 border border-slate-300 dark:border-white/20 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              Learn Investing
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-10">
            <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-500">₹1L</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                Virtual Wallet
              </p>
            </div>

            <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-500">Live</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                Price Updates
              </p>
            </div>

            <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-500">AI</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                Stock Assistant
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Live Stock Chart
              </h2>

              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                Select a stock and watch simulator price movement.
              </p>
            </div>

            <span
              className={
                isConnected
                  ? "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                  : "px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold"
              }
            >
              {isConnected ? "Live connected" : "Connecting..."}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0f1b2e] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-green-500"
            >
              {liveStocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.companyName}
                </option>
              ))}
            </select>

            {selectedStock && (
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{Number(selectedStock.price).toFixed(2)}
                </p>

                <p
                  className={
                    selectedStock.change.startsWith("+")
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {selectedStock.change}
                </p>
              </div>
            )}
          </div>

          <div className="h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  fill="#22c55e33"
                  strokeWidth={3}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 bg-slate-100 dark:bg-[#0f1b2e] rounded-xl p-4 text-sm text-slate-600 dark:text-gray-300">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              How to read this chart?
            </h3>

            <p>• X-axis shows time.</p>
            <p>• Y-axis shows selected stock price.</p>
            <p>• Upward movement means the price is increasing.</p>
            <p>• Downward movement means the price is decreasing.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Top Market Movers
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-1">
              Stocks with highest simulator movement.
            </p>
          </div>

          <button
            onClick={() => navigate("/market")}
            className="hidden sm:inline-flex px-5 py-3 rounded-xl border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            Explore All
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topMovers.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{stock.symbol}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {stock.companyName}
                  </p>
                </div>

                <span
                  className={
                    stock.change.startsWith("+")
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {stock.change}
                </span>
              </div>

              <p className="text-2xl font-bold mt-5">
                ₹{Number(stock.price).toFixed(2)}
              </p>

              <button
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="mt-5 w-full py-3 rounded-xl bg-slate-100 dark:bg-[#0f1b2e] hover:bg-slate-200 dark:hover:bg-white/10 font-semibold transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;