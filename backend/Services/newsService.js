// import axios to call external news api
import axios from "axios";

// get company news from finnhub
export const getCompanyNews = async (symbol) => {
  try {
    // get today's date
    const today = new Date();

    // get date 7 days before today
    const lastWeek = new Date();

    // subtract 7 days
    lastWeek.setDate(today.getDate() - 7);

    // convert date to yyyy-mm-dd format
    const toDate = today.toISOString().split("T")[0];

    // convert date to yyyy-mm-dd format
    const fromDate = lastWeek.toISOString().split("T")[0];

    // call finnhub company news api
    const res = await axios.get("https://finnhub.io/api/v1/company-news", {
      // send query params
      params: {
        // stock symbol
        symbol,

        // from date
        from: fromDate,

        // to date
        to: toDate,

        // api key
        token: process.env.FINNHUB_API_KEY,
      },
    });

    // return only first 10 news articles
    return res.data.slice(0, 10);
  }  catch (err) {
    console.log("NEWS API ERROR:", err.response?.data || err.message);

    return [
      {
        id: Date.now(),
        headline: `${symbol} stock news temporarily unavailable`,
        summary:
          "Live news could not be fetched right now. Please try again after some time.",
        url: `https://www.google.com/search?q=${symbol}+stock+news`,
        image: "",
        source: "Fallback",
        datetime: Date.now(),
      },
    ];
  }
};