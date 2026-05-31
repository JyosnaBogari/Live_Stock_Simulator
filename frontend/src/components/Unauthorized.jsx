import { useAuth } from "../store/authStore";
import { Link } from "react-router";

function Unauthorized() {
  const currentUser = useAuth((state) => state.currentUser);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08111f] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-center max-w-md w-full shadow-sm">

        <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6 text-4xl font-bold">
          !
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Access Denied
        </h1>

        <p className="text-slate-500 dark:text-gray-400">
          {currentUser?.role === "ADMIN"
            ? "This page is available only for trader accounts."
            : "This page is available only for admin accounts."}
        </p>

        <p className="text-xs text-slate-400 mt-4">
          Current role: {currentUser?.role}
        </p>

        <div className="flex gap-3 mt-6">
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl border border-slate-200 text-center"
          >
            Home
          </Link>

          <Link
            to={currentUser?.role === "ADMIN" ? "/admin" : "/dashboard"}
            className="flex-1 py-3 rounded-xl bg-green-500 text-black text-center font-semibold"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;