import { useEffect } from "react";
import { useAuth } from "../store/authStore.js";
import { useStock } from "../store/stockStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

function Dashboard() {
  const currentUser = useAuth((state) => state.currentUser);

  const portfolio = useStock((state) => state.portfolio);
  const walletBalance = useStock((state) => state.walletBalance);
  const fetchPortfolio = useStock((state) => state.fetchPortfolio);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const investedAmount = portfolio.reduce((total, stock) => {
    return total + stock.quantity * stock.avgBuyPrice;
  }, 0);

  const finalWallet = walletBalance || currentUser?.walletBalance || 100000;

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Trader Dashboard
        </p>

        <h1 className={pageTitleClass}>Dashboard</h1>

        <p className={`${mutedText} mt-2`}>
          Welcome {currentUser?.firstName || "Trader"}, track your virtual
          trading journey.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className={cardClass}>
          <p className={mutedText}>Virtual Wallet</p>

          <h2 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">
            ₹{finalWallet.toFixed(2)}
          </h2>

          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
            Available virtual balance
          </p>
        </div>

        <div className={cardClass}>
          <p className={mutedText}>Invested Amount</p>

          <h2 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">
            ₹{investedAmount.toFixed(2)}
          </h2>

          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
            Total amount used for buying stocks
          </p>
        </div>

        <div className={cardClass}>
          <p className={mutedText}>Total Portfolio Value</p>

          <h2 className="text-3xl font-bold mt-3 text-green-500">
            ₹{investedAmount.toFixed(2)}
          </h2>

          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
            Current portfolio value in simulator
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Quick Summary
        </h2>

        <p className="text-slate-600 dark:text-gray-300 mt-2 leading-relaxed">
          Use the market page to buy stocks, portfolio page to manage holdings,
          alerts page to track price targets, and watchlist page to follow
          stocks before buying.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;