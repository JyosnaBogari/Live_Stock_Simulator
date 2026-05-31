// import create from zustand
import { create } from "zustand";
import BASE_URL from "../config/baseAPI";
// import axios for api calls
import axios from "axios";

// backend stock api url
const STOCK_API_URL = `${BASE_URL}/stock-api`;

// create watchlist store
export const useWatchlist = create((set, get) => ({
  // stores watchlist stocks
  watchlist: [],

  // stores loading state
  loading: false,

  // stores error message
  error: null,

  // fetch watchlist function
  fetchWatchlist: async () => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend watchlist api
      const res = await axios.get(`${STOCK_API_URL}/watchlist`, {
        // send cookie token
        withCredentials: true,
      });

      // save watchlist
      set({
        watchlist: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        watchlist: res.data.payload,
      };
    } catch (err) {
      // get backend error
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch watchlist";

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

  // add stock to watchlist function
  addToWatchlist: async (stockObj) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend add watchlist api
      const res = await axios.post(`${STOCK_API_URL}/watchlist`, stockObj, {
        // send cookie token
        withCredentials: true,
      });

      // refresh watchlist
      await get().fetchWatchlist();

      // stop loading
      set({ loading: false, error: null });

      // return success
      return {
        success: true,
        stock: res.data.payload,
      };
    } catch (err) {
      // get backend error
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add to watchlist";

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

  // remove stock from watchlist function
  removeFromWatchlist: async (watchlistId) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend remove watchlist api
      await axios.delete(`${STOCK_API_URL}/watchlist/${watchlistId}`, {
        // send cookie token
        withCredentials: true,
      });

      // refresh watchlist
      await get().fetchWatchlist();

      // stop loading
      set({ loading: false, error: null });

      // return success
      return {
        success: true,
      };
    } catch (err) {
      // get backend error
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to remove from watchlist";

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
}));