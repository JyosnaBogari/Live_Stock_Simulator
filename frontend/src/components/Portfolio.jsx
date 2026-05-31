import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStock } from "../store/stockStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  dangerBtn,
  tableWrapper,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableCellClass,
} from "../styles/common.js";

function Portfolio() {
  const [sellQuantities, setSellQuantities] = useState({});

  const portfolio = useStock((state) => state.portfolio);
  const transactions = useStock((state) => state.transactions);
  const loading = useStock((state) => state.loading);
  const fetchPortfolio = useStock((state) => state.fetchPortfolio);
  const fetchTransactions = useStock((state) => state.fetchTransactions);
  const sellStock = useStock((state) => state.sellStock);

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, [fetchPortfolio, fetchTransactions]);

  const handleSellQuantityChange = (symbol, value) => {
    setSellQuantities({
      ...sellQuantities,
      [symbol]: value,
    });
  };

  const handleSell = async (stock) => {
    const quantity = Number(sellQuantities[stock.symbol]);

    if (!quantity || quantity <= 0) {
      toast.error("Enter valid sell quantity");
      return;
    }

    const result = await sellStock({
      symbol: stock.symbol,
      companyName: stock.companyName,
      quantity,
      price: stock.avgBuyPrice,
    });

    if (result.success) {
      toast.success("Stock sold successfully");
    } else {
      toast.error(result.message || "Failed to sell stock");
    }
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Portfolio
        </p>

        <h1 className={pageTitleClass}>My Portfolio</h1>

        <p className={`${mutedText} mt-2`}>
          Track your holdings, invested value, and sell stocks from your virtual
          portfolio.
        </p>
      </div>

      {loading && (
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            Loading portfolio...
          </p>
        </div>
      )}

      {!loading && portfolio.length === 0 ? (
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            No stocks bought yet.
          </p>
        </div>
      ) : (
        !loading && (
          <div className={tableWrapper}>
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableCellClass}>Symbol</th>
                  <th className={tableCellClass}>Company</th>
                  <th className={tableCellClass}>Quantity</th>
                  <th className={tableCellClass}>Avg Buy Price</th>
                  <th className={tableCellClass}>Invested</th>
                  <th className={tableCellClass}>Sell</th>
                </tr>
              </thead>

              <tbody>
                {portfolio.map((stock) => (
                  <tr key={stock._id} className={tableRowClass}>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {stock.symbol}
                    </td>

                    <td className={tableCellClass}>{stock.companyName}</td>

                    <td className={tableCellClass}>{stock.quantity}</td>

                    <td className={tableCellClass}>
                      ₹{stock.avgBuyPrice.toFixed(2)}
                    </td>

                    <td className={tableCellClass}>
                      ₹{(stock.quantity * stock.avgBuyPrice).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2 min-w-[220px]">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={sellQuantities[stock.symbol] || ""}
                          onChange={(e) =>
                            handleSellQuantityChange(
                              stock.symbol,
                              e.target.value
                            )
                          }
                          className={inputClass}
                        />

                        <button
                          onClick={() => handleSell(stock)}
                          disabled={loading}
                          className={dangerBtn}
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <div className={`${cardClass} mt-5`}>
            <p className="text-slate-600 dark:text-gray-300">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className={tableWrapper}>
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableCellClass}>Type</th>
                  <th className={tableCellClass}>Symbol</th>
                  <th className={tableCellClass}>Company</th>
                  <th className={tableCellClass}>Quantity</th>
                  <th className={tableCellClass}>Price</th>
                  <th className={tableCellClass}>Total</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className={tableRowClass}>
                    <td className={tableCellClass}>
                      <span
                        className={
                          tx.type === "BUY"
                            ? "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                            : "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                        }
                      >
                        {tx.type}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {tx.symbol}
                    </td>

                    <td className={tableCellClass}>{tx.companyName}</td>
                    <td className={tableCellClass}>{tx.quantity}</td>
                    <td className={tableCellClass}>₹{tx.price}</td>
                    <td className={tableCellClass}>₹{tx.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;