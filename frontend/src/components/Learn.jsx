import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

const lessons = [
  {
    title: "What is a Stock?",
    desc: "A stock represents ownership in a company. When you buy a stock, you own a small part of that company. If the company performs well, the stock price may increase.",
  },
  {
    title: "What is NIFTY 50?",
    desc: "NIFTY 50 is an Indian stock market index that tracks 50 major companies listed on NSE. It helps investors understand the overall Indian market trend.",
  },
  {
    title: "What is SENSEX?",
    desc: "SENSEX tracks 30 large companies listed on BSE. It is one of the oldest and most followed market indices in India.",
  },
  {
    title: "What is an ETF?",
    desc: "An ETF is a basket of stocks or assets traded like a stock. Example: Gold ETF tracks gold price, and SPY tracks the S&P 500 index.",
  },
  {
    title: "What is P/E Ratio?",
    desc: "P/E ratio compares stock price with company earnings. A high P/E may mean investors expect growth, but it can also mean the stock is expensive.",
  },
  {
    title: "What is Volume?",
    desc: "Volume shows how many shares are traded. High volume means more market activity and interest in that stock.",
  },
  {
    title: "What is Diversification?",
    desc: "Diversification means investing in different stocks or asset types to reduce risk. Do not put all money into one stock.",
  },
  {
    title: "How to Read Candlesticks?",
    desc: "Candlesticks show open, high, low, and close prices. Green usually means price increased, red means price decreased.",
  },
  {
    title: "What is Risk?",
    desc: "Risk means the possibility of losing money. Stocks can go up or down due to company results, news, economy, or market sentiment.",
  },
];

function Learn() {
  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <span className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
          Beginner Friendly
        </span>

        <h1 className={pageTitleClass}>Learning Hub</h1>

        <p className={`${mutedText} mt-3 max-w-2xl`}>
          Learn investing basics before practicing with virtual money. These
          short lessons help beginners understand stocks, risk, charts, and
          market terms.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((lesson, index) => (
          <div key={lesson.title} className={cardClass}>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold mb-5">
              {index + 1}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {lesson.title}
            </h2>

            <p className="mt-3 text-slate-600 dark:text-gray-300 leading-relaxed">
              {lesson.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Learn;