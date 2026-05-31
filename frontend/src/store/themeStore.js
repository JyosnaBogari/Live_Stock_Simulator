import { create } from "zustand";

const savedTheme = localStorage.getItem("stocksim-theme") || "dark";

export const useThemeStore = create((set) => ({
  theme: savedTheme,

  setTheme: (theme) => {
    localStorage.setItem("stocksim-theme", theme);
    set({ theme });
  },
}));