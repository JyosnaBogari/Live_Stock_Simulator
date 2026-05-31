import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAlert } from "../store/alertStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  selectClass,
  primaryBtn,
  dangerBtn,
} from "../styles/common.js";

const stocks = [
  {
    symbol: "AAPL",
    companyName: "Apple",
  },
  {
    symbol: "TSLA",
    companyName: "Tesla",
  },
  {
    symbol: "TCS",
    companyName: "TCS",
  },
  {
    symbol: "INFY",
    companyName: "Infosys",
  },
];

function Alerts() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const alerts = useAlert((state) => state.alerts);
  const loading = useAlert((state) => state.loading);
  const fetchAlerts = useAlert((state) => state.fetchAlerts);
  const createAlert = useAlert((state) => state.createAlert);
  const deleteAlert = useAlert((state) => state.deleteAlert);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onCreateAlert = async (formData) => {
    const selectedStock = stocks.find((stock) => stock.symbol === formData.symbol);

    const result = await createAlert({
      symbol: selectedStock.symbol,
      companyName: selectedStock.companyName,
      targetPrice: formData.targetPrice,
      condition: formData.condition,
    });

    if (result.success) {
      toast.success("Alert created successfully");
      reset();
    } else {
      toast.error(result.message || "Failed to create alert");
    }
  };

  const handleDeleteAlert = async (alertId) => {
    const result = await deleteAlert(alertId);

    if (result.success) {
      toast.success("Alert deleted successfully");
    } else {
      toast.error(result.message || "Failed to delete alert");
    }
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Price Alerts
        </p>

        <h1 className={pageTitleClass}>Price Alerts</h1>

        <p className={`${mutedText} mt-2`}>
          Create alerts for stock price movement and get notified when your
          target price is reached.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
            Create Alert
          </h2>

          <form onSubmit={handleSubmit(onCreateAlert)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Stock
              </label>

              <select
                className={selectClass}
                {...register("symbol", { required: "Stock is required" })}
              >
                <option value="">Select stock</option>

                {stocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.companyName}
                  </option>
                ))}
              </select>

              {errors.symbol && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.symbol.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Condition
              </label>

              <select
                className={selectClass}
                {...register("condition", { required: "Condition is required" })}
              >
                <option value="">Select condition</option>
                <option value="ABOVE">Above</option>
                <option value="BELOW">Below</option>
              </select>

              {errors.condition && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Target Price
              </label>

              <input
                type="number"
                min="1"
                placeholder="Enter target price"
                className={inputClass}
                {...register("targetPrice", {
                  required: "Target price is required",
                })}
              />

              {errors.targetPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetPrice.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtn} w-full`}
            >
              {loading ? "Creating..." : "Create Alert"}
            </button>
          </form>
        </div>

        <div className={cardClass}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">
            My Alerts
          </h2>

          {alerts.length === 0 ? (
            <p className="text-slate-600 dark:text-gray-300">
              No alerts created yet.
            </p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-slate-100 dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {alert.symbol} {alert.condition} ₹{alert.targetPrice}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      {alert.companyName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className={dangerBtn}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;