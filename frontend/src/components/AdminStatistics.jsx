import { useEffect } from "react";
import { useAdmin } from "../store/adminStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  tableWrapper,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableCellClass,
} from "../styles/common.js";

function AdminStatistics() {
  const analytics = useAdmin((state) => state.analytics);
  const fetchAnalytics = useAdmin((state) => state.fetchAnalytics);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const buyCount =
    analytics?.buySell?.find((item) => item._id === "BUY")?.count || 0;
  const sellCount =
    analytics?.buySell?.find((item) => item._id === "SELL")?.count || 0;

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
          Trading Analytics
        </p>

        <h1 className={pageTitleClass}>Trading Analytics</h1>

        <p className={`${mutedText} mt-2`}>
          Understand what users are trading and which stocks are most popular.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className={cardClass}>
          <p className={mutedText}>Buy Trades</p>
          <h2 className="text-3xl font-bold mt-3 text-green-500">{buyCount}</h2>
        </div>

        <div className={cardClass}>
          <p className={mutedText}>Sell Trades</p>
          <h2 className="text-3xl font-bold mt-3 text-red-500">{sellCount}</h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10">
        Most Traded Stocks
      </h2>

      <div className={tableWrapper}>
        <table className={tableClass}>
          <thead className={tableHeadClass}>
            <tr>
              <th className={tableCellClass}>Stock</th>
              <th className={tableCellClass}>Trades</th>
              <th className={tableCellClass}>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {analytics?.mostTradedStocks?.map((stock) => (
              <tr key={stock._id} className={tableRowClass}>
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  {stock._id}
                </td>
                <td className={tableCellClass}>{stock.trades}</td>
                <td className={tableCellClass}>{stock.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10">
        Recent Trades
      </h2>

      <div className={tableWrapper}>
        <table className={tableClass}>
          <thead className={tableHeadClass}>
            <tr>
              <th className={tableCellClass}>Type</th>
              <th className={tableCellClass}>Stock</th>
              <th className={tableCellClass}>Quantity</th>
              <th className={tableCellClass}>Price</th>
              <th className={tableCellClass}>Total</th>
            </tr>
          </thead>

          <tbody>
            {analytics?.recentTrades?.map((trade) => (
              <tr key={trade._id} className={tableRowClass}>
                <td className={tableCellClass}>
                  <span
                    className={
                      trade.type === "BUY"
                        ? "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                        : "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                    }
                  >
                    {trade.type}
                  </span>
                </td>

                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  {trade.symbol}
                </td>

                <td className={tableCellClass}>{trade.quantity}</td>
                <td className={tableCellClass}>₹{trade.price}</td>
                <td className={tableCellClass}>₹{trade.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStatistics;