import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Sun, Moon, Menu, X } from "lucide-react";

import { useAuth } from "../store/authStore.js";
import { useThemeStore } from "../store/themeStore.js";

import { dropdownClass, dropdownItemClass } from "../styles/common.js";

function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const isAdmin = currentUser?.role === "ADMIN";

  const initials = `${currentUser?.firstName?.[0] || ""}${
    currentUser?.lastName?.[0] || ""
  }`.toUpperCase();

  const navClass =
    "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-white/10 transition";

  const adminNavClass =
    "block px-3 py-2 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeMenus = () => {
    setOpenMenu(false);
    setMobileMenu(false);
  };

  const goToSettingsTab = (tab) => {
    closeMenus();
    navigate(`/dashboard/settings?tab=${tab}`);
  };

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success("Logged out successfully");
      closeMenus();
      navigate("/");
    } else {
      toast.error(result.message || "Logout failed");
    }
  };

  const guestLinks = (
    <>
      <NavLink onClick={closeMenus} to="/" className={navClass}>
        Home
      </NavLink>
      <NavLink onClick={closeMenus} to="/market" className={navClass}>
        Market
      </NavLink>
      <NavLink onClick={closeMenus} to="/ai-assistant" className={navClass}>
        AI Assistant
      </NavLink>
      <NavLink onClick={closeMenus} to="/news" className={navClass}>
        News
      </NavLink>
      <NavLink onClick={closeMenus} to="/learn" className={navClass}>
        Learn
      </NavLink>
    </>
  );

  const userLinks = (
    <>
      <NavLink onClick={closeMenus} to="/" className={navClass}>
        Home
      </NavLink>
      <NavLink onClick={closeMenus} to="/market" className={navClass}>
        Market
      </NavLink>
      <NavLink onClick={closeMenus} to="/ai-assistant" className={navClass}>
        AI Assistant
      </NavLink>
      <NavLink onClick={closeMenus} to="/dashboard" className={navClass}>
        Dashboard
      </NavLink>
      <NavLink onClick={closeMenus} to="/portfolio" className={navClass}>
        Portfolio
      </NavLink>
      <NavLink onClick={closeMenus} to="/alerts" className={navClass}>
        Alerts
      </NavLink>
      <NavLink onClick={closeMenus} to="/watchlist" className={navClass}>
        Watchlist
      </NavLink>
      <NavLink onClick={closeMenus} to="/news" className={navClass}>
        News
      </NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink onClick={closeMenus} to="/admin" className={adminNavClass}>
        Admin Dashboard
      </NavLink>
      <NavLink onClick={closeMenus} to="/admin/users" className={adminNavClass}>
        Manage Users
      </NavLink>
      <NavLink
        onClick={closeMenus}
        to="/admin/statistics"
        className={adminNavClass}
      >
        Statistics
      </NavLink>
      <NavLink
        onClick={closeMenus}
        to="/admin/reports"
        className={adminNavClass}
      >
        Reports
      </NavLink>
      <NavLink
        onClick={closeMenus}
        to="/admin/monitor"
        className={adminNavClass}
      >
        Monitor
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#08111f]/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to={isAdmin ? "/admin" : "/"}
            onClick={closeMenus}
            className="text-2xl font-extrabold text-green-500 tracking-tight"
          >
            StockSim
          </NavLink>

          <div className="hidden lg:flex items-center gap-1">
            {!isAuthenticated && guestLinks}
            {isAuthenticated && !isAdmin && userLinks}
            {isAuthenticated && isAdmin && adminLinks}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#0f1b2e] hover:bg-slate-200 dark:hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-50 dark:hover:bg-green-500/10 transition font-semibold"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className="px-4 py-2 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition"
                >
                  Signup
                </NavLink>
              </div>
            ) : (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f1b2e] px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
                    {initials || "U"}
                  </div>

                  <div className="text-left max-w-[130px]">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentUser?.firstName || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                      {isAdmin ? "Admin" : "Trader"}
                    </p>
                  </div>

                  <span className="text-xs text-slate-500">▼</span>
                </button>

                {openMenu && (
                  <div className={dropdownClass}>
                    <div className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
                        {initials || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-gray-400 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>

                    {!isAdmin && (
                      <div className="border-t border-slate-200 dark:border-white/10 py-2">
                        <button
                          onClick={() => goToSettingsTab("profile")}
                          className={dropdownItemClass}
                        >
                          Profile
                        </button>

                        <button
                          onClick={() => goToSettingsTab("trading")}
                          className={dropdownItemClass}
                        >
                          Trading Preferences
                        </button>

                        <button
                          onClick={() => goToSettingsTab("notifications")}
                          className={dropdownItemClass}
                        >
                          Notifications
                        </button>

                        <button
                          onClick={() => goToSettingsTab("security")}
                          className={dropdownItemClass}
                        >
                          Security
                        </button>

                        <button
                          onClick={() => goToSettingsTab("support")}
                          className={dropdownItemClass}
                        >
                          Help & Support
                        </button>

                        <NavLink
                          to="/about"
                          onClick={closeMenus}
                          className="block px-5 py-3 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                        >
                          About
                        </NavLink>
                      </div>
                    )}

                    <div className="border-t border-slate-200 dark:border-white/10 p-3">
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1b2e] p-3 shadow-xl">
            <div className="grid gap-1">
              {!isAuthenticated && guestLinks}
              {isAuthenticated && !isAdmin && userLinks}
              {isAuthenticated && isAdmin && adminLinks}
            </div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <NavLink
                  to="/login"
                  onClick={closeMenus}
                  className="text-center px-4 py-3 border border-green-500 text-green-600 dark:text-green-400 rounded-xl font-semibold"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={closeMenus}
                  className="text-center px-4 py-3 bg-green-500 text-black rounded-xl font-bold"
                >
                  Signup
                </NavLink>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-100 dark:bg-white/10 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
                    {initials || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold truncate">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                {!isAdmin && (
                  <div className="grid gap-1 mb-3">
                    <button
                      onClick={() => goToSettingsTab("profile")}
                      className={dropdownItemClass}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => goToSettingsTab("trading")}
                      className={dropdownItemClass}
                    >
                      Trading Preferences
                    </button>
                    <button
                      onClick={() => goToSettingsTab("notifications")}
                      className={dropdownItemClass}
                    >
                      Notifications
                    </button>
                    <button
                      onClick={() => goToSettingsTab("security")}
                      className={dropdownItemClass}
                    >
                      Security
                    </button>
                    <button
                      onClick={() => goToSettingsTab("support")}
                      className={dropdownItemClass}
                    >
                      Help & Support
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;