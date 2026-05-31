import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore.js";

function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      root.classList.remove("dark", "light");

      if (theme === "dark" || (theme === "system" && systemDark)) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    };

    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  return children;
}

export default ThemeProvider;