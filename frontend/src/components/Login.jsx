import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common.js";

import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/authStore.js";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

function Login() {
  const { register, handleSubmit } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);
  const loading = useAuth((state) => state.loading);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";
  const sessionMessage =
  location.state?.message || sessionStorage.getItem("auth-message");

 useEffect(() => {
  const message = sessionStorage.getItem("auth-message");

  if (message) {
    toast.error(message);
    sessionStorage.removeItem("auth-message");
  }
}, []);

  const cleanError = (message) => {
    if (!message) return "Login failed. Please try again.";

    const lower = message.toLowerCase();

    if (lower.includes("network")) {
      return "Server is not reachable. Please try again later.";
    }

    if (lower.includes("unauthorized")) {
      return "Please login to continue.";
    }

    if (lower.includes("jwt") || lower.includes("token")) {
      return "Session expired. Please login again.";
    }

    return message;
  };

  const onUserLogin = async (userCredObj) => {
    const result = await login(userCredObj);

    if (result?.success) {
      toast.success(`Welcome ${result.user.firstName}`);

      if (result.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      toast.error(cleanError(result?.message));
    }
  };

useEffect(() => {
  if (!isAuthenticated || !currentUser) return;

  const redirectedFromProtectedRoute = Boolean(location.state?.from);

  if (redirectedFromProtectedRoute) {
    return;
  }

  if (currentUser.role === "ADMIN") {
    navigate("/admin", { replace: true });
  } else {
    navigate("/dashboard", { replace: true });
  }
}, [isAuthenticated, currentUser, navigate, location.state]);

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <div className={formCard}>
        <div className="text-center mb-6">
          <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
            Welcome Back
          </p>

          <h2 className={formTitle}>Sign In</h2>

          {sessionMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {sessionMessage}
              </p>
            </div>
          ) : (
            <p className={`${mutedText} text-center`}>
              Sign in to continue using StockSim.
            </p>
          )}
        </div>

        {error && <p className={errorClass}>{cleanError(error)}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          <div className={formGroup}>
            <label className={labelClass}>Email</label>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className={`${mutedText} text-center mt-6`}>
          Do not have an account?{" "}
          <NavLink to="/signup" className={linkClass}>
            Create account
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;