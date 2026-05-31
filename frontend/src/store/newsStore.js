// import create from zustand
import { create } from "zustand";

// import axios for api calls
import axios from "axios";

// backend stock api url
const STOCK_API_URL = "http://localhost:3000/stock-api";

// create news store
export const useNews = create((set) => ({
  // stores news list
  news: [],

  // stores loading state
  loading: false,

  // stores error message
  error: null,

  // fetch news function
  fetchNews: async (symbol) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend news api
      const res = await axios.get(`${STOCK_API_URL}/news/${symbol}`, {
        // send cookie token
        withCredentials: true,
      });

      // save news
      set({
        news: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        news: res.data.payload,
      };
    } catch (err) {
      // get backend error
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch news";

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
}));