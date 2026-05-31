// import create function from zustand
import { create } from "zustand";
import BASE_URL from "../config/baseAPI";
// import axios for backend api calls
import axios from "axios";

// backend stock api base url
const STOCK_API_URL = `${BASE_URL}/stock-api`;

// create stock store
export const useStock = create((set, get) => ({
  // stores user portfolio stocks
  portfolio: [],

  // stores user transaction history
  transactions: [],

  // stores latest wallet balance after buy or sell
  walletBalance: 100000,

  // stores loading state
  loading: false,

  // stores error message
  error: null,

  // fetch portfolio function
  fetchPortfolio: async () => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend portfolio api
      const res = await axios.get(`${STOCK_API_URL}/portfolio`, {
        // send cookie token to backend
        withCredentials: true,
      });

      // save portfolio in store
      set({
        portfolio: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        portfolio: res.data.payload,
      };
    } catch (err) {
      // get backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch portfolio";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        msg = "Session expired. Please login again.";
        sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
      }

      // save error
      set({
        loading: false,
        error: msg,
      });

      // return failure
      return {
        success: false,
        message: msg,
      };
    }
  },

  // fetch transactions function
  fetchTransactions: async () => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend transactions api
      const res = await axios.get(`${STOCK_API_URL}/transactions`, {
        // send cookie token
        withCredentials: true,
      });

      // save transactions
      set({
        transactions: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        transactions: res.data.payload,
      };
    } catch (err) {
      // get backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch transactions";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        msg = "Session expired. Please login again.";
        sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";


      }

      // save error
      set({
        loading: false,
        error: msg,
      });

      // return failure
      return {
        success: false,
        message: msg,
      };
    }
  },

  // buy stock function
  buyStock: async (stockObj) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call buy stock backend api
      const res = await axios.post(`${STOCK_API_URL}/buy`, stockObj, {
        // send cookie token
        withCredentials: true,
      });

      // update wallet balance from backend response
      set({
        walletBalance: res.data.walletBalance,
        loading: false,
        error: null,
      });

      // refresh portfolio after buying
      await get().fetchPortfolio();

      // refresh transactions after buying
      await get().fetchTransactions();

      // return success
      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      // get backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to buy stock";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        msg = "Session expired. Please login again.";
        sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
      }

      // save error
      set({
        loading: false,
        error: msg,
      });

      // return failure
      return {
        success: false,
        message: msg,
      };
    }
  },

  // sell stock function
  sellStock: async (stockObj) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call sell stock backend api
      const res = await axios.post(`${STOCK_API_URL}/sell`, stockObj, {
        // send cookie token
        withCredentials: true,
      });

      // update wallet balance
      set({
        walletBalance: res.data.walletBalance,
        loading: false,
        error: null,
      });

      // refresh portfolio after selling
      await get().fetchPortfolio();

      // refresh transactions after selling
      await get().fetchTransactions();

      // return success
      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      // get backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to sell stock";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        msg = "Session expired. Please login again.";
      sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
      }

      // save error
      set({
        loading: false,
        error: msg,
      });

      // return failure
      return {
        success: false,
        message: msg,
      };
    }
  },

  // stores leaderboard users
leaderboard: [],

// fetch leaderboard function
fetchLeaderboard: async () => {
  try {
    // start loading
    set({ loading: true, error: null });

    // call backend leaderboard api
    const res = await axios.get(`${STOCK_API_URL}/leaderboard`, {
      // send token cookie
      withCredentials: true,
    });

    // save leaderboard
    set({
      leaderboard: res.data.payload,
      loading: false,
      error: null,
    });

    // return success
    return {
      success: true,
      leaderboard: res.data.payload,
    };
  } catch (err) {
    // get backend error
    let msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to fetch leaderboard";

    if (err.code === "ERR_NETWORK") {
      msg = "Server is not reachable. Please try again later.";
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      msg = "Session expired. Please login again.";
   sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
    }

    // save error
    set({
      loading: false,
      error: msg,
    });

    // return failure
    return {
      success: false,
      message: msg,
    };
  }
},

// stores real market stocks
marketStocks: [],

// fetch real market prices
fetchMarketPrices: async () => {
  try {
    // start loading
    set({ loading: true, error: null });

    // call backend market prices api
    const res = await axios.get(`${STOCK_API_URL}/market-prices`, {
      // send cookies if available
      withCredentials: true,
    });

    // save market stocks
    set({
      marketStocks: res.data.payload,
      loading: false,
      error: null,
    });

    // return success
    return {
      success: true,
      stocks: res.data.payload,
    };
  } catch (err) {
    // get backend error
    let msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to fetch market prices";

    if (err.code === "ERR_NETWORK") {
      msg = "Server is not reachable. Please try again later.";
    }

    // save error
    set({
      loading: false,
      error: msg,
    });

    // return failure
    return {
      success: false,
      message: msg,
    };
  }
},

stockDetails: null,

fetchStockDetails: async (symbol) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await axios.get(
      `${STOCK_API_URL}/details/${symbol}`,
      {
        withCredentials: true,
      }
    );

    set({
      stockDetails: res.data.payload,
      loading: false,
      error: null,
    });

    return {
      success: true,
      payload: res.data.payload,
    };
  } catch (err) {
    console.log(
      "STOCK DETAILS ERROR:",
      err.response?.data || err.message
    );

    let message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to fetch stock details";

    if (err.code === "ERR_NETWORK") message = "Server is not reachable. Please try again later.";

    set({
      stockDetails: null,
      loading: false,
      error: message,
    });

    return {
      success: false,
      message,
    };
  }
},

}));