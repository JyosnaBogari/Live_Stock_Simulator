import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import {
  User,
  Shield,
  Bell,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";

import { useAuth } from "../store/authStore.js";

import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  selectClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common.js";

import BASE_URL from "../config/baseAPI";

function ProfileSettings() {
  const [searchParams] = useSearchParams();

  const currentUser = useAuth((state) => state.currentUser);
  const loading = useAuth((state) => state.loading);
  const updateProfile = useAuth((state) => state.updateProfile);
  const changePassword = useAuth((state) => state.changePassword);

  const [activeTab, setActiveTab] = useState("profile");

  const [supportModal, setSupportModal] = useState(false);
  const [supportType, setSupportType] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);

  const [myReports, setMyReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const initials = `${currentUser?.firstName?.[0] || ""}${
    currentUser?.lastName?.[0] || ""
  }`.toUpperCase();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [tradingPrefs, setTradingPrefs] = useState(
    JSON.parse(localStorage.getItem("stocksim-trading-prefs")) || {
      defaultOrderType: "market",
      defaultQuantity: 10,
      showTradeConfirmation: true,
      enableQuickBuySell: true,
      refreshInterval: "5",
    }
  );

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("stocksim-notifications")) || {
      tradeExecuted: true,
      orderFilled: true,
      portfolioSummary: true,
      marketAlerts: true,
      priceAlerts: true,
      promotions: false,
    }
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    setProfile({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === "support") {
      fetchMyReports();
    }
  }, [activeTab]);

  const fetchMyReports = async () => {
    try {
      setReportsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/admin-api/my-reports`,
        { withCredentials: true }
      );

      setMyReports(response.data.payload || []);
    } catch {
      toast.error("Unable to load support tickets");
    } finally {
      setReportsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    const result = await updateProfile(profile);

    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.message || "Profile update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwords.oldPassword.trim()) {
      toast.error("Old password is required");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    const result = await changePassword(passwords);

    if (result.success) {
      toast.success("Password changed successfully");
      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    } else {
      toast.error(result.message || "Password change failed");
    }
  };

  const saveTradingPrefs = () => {
    localStorage.setItem("stocksim-trading-prefs", JSON.stringify(tradingPrefs));
    toast.success("Trading preferences saved");
  };

  const saveNotifications = () => {
    localStorage.setItem(
      "stocksim-notifications",
      JSON.stringify(notifications)
    );
    toast.success("Notification settings saved");
  };

  const openSupportModal = (type) => {
    setSupportType(type);
    setSupportSubject("");
    setSupportMessage("");
    setSupportModal(true);
  };

  const submitSupportReport = async (e) => {
    e.preventDefault();

    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please enter subject and message");
      return;
    }

    try {
      setSupportLoading(true);

      await axios.post(
        `${BASE_URL}/admin-api/reports`,
        {
          type: supportType,
          subject: supportSubject,
          message: supportMessage,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        supportType === "BUG"
          ? "Bug report submitted successfully"
          : "Feedback submitted successfully"
      );

      setSupportModal(false);
      fetchMyReports();
    } catch (err) {
      const message =
        err.code === "ERR_NETWORK"
          ? "Server is not reachable. Please try again later."
          : err.response?.status === 401 || err.response?.status === 403
          ? "Session expired. Please login again."
          : "Unable to submit. Please try again.";

      toast.error(message);
    } finally {
      setSupportLoading(false);
    }
  };

  const shareReferral = async () => {
    const referralCode = currentUser?.referralCode || currentUser?._id;

    if (!referralCode) {
      toast.error("Referral code not available");
      return;
    }

    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join StockSim",
          text: "Practice stock trading with virtual money on StockSim.",
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied. Share it with your friends.");
      }
    } catch {
      toast.error("Referral sharing cancelled");
    }
  };

  const tabs = [
    ["profile", "Profile", User],
    ["trading", "Trading", SlidersHorizontal],
    ["notifications", "Notifications", Bell],
    ["security", "Security", Shield],
    ["support", "Support", HelpCircle],
  ];

  const SettingCard = ({ title, desc, children }) => (
    <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      {desc && <p className={`${mutedText} mt-2 mb-6`}>{desc}</p>}

      {children}
    </div>
  );

  const ToggleRow = ({ label, desc, checked, onChange }) => (
    <label className="flex items-start justify-between gap-4 py-4 border-b last:border-b-0 border-slate-200 dark:border-white/10 cursor-pointer">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{desc}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-green-500"
      />
    </label>
  );

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <h1 className={pageTitleClass}>Profile & Settings</h1>

        <p className={`${mutedText} mt-2 max-w-3xl`}>
          Manage your personal details, trading defaults, alerts, security, and
          support options from one place.
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className={cardClass}>
          <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-green-500 text-black flex items-center justify-center font-bold text-lg">
              {initials || "U"}
            </div>

            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.firstName || "User"} {currentUser?.lastName || ""}
              </p>

              <p className="text-sm text-slate-500 dark:text-gray-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={
                  activeTab === id
                    ? "w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 text-black font-bold transition"
                    : "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                }
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {activeTab === "profile" && (
            <SettingCard
              title="Profile Information"
              desc="This information is shown in your account menu and simulator profile."
            >
              <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                <div className="bg-slate-100 dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                  <div className="w-20 h-20 rounded-3xl bg-green-500 text-black flex items-center justify-center text-2xl font-bold">
                    {initials || "U"}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-5 break-words">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h3>

                  <p className="text-slate-500 dark:text-gray-400 break-words mt-1">
                    {currentUser?.email}
                  </p>

                  <p className="inline-flex mt-4 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">
                    Trader Account
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>

                    <input
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>

                    <input
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Enter last name"
                    />
                  </div>

                  <button
                    disabled={loading}
                    className={`${primaryBtn} w-full sm:w-auto px-8`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </SettingCard>
          )}

          {activeTab === "trading" && (
            <SettingCard
              title="Trading Preferences"
              desc="These settings control your default simulator trading experience. They are saved on this device."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Default Order Type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setTradingPrefs({
                          ...tradingPrefs,
                          defaultOrderType: "market",
                        })
                      }
                      className={
                        tradingPrefs.defaultOrderType === "market"
                          ? "p-4 rounded-xl bg-green-500 text-black font-bold"
                          : "p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                      }
                    >
                      Market
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTradingPrefs({
                          ...tradingPrefs,
                          defaultOrderType: "limit",
                        })
                      }
                      className={
                        tradingPrefs.defaultOrderType === "limit"
                          ? "p-4 rounded-xl bg-green-500 text-black font-bold"
                          : "p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                      }
                    >
                      Limit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Default Quantity
                  </label>

                  <input
                    value={tradingPrefs.defaultQuantity}
                    type="number"
                    min="1"
                    onChange={(e) =>
                      setTradingPrefs({
                        ...tradingPrefs,
                        defaultQuantity: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Refresh Interval
                  </label>

                  <select
                    value={tradingPrefs.refreshInterval}
                    onChange={(e) =>
                      setTradingPrefs({
                        ...tradingPrefs,
                        refreshInterval: e.target.value,
                      })
                    }
                    className={selectClass}
                  >
                    <option value="5">Every 5 seconds</option>
                    <option value="15">Every 15 seconds</option>
                    <option value="30">Every 30 seconds</option>
                  </select>
                </div>

                <div className="bg-slate-100 dark:bg-[#0f1b2e] rounded-2xl p-4 border border-slate-200 dark:border-white/10">
                  <ToggleRow
                    label="Show Trade Confirmation"
                    desc="Show confirmation before important trade actions."
                    checked={tradingPrefs.showTradeConfirmation}
                    onChange={(e) =>
                      setTradingPrefs({
                        ...tradingPrefs,
                        showTradeConfirmation: e.target.checked,
                      })
                    }
                  />

                  <ToggleRow
                    label="Enable Quick Buy/Sell"
                    desc="Keep quick trading controls enabled in the simulator."
                    checked={tradingPrefs.enableQuickBuySell}
                    onChange={(e) =>
                      setTradingPrefs({
                        ...tradingPrefs,
                        enableQuickBuySell: e.target.checked,
                      })
                    }
                  />
                </div>
              </div>

              <button
                onClick={saveTradingPrefs}
                className={`${primaryBtn} mt-6 w-full sm:w-auto px-8`}
              >
                Save Trading Preferences
              </button>
            </SettingCard>
          )}

          {activeTab === "notifications" && (
            <SettingCard
              title="Notification Settings"
              desc="Choose which simulator updates you want to receive."
            >
              <div className="bg-slate-100 dark:bg-[#0f1b2e] rounded-2xl p-4 border border-slate-200 dark:border-white/10">
                <ToggleRow
                  label="Trade Executed"
                  desc="Notify when a buy or sell action is completed."
                  checked={notifications.tradeExecuted}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      tradeExecuted: e.target.checked,
                    })
                  }
                />

                <ToggleRow
                  label="Order Filled"
                  desc="Notify when simulator order status is completed."
                  checked={notifications.orderFilled}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      orderFilled: e.target.checked,
                    })
                  }
                />

                <ToggleRow
                  label="Portfolio Summary"
                  desc="Receive summary-style updates about portfolio activity."
                  checked={notifications.portfolioSummary}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      portfolioSummary: e.target.checked,
                    })
                  }
                />

                <ToggleRow
                  label="Market Alerts"
                  desc="Notify about important simulator market movement."
                  checked={notifications.marketAlerts}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      marketAlerts: e.target.checked,
                    })
                  }
                />

                <ToggleRow
                  label="Price Alerts"
                  desc="Notify when your saved target price alert is triggered."
                  checked={notifications.priceAlerts}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      priceAlerts: e.target.checked,
                    })
                  }
                />

                <ToggleRow
                  label="Promotions"
                  desc="Optional product or announcement notifications."
                  checked={notifications.promotions}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      promotions: e.target.checked,
                    })
                  }
                />
              </div>

              <button
                onClick={saveNotifications}
                className={`${primaryBtn} mt-6 w-full sm:w-auto px-8`}
              >
                Save Notifications
              </button>
            </SettingCard>
          )}

          {activeTab === "security" && (
            <SettingCard
              title="Change Password"
              desc="Update your password and account safety preferences."
            >
              <form onSubmit={handleChangePassword} className="max-w-xl space-y-4">
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  placeholder="Enter old password"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  placeholder="Minimum 8 characters"
                />

                <button
                  disabled={loading}
                  className={`${primaryBtn} w-full sm:w-auto px-8`}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </SettingCard>
          )}

          {activeTab === "support" && (
            <SettingCard
              title="Help & Support"
              desc="Submit reports, feedback, and track admin responses."
            >
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-slate-100 dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Contact Support
                  </h3>

                  <div className="space-y-3 mt-5">
                    <button
                      type="button"
                      onClick={() => openSupportModal("BUG")}
                      className="w-full py-3 min-h-[48px] bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition"
                    >
                      Report Bug
                    </button>

                    <button
                      type="button"
                      onClick={() => openSupportModal("FEEDBACK")}
                      className="w-full py-3 min-h-[48px] bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition"
                    >
                      Send Feedback
                    </button>

                    <button
                      type="button"
                      onClick={shareReferral}
                      className={`${secondaryBtn} w-full`}
                    >
                      Share Referral Link
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    FAQ
                  </h3>

                  <p className="mt-3 text-slate-600 dark:text-gray-300">
                    StockSim uses virtual money only. Bug reports are reviewed by
                    admin. Feedback is used to improve the simulator.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  My Support Tickets
                </h3>

                {reportsLoading ? (
                  <div className={cardClass}>Loading tickets...</div>
                ) : myReports.length === 0 ? (
                  <div className={cardClass}>No support tickets submitted yet.</div>
                ) : (
                  <div className="space-y-4">
                    {myReports.map((ticket) => (
                      <div
                        key={ticket._id}
                        className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-5"
                      >
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className={
                              ticket.type === "BUG"
                                ? "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                                : "px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold"
                            }
                          >
                            {ticket.type}
                          </span>

                          {ticket.type === "BUG" && (
                            <span
                              className={
                                ticket.status === "OPEN"
                                  ? "px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold"
                                  : "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                              }
                            >
                              {ticket.status}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {ticket.subject}
                        </h4>

                        <p className="mt-3 text-slate-600 dark:text-gray-300">
                          {ticket.message}
                        </p>

                        {ticket.adminReply && (
                          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-2">
                              Admin Response
                            </p>
                            <p className="text-sm text-slate-700 dark:text-gray-200">
                              {ticket.adminReply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SettingCard>
          )}
        </section>
      </div>

      {supportModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {supportType === "BUG" ? "Report Bug" : "Send Feedback"}
            </h2>

            <form onSubmit={submitSupportReport} className="space-y-4 mt-6">
              <input
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                placeholder="Subject"
                className={inputClass}
              />

              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe your issue or feedback"
                rows="5"
                className={inputClass}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={supportLoading}
                  className={`${primaryBtn} w-full`}
                >
                  {supportLoading ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => setSupportModal(false)}
                  className={`${secondaryBtn} w-full`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSettings;