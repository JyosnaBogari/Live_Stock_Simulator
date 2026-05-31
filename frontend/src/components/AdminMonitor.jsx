import { useEffect } from "react";
import { useAdmin } from "../store/adminStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

function AdminMonitor() {
  const monitor = useAdmin((state) => state.monitor);
  const fetchMonitor = useAdmin((state) => state.fetchMonitor);

  useEffect(() => {
    fetchMonitor();

    const interval = setInterval(() => {
      fetchMonitor();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchMonitor]);

  const cards = [
    ["Backend Status", monitor?.backendStatus],
    ["Socket Status", monitor?.socketStatus],
    ["Finnhub API", monitor?.finnhubStatus],
    ["News API", monitor?.newsStatus],
    [
      "Last Checked",
      monitor?.lastChecked
        ? new Date(monitor.lastChecked).toLocaleString()
        : "Checking...",
    ],
  ];

  const getStatusClass = (value) => {
    if (["Running", "Connected", "Live", "Configured"].includes(value)) {
      return "text-green-500";
    }

    if (["Checking", "Fallback", "No Clients", "Issue"].includes(value)) {
      return "text-amber-500";
    }

    if (["Down", "Missing Key"].includes(value)) {
      return "text-red-500";
    }

    return "text-slate-700 dark:text-gray-300";
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
          System Health
        </p>

        <h1 className={pageTitleClass}>System Monitor</h1>

        <p className={`${mutedText} mt-2`}>
          Realtime simulator health. Auto-refreshes every 10 seconds.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(([label, value]) => (
          <div key={label} className={cardClass}>
            <p className={mutedText}>{label}</p>

            <h2
              className={`text-2xl font-bold mt-3 break-words ${getStatusClass(
                value
              )}`}
            >
              {value || "Checking..."}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMonitor;