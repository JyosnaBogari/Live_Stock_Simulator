// import create from zustand
import { create } from "zustand";
import BASE_URL from "../config/baseAPI";
// import axios for api calls
import axios from "axios";

// backend stock api base url
const STOCK_API_URL = `${BASE_URL}/stock-api`;

// create alert store
export const useAlert = create((set, get) => ({
  // stores user alerts
  alerts: [],

  // stores loading state
  loading: false,

  // stores error message
  error: null,

  // remove alert from frontend state
  removeAlertFromState: (alertId) => {
    // remove alert from alerts array
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert._id !== alertId),
    }));
  },

  // fetch alerts function
  fetchAlerts: async () => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend get alerts api
      const res = await axios.get(`${STOCK_API_URL}/alerts`, {
        // send cookie token
        withCredentials: true,
      });

      // save alerts in store
      set({
        alerts: res.data.payload,
        loading: false,
        error: null,
      });

      // return success
      return {
        success: true,
        alerts: res.data.payload,
      };
    } catch (err) {
      // get backend error message
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch alerts";

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

  // create alert function
  createAlert: async (alertObj) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend create alert api
      const res = await axios.post(`${STOCK_API_URL}/alerts`, alertObj, {
        // send cookie token
        withCredentials: true,
      });

      // refresh alerts after create
      await get().fetchAlerts();

      // stop loading
      set({ loading: false, error: null });

      // return success
      return {
        success: true,
        alert: res.data.payload,
      };
    } catch (err) {
      // get backend error message
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create alert";

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

  // delete alert function
  deleteAlert: async (alertId) => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend delete alert api
      await axios.delete(`${STOCK_API_URL}/alerts/${alertId}`, {
        // send cookie token
        withCredentials: true,
      });

      // refresh alerts after delete
      await get().fetchAlerts();

      // stop loading
      set({ loading: false, error: null });

      // return success
      return {
        success: true,
      };
    } catch (err) {
      // get backend error message
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete alert";

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