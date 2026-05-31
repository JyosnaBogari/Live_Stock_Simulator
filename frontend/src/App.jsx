import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import ThemeProvider from "./components/ThemeProvider";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Market from "./components/Market";
import Portfolio from "./components/Portfolio";
import Leaderboard from "./components/Leaderboard";
import StockDetails from "./components/StockDetails";
import Alerts from "./components/Alerts";
import AIAssistant from "./components/AIAssistant";
import Watchlist from "./components/Watchlist";
import News from "./components/News";
import ProfileSettings from "./components/ProfileSettings";
import About from "./components/About";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminStatistics from "./components/AdminStatistics";
import AdminReports from "./components/AdminReports";
import AdminMonitor from "./components/AdminMonitor";
import Learn from "./components/Learn";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const routerObj = createBrowserRouter([
    // Unauthorized page WITHOUT RootLayout
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
        {
          path: "market",
          element: <Market />,
        },
        {
          path: "stock/:symbol",
          element: <StockDetails />,
        },
        {
          path: "news",
          element: <News />,
        },
        {
          path: "ai-assistant",
          element: <AIAssistant />,
        },
        {
          path: "learn",
          element: <Learn />,
        },
        {
          path: "about",
          element: <About />,
        },

        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard/settings",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <ProfileSettings />
            </ProtectedRoute>
          ),
        },
        {
          path: "portfolio",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Portfolio />
            </ProtectedRoute>
          ),
        },
        {
          path: "watchlist",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Watchlist />
            </ProtectedRoute>
          ),
        },
        {
          path: "alerts",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Alerts />
            </ProtectedRoute>
          ),
        },
        {
          path: "leaderboard",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <Leaderboard />
            </ProtectedRoute>
          ),
        },

        {
          path: "admin",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/users",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/statistics",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStatistics />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/reports",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReports />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/monitor",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminMonitor />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={routerObj} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#0f1b2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#000",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;