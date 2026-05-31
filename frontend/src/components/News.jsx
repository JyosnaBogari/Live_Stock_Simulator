import { useEffect, useState } from "react";
import { useNews } from "../store/newsStore.js";
import toast from "react-hot-toast";
import { LineChart, Line, ResponsiveContainer } from "recharts";

import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  primaryBtn,
} from "../styles/common.js";

const stocks = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "NFLX", "GLD"];

const companyMap = {
  AAPL: "Apple",
  TSLA: "Tesla",
  MSFT: "Microsoft",
  GOOGL: "Google",
  AMZN: "Amazon",
  META: "Meta",
  NVDA: "Nvidia",
  NFLX: "Netflix",
  GLD: "Gold ETF",
};

const chartPatterns = {
  AAPL: [{ p: 30 }, { p: 34 }, { p: 33 }, { p: 39 }, { p: 41 }],
  TSLA: [{ p: 45 }, { p: 38 }, { p: 42 }, { p: 35 }, { p: 31 }],
  MSFT: [{ p: 25 }, { p: 29 }, { p: 31 }, { p: 38 }, { p: 43 }],
  GOOGL: [{ p: 40 }, { p: 36 }, { p: 39 }, { p: 34 }, { p: 32 }],
  AMZN: [{ p: 28 }, { p: 33 }, { p: 31 }, { p: 37 }, { p: 40 }],
  META: [{ p: 24 }, { p: 30 }, { p: 28 }, { p: 36 }, { p: 35 }],
  NVDA: [{ p: 20 }, { p: 32 }, { p: 45 }, { p: 58 }, { p: 72 }],
  NFLX: [{ p: 32 }, { p: 29 }, { p: 35 }, { p: 34 }, { p: 39 }],
  GLD: [{ p: 36 }, { p: 37 }, { p: 39 }, { p: 38 }, { p: 41 }],
};


const companyImages = {
  AAPL: "/companies/aapl.png",
  TSLA: "/companies/tsla.jpeg",
  MSFT: "/companies/msft.png",
  GOOGL: "/companies/googl.png",
  AMZN: "/companies/amzn.png",
  NVDA: "/companies/nvda.png",
  META: "/companies/meta.png",
  NFLX: "/companies/nflx.png",
  GLD: "/companies/gold.png",
};

function NewsBanner({ symbol }) {
  return (
    <div className="relative h-52 overflow-hidden bg-slate-900">
      <img
        src={companyImages[symbol] || "/companies/aapl.png"}
        alt={symbol}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

      

      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
          Market News
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="text-white text-2xl font-bold">
          {companyMap[symbol] || symbol}
        </h3>

        <p className="text-slate-200 text-sm mt-1">
          Latest company updates, market sentiment, and investor news.
        </p>
      </div>
    </div>
  );
}

function News() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const news = useNews((state) => state.news);
  const loading = useNews((state) => state.loading);
  const fetchNews = useNews((state) => state.fetchNews);

  useEffect(() => {
    fetchNews(selectedSymbol);
  }, [selectedSymbol, fetchNews]);

  const getSentiment = (headline = "") => {
    const text = headline.toLowerCase();

    if (text.includes("growth") || text.includes("gain") || text.includes("rise") || text.includes("profit")) {
      return { label: "Bullish", color: "bg-green-500/20 text-green-400" };
    }

    if (text.includes("loss") || text.includes("drop") || text.includes("fall") || text.includes("cut")) {
      return { label: "Bearish", color: "bg-red-500/20 text-red-400" };
    }

    return { label: "Neutral", color: "bg-yellow-500/20 text-yellow-400" };
  };

  const companyName = companyMap[selectedSymbol]?.toLowerCase();

  const newsToShow =
    news.filter((item) => {
      const text = `${item.headline || ""} ${item.summary || ""}`.toLowerCase();
      return text.includes(selectedSymbol.toLowerCase()) || text.includes(companyName);
    }) || [];

  return (
    <div className={pageWrapper}>
      <h1 className={pageTitleClass}>Stock News</h1>
      <p className={mutedText}>Read latest company news, sentiment, and market updates.</p>

      <div className={`${cardClass} mt-8`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className={`${inputClass} sm:w-44`}
          >
            {stocks.map((symbol) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>

          <button onClick={() => fetchNews(selectedSymbol)} disabled={loading} className={`${primaryBtn} px-6 py-3`}>
            {loading ? "Loading..." : "Fetch News"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {newsToShow.map((article, index) => {
          const sentiment = getSentiment(article.headline);

          return (
            <div key={article.id || index} className="bg-white dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
              <NewsBanner symbol={selectedSymbol} />

              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-full bg-green-500 text-black font-bold flex items-center justify-center text-xs">
                      {selectedSymbol}
                    </div>

                    <div>
                      <h4 className="font-semibold">{companyMap[selectedSymbol]}</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {article.datetime ? new Date(article.datetime * 1000).toLocaleDateString() : "Latest"}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full ${sentiment.color}`}>
                    {sentiment.label}
                  </span>
                </div>

                <h2 className="text-lg font-bold line-clamp-2">{article.headline}</h2>
                <p className="mt-3 text-slate-600 dark:text-gray-400 line-clamp-4">
                  {article.summary || "No summary available."}
                </p>

                <a href={article.url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-green-500 font-semibold">
                  Read Full Article →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default News;