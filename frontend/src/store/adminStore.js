import { create } from "zustand";
import axios from "axios";

const ADMIN_API_URL = "http://localhost:3000/admin-api";

export const useAdmin = create((set) => ({
  users: [],
  stats: null,
  analytics: null,
  reports: [],
  monitor: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ADMIN_API_URL}/stats`, {
        withCredentials: true,
      });
      set({ stats: res.data.payload, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch stats";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  fetchUsers: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ADMIN_API_URL}/users`, {
        withCredentials: true,
      });
      set({ users: res.data.payload, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch users";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_URL}/users/${userId}/status`,
        { isActive },
        { withCredentials: true }
      );

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? res.data.payload : user
        ),
      }));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Failed to update user status",
      };
    }
  },

  fetchAnalytics: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ADMIN_API_URL}/analytics`, {
        withCredentials: true,
      });
      set({ analytics: res.data.payload, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch analytics";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  fetchReports: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ADMIN_API_URL}/reports`, {
        withCredentials: true,
      });
      set({ reports: res.data.payload, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch reports";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  resolveReport: async (reportId, adminReply) => {
    try {
      const res = await axios.put(
        `${ADMIN_API_URL}/reports/${reportId}/resolve`,
        { adminReply },
        { withCredentials: true }
      );

      set((state) => ({
        reports: state.reports.map((report) =>
          report._id === reportId ? res.data.payload : report
        ),
      }));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Failed to resolve report",
      };
    }
  },
  fetchMonitor: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ADMIN_API_URL}/monitor`, {
        withCredentials: true,
      });
      set({ monitor: res.data.payload, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch monitor data";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },
}));