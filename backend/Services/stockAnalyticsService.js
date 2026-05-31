import axios from "axios";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const toValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

export const getStockAnalytics = async (symbol) => {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY is missing");
  }

  const [quoteRes, profileRes, metricRes, recommendationRes] =
    await Promise.allSettled([
      axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: { symbol, token: apiKey },
      }),

      axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
        params: { symbol, token: apiKey },
      }),

      axios.get(`${FINNHUB_BASE_URL}/stock/metric`, {
        params: { symbol, metric: "all", token: apiKey },
      }),

      axios.get(`${FINNHUB_BASE_URL}/stock/recommendation`, {
        params: { symbol, token: apiKey },
      }),
    ]);

  const quote =
    quoteRes.status === "fulfilled" ? quoteRes.value.data : {};

  const profile =
    profileRes.status === "fulfilled" ? profileRes.value.data : {};

  const metrics =
    metricRes.status === "fulfilled" ? metricRes.value.data.metric || {} : {};

  const recommendation =
    recommendationRes.status === "fulfilled"
      ? recommendationRes.value.data?.[0]
      : null;

  const currentPrice = Number(quote.c || 0);
  const previousClose = Number(quote.pc || 0);

  const dayChangePercent =
    previousClose > 0
      ? (((currentPrice - previousClose) / previousClose) * 100).toFixed(2)
      : "0.00";

  const buy =
    (recommendation?.strongBuy || 0) + (recommendation?.buy || 0);

  const hold = recommendation?.hold || 0;

  const sell =
    (recommendation?.sell || 0) + (recommendation?.strongSell || 0);

  const totalRating = buy + hold + sell;

  const rating = {
    buy: totalRating ? Math.round((buy / totalRating) * 100) : 0,
    hold: totalRating ? Math.round((hold / totalRating) * 100) : 0,
    sell: totalRating ? Math.round((sell / totalRating) * 100) : 0,
  };

  const aiScore =
    rating.buy >= 60 && Number(dayChangePercent) >= -3
      ? "Positive"
      : rating.sell >= 40
      ? "Risky"
      : "Neutral";

  return {
    symbol,
    companyName: profile.name || symbol,
    currentPrice,
    change: `${Number(dayChangePercent) >= 0 ? "+" : ""}${dayChangePercent}%`,
    about:
      profile.name && profile.finnhubIndustry
        ? `${profile.name} belongs to the ${profile.finnhubIndustry} industry.`
        : "Company information is currently unavailable.",

    marketCap: toValue(profile.marketCapitalization, "N/A"),
    volume: toValue(quote.v, "N/A"),
    peRatio: toValue(metrics.peNormalizedAnnual, "N/A"),
    high52: toValue(metrics["52WeekHigh"], "N/A"),
    low52: toValue(metrics["52WeekLow"], "N/A"),

    rating,
    aiScore,

    recommendation:
      aiScore === "Positive"
        ? "Educational view: fundamentals and analyst sentiment look positive. Consider researching before buying."
        : aiScore === "Risky"
        ? "Educational view: analyst sentiment shows risk. Avoid large positions without deeper research."
        : "Educational view: mixed signal. Watch the trend and diversify.",

    source: "Finnhub",
  };
};