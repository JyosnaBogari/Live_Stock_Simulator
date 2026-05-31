import { useEffect } from "react";
import { useStock } from "../store/stockStore.js";
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

function Leaderboard() {
  const leaderboard = useStock((state) => state.leaderboard);
  const loading = useStock((state) => state.loading);
  const fetchLeaderboard = useStock((state) => state.fetchLeaderboard);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Rankings
        </p>

        <h1 className={pageTitleClass}>Leaderboard</h1>

        <p className={`${mutedText} mt-2`}>
          Users are ranked by wallet balance and portfolio value.
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            No leaderboard data available yet.
          </p>
        </div>
      ) : (
        <div className={tableWrapper}>
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={tableCellClass}>Rank</th>
                <th className={tableCellClass}>User</th>
                <th className={tableCellClass}>Wallet</th>
                <th className={tableCellClass}>Invested</th>
                <th className={tableCellClass}>Total Value</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.userId} className={tableRowClass}>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    #{index + 1}
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user.firstName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </td>

                  <td className={tableCellClass}>
                    ₹{user.walletBalance.toFixed(2)}
                  </td>

                  <td className={tableCellClass}>
                    ₹{user.investedAmount.toFixed(2)}
                  </td>

                  <td className="p-4 text-green-500 font-bold">
                    ₹{user.totalValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;