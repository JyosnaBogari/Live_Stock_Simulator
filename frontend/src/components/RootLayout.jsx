import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../store/authStore.js";
import AlertWatcher from "./AlertWatcher";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const loading = useAuth((state) => state.loading);
  const authChecked = useAuth((state) => state.authChecked);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#08111f] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin mx-auto mb-4"></div>

          <p className="text-slate-900 dark:text-white text-lg font-bold">
            Loading StockSim
          </p>

          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Preparing your trading simulator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08111f] text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />

      {isAuthenticated && <AlertWatcher />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;