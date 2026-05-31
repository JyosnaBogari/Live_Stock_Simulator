// import create from zustand
import { create } from "zustand";
import BASE_URL from "../config/baseAPI";
// import axios
import axios from "axios";

// backend stock api url
const STOCK_API_URL = `${BASE_URL}/stock-api`;

// create candle store
export const useCandle = create((set) => ({
  // stores candle chart data
  candles: [],

  // stores loading
  loading: false,

  // stores error
  error: null,

  // fetch candle data
  fetchCandles: async (symbol) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend candle api
      const res = await axios.get(`${STOCK_API_URL}/candles/${symbol}`, {
        // send auth cookie
        withCredentials: true,
      });

      // save candle data
      set({
        candles: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        candles: res.data.payload,
      };
    } catch (err) {
      // get error message
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch candles";

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