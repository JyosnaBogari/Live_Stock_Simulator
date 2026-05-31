// import axios to call external stock api
import axios from "axios";

// demo stock list used in our project
const stockList = [
  { symbol: "AAPL", companyName: "Apple" },
  { symbol: "TSLA", companyName: "Tesla" },
  { symbol: "MSFT", companyName: "Microsoft" },
  { symbol: "GOOGL", companyName: "Google" },
  { symbol: "AMZN", companyName: "Amazon" },
  { symbol: "META", companyName: "Meta" },
  { symbol: "NVDA", companyName: "Nvidia" },
  { symbol: "NFLX", companyName: "Netflix" },
  { symbol: "INTC", companyName: "Intel" },
  { symbol: "AMD", companyName: "AMD" },
  { symbol: "IBM", companyName: "IBM" },
  { symbol: "ORCL", companyName: "Oracle" },
];

// get real stock quote from finnhub
export const getStockQuote = async (symbol) => {
  try {
     // print symbol before api call
    console.log("Calling Finnhub API for:", symbol);
    
    // call finnhub quote api
    const res = await axios.get("https://finnhub.io/api/v1/quote", {
      // pass query parameters
      params: {
        symbol,

        // api key from .env
        token: process.env.FINNHUB_API_KEY,
      },
    });

    // return formatted quote
    return {
      symbol,

      // current price
      price: res.data.c,

      // price change
      changeValue: res.data.d,

      // price change percentage
      changePercent: res.data.dp,

      // high price of day
      high: res.data.h,

      // low price of day
      low: res.data.l,

      // open price
      open: res.data.o,

      // previous close price
      previousClose: res.data.pc,
    };
  } catch (err) {
    // throw clean error
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
};

// get all real stock prices
export const getAllStockPrices = async () => {
  // create empty result array
  const result = [];

  // loop stocks one by one
  for (const stock of stockList) {
    // get quote for current stock
    const quote = await getStockQuote(stock.symbol);

    // push formatted stock data
    result.push({
      symbol: stock.symbol,
      companyName: stock.companyName,
      price: Number(quote.price || 0),
      change: `${quote.changePercent >= 0 ? "+" : ""}${Number(
        quote.changePercent || 0
      ).toFixed(2)}%`,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      previousClose: quote.previousClose,
    });
  }

  // return all stocks
  return result;
};