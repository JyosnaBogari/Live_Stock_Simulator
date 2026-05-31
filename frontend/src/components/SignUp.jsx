import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../store/authStore.js";
import toast from "react-hot-toast";

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

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const registerUser = useAuth((state) => state.registerUser);
  const error = useAuth((state) => state.error);
  const loading = useAuth((state) => state.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const cleanError = (message) => {
    if (!message) return "Registration failed. Please try again.";
    if (message.toLowerCase().includes("network")) {
      return "Server is not reachable. Please try again later.";
    }
    if (message.toLowerCase().includes("duplicate")) {
      return "Email already exists. Please login instead.";
    }
    return message;
  };

  const onUserRegister = async (userObj) => {
    const result = await registerUser(userObj);

    if (result.success) {
      toast.success("Account created successfully");
      navigate("/login");
    } else {
      toast.error(cleanError(result.message));
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center px-4 py-16`}>
      <div className={formCard}>
        <div className="text-center mb-6">
          <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
            Start Trading Practice
          </p>

          <h2 className={formTitle}>Create Account</h2>

          <p className={mutedText}>
            Join StockSim and practice trading safely with virtual money.
          </p>
        </div>

        {error && <p className={errorClass}>{cleanError(error)}</p>}

        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-4">
          <div>
            <label className={labelClass}>First Name</label>

            <input
              type="text"
              placeholder="Enter first name"
              className={inputClass}
              {...register("firstName", {
                required: "First name is required",
              })}
            />

            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Last Name</label>

            <input
              type="text"
              placeholder="Enter last name"
              className={inputClass}
              {...register("lastName")}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(?![0-9]+@)(?!.*\.\.)[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|anurag\.edu\.in)$/,
                  message:
                    "Enter a valid email like name@gmail.com or college email",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className={`${inputClass} pr-12`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-green-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={`${mutedText} text-center mt-6`}>
          Already have an account?{" "}
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;