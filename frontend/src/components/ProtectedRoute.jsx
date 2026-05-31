import { Navigate, useLocation } from "react-router";
import { useAuth } from "../store/authStore.js";

function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const loading = useAuth((state) => state.loading);
  const authChecked = useAuth((state) => state.authChecked);
  const currentUser = useAuth((state) => state.currentUser);

  const location = useLocation();

  if (loading || !authChecked) {
    return (
      <div className="min-h-[70vh] bg-slate-50 dark:bg-[#08111f] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin mx-auto mb-4" />

          <p className="font-bold text-slate-900 dark:text-white">
            Checking authentication
          </p>

          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
  return <Navigate to="/unauthorized" replace />;
}

  return children;
}

export default ProtectedRoute;