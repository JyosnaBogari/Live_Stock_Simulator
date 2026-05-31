// import useEffect to watch prices and alerts
import { useEffect } from "react";

// import toast for alert notification
import toast from "react-hot-toast";

// import socket store for live prices
import { useSocket } from "../store/socketStore.js";

// import alert store
import { useAlert } from "../store/alertStore.js";

// alert watcher component
function AlertWatcher() {
  // get live stocks from socket store
  const liveStocks = useSocket((state) => state.liveStocks);

  // get socket connect function
  const connectSocket = useSocket((state) => state.connectSocket);

  // get alerts from alert store
  const alerts = useAlert((state) => state.alerts);

  // get fetch alerts function
  const fetchAlerts = useAlert((state) => state.fetchAlerts);

  // get delete alert function
  const deleteAlert = useAlert((state) => state.deleteAlert);

  // connect socket and fetch alerts when watcher loads
  useEffect(() => {
    // connect socket
    connectSocket();

    // fetch user alerts
    fetchAlerts();
  }, [connectSocket, fetchAlerts]);

  // watch live price changes and compare alerts
  useEffect(() => {
    // stop if no prices or alerts
    if (liveStocks.length === 0 || alerts.length === 0) {
      return;
    }

    // loop through every alert
    alerts.forEach(async (alert) => {
      // find matching stock price
      const stock = liveStocks.find((item) => item.symbol === alert.symbol);

      // stop if stock not found
      if (!stock) {
        return;
      }

      // convert current price to number
      const currentPrice = Number(stock.price);

      // convert target price to number
      const targetPrice = Number(alert.targetPrice);

      // check above condition
      const isAboveTriggered =
        alert.condition === "ABOVE" && currentPrice >= targetPrice;

      // check below condition
      const isBelowTriggered =
        alert.condition === "BELOW" && currentPrice <= targetPrice;

      // if any condition matched
      if (isAboveTriggered || isBelowTriggered) {
        // show notification
        toast.success(
          `${alert.symbol} alert triggered at ₹${currentPrice}. Target was ${alert.condition} ₹${targetPrice}`
        );

        // delete alert after trigger
        await deleteAlert(alert._id);
      }
    });
  }, [liveStocks, alerts, deleteAlert]);

  // this component does not show UI
  return null;
}

export default AlertWatcher;