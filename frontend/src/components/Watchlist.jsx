import { useEffect } from "react";
import toast from "react-hot-toast";
import { useWatchlist } from "../store/watchlistStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  dangerBtn,
} from "../styles/common.js";

function Watchlist() {
  const watchlist = useWatchlist((state) => state.watchlist);
  const loading = useWatchlist((state) => state.loading);
  const fetchWatchlist = useWatchlist((state) => state.fetchWatchlist);
  const removeFromWatchlist = useWatchlist((state) => state.removeFromWatchlist);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemove = async (watchlistId) => {
    const result = await removeFromWatchlist(watchlistId);

    if (result.success) {
      toast.success("Removed from watchlist");
    } else {
      toast.error(result.message || "Failed to remove from watchlist");
    }
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            Loading watchlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Watchlist
        </p>

        <h1 className={pageTitleClass}>My Watchlist</h1>

        <p className={`${mutedText} mt-2`}>
          Track stocks you are interested in without buying them.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className={cardClass}>
          <p className="text-slate-600 dark:text-gray-300">
            No stocks in watchlist yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {watchlist.map((stock) => (
            <div key={stock._id} className={cardClass}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {stock.symbol}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {stock.companyName}
                  </p>
                </div>

                <span
                  className={
                    stock.change?.startsWith("+")
                      ? "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                      : "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                  }
                >
                  {stock.change}
                </span>
              </div>

              <div className="mt-6">
                <p className={mutedText}>Price</p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{Number(stock.price || 0).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleRemove(stock._id)}
                className={`${dangerBtn} w-full mt-5`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;