import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "../store/adminStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

function AdminDashboard() {
  const stats = useAdmin((state) => state.stats);
  const fetchStats = useAdmin((state) => state.fetchStats);

  useEffect(() => {
    const load = async () => {
      const result = await fetchStats();
      if (!result.success) toast.error(result.message || "Failed to fetch stats");
    };
    load();
  }, [fetchStats]);

  const cards = [
    ["Total Users", stats?.totalUsers],
    ["Active Users", stats?.activeUsers],
    ["Blocked Users", stats?.blockedUsers],
    ["Total Trades", stats?.totalTrades],
    ["Buy Trades", stats?.buyTrades],
    ["Sell Trades", stats?.sellTrades],
    ["Most Traded Stock", stats?.mostTradedStock],
    [
      "Virtual Money Invested",
      `₹${Number(stats?.totalVirtualMoneyInvested || 0).toFixed(2)}`,
    ],
  ];

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
          Admin Panel
        </p>

        <h1 className={pageTitleClass}>Admin Dashboard</h1>

        <p className={`${mutedText} mt-2`}>
          Complete overview of users, trades, reports, and simulator activity.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(([label, value]) => (
          <div key={label} className={cardClass}>
            <p className={mutedText}>{label}</p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-slate-900 dark:text-white">
              {value ?? 0}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;