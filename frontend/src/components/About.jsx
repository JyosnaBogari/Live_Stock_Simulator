import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

function About() {
  return (
    <div className={pageWrapper}>
      <div className="max-w-4xl">
        <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          About Project
        </p>

        <h1 className={pageTitleClass}>About StockSim</h1>

        <p className={`${mutedText} mt-3 max-w-3xl`}>
          StockSim is a virtual stock market simulator designed to help users
          learn investing, trading, portfolio management, and market analysis
          without risking real money.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Virtual Trading
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Buy and sell stocks using virtual money while learning trading
            concepts safely.
          </p>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Portfolio Tracking
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Monitor your holdings, investments, and trading performance over
            time.
          </p>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Learning Assistant
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Understand stock market concepts through an integrated AI assistant.
          </p>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Watchlists & Alerts
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Follow stocks and create alerts for target price movements.
          </p>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Learning Hub
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Learn investing basics, stock analysis, and financial terminology.
          </p>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Real Project Experience
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300">
            Built using React, Tailwind CSS, Zustand, Socket.io, Node.js,
            Express, and MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;