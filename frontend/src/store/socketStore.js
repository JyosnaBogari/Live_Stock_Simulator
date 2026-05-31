import { create } from "zustand";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export const useSocket = create((set, get) => ({
  socket: null,
  liveStocks: [],
  stockHistory: {},
  isConnected: false,

  connectSocket: () => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      set({ socket, isConnected: true });
    });

    socket.on("stockPrices", (stocks) => {
      const oldHistory = get().stockHistory;
      const updatedHistory = { ...oldHistory };

      stocks.forEach((stock) => {
        const symbol = stock.symbol;

        if (!updatedHistory[symbol]) {
          updatedHistory[symbol] = [];
        }

        updatedHistory[symbol] = [
          ...updatedHistory[symbol],
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            price: Number(stock.price),
          },
        ].slice(-20);
      });

      set({
        liveStocks: stocks,
        stockHistory: updatedHistory,
      });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      liveStocks: [],
      stockHistory: {},
      isConnected: false,
    });
  },
}));