import { useEffect, useRef } from "react";
import { useThemeStore } from "../store/themeStore.js";

const symbolMap = {
  AAPL: "NASDAQ:AAPL",
  TSLA: "NASDAQ:TSLA",
  MSFT: "NASDAQ:MSFT",
  GOOGL: "NASDAQ:GOOGL",
  AMZN: "NASDAQ:AMZN",
  NVDA: "NASDAQ:NVDA",
  META: "NASDAQ:META",
  NFLX: "NASDAQ:NFLX",

  NIFTY50: "NSE:NIFTY",
  SENSEX: "BSE:SENSEX",
  SPX: "SP:SPX",
  NDX: "NASDAQ:NDX",

  GOLD: "TVC:GOLD",
  SILVER: "TVC:SILVER",
  CRUDE: "TVC:USOIL",

  USDINR: "FX_IDC:USDINR",
  EURINR: "FX_IDC:EURINR",

  SPY: "AMEX:SPY",
  QQQ: "NASDAQ:QQQ",
  GLD: "AMEX:GLD",
};

function TradingViewChart({ symbol }) {
  const containerRef = useRef(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbolMap[symbol] || `NASDAQ:${symbol}`,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_side_toolbar: false,
      withdateranges: true,
      range: "3M",
    });

    containerRef.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div className="w-full h-[420px] sm:h-[500px] rounded-xl overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container w-full h-full" />
    </div>
  );
}

export default TradingViewChart;