import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../config/baseAPI";

const STOCK_API_URL = `${BASE_URL}/stock-api`;

const cleanError = (err) => {
  if (err.code === "ERR_NETWORK") {
    return "Server is not reachable. Please try again later.";
  }

  if (err.response?.status === 401 || err.response?.status === 403) {
  return "AI assistant is temporarily unavailable. Please try again later.";
}

  return (
    err.response?.data?.error ||
    err.response?.data?.message ||
    "AI response failed. Please try again."
  );
};

export const useAI = create((set) => ({
  loading: false,
  error: null,
  messages: [],

  sendMessage: async (userMessage) => {
    try {
      set((state) => ({
        loading: true,
        error: null,
        messages: [
          ...state.messages,
          {
            role: "user",
            text: userMessage,
          },
        ],
      }));

      const res = await axios.post(
        `${STOCK_API_URL}/ai-chat`,
        { message: userMessage },
        { withCredentials: true }
      );

      const aiText =
        res.data?.payload?.text ||
        res.data?.payload?.reply ||
        res.data?.payload?.message ||
        res.data?.payload ||
        res.data?.reply ||
        res.data?.message ||
        "I could not generate a response. Please try again.";

      set((state) => ({
        loading: false,
        error: null,
        messages: [
          ...state.messages,
          {
            role: "assistant",
            text: aiText,
          },
        ],
      }));

      return {
        success: true,
      };
    } catch (err) {
      const msg = cleanError(err);

      set((state) => ({
        loading: false,
        error: msg,
        messages: [
          ...state.messages,
          {
            role: "assistant",
            text: msg,
          },
        ],
      }));

      return {
        success: false,
        message: msg,
      };
    }
  },

  clearMessages: () => {
    set({
      messages: [],
      error: null,
    });
  },
}));