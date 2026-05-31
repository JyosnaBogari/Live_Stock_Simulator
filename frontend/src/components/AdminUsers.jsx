import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "../store/adminStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  tableWrapper,
  tableClass,
  tableHeadClass,
  tableRowClass,
  tableCellClass,
} from "../styles/common.js";

function AdminUsers() {
  const users = useAdmin((state) => state.users);
  const fetchUsers = useAdmin((state) => state.fetchUsers);
  const updateUserStatus = useAdmin((state) => state.updateUserStatus);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (user) => {
    const result = await updateUserStatus(user._id, !user.isActive);

    if (result.success) {
      toast.success(user.isActive ? "User blocked" : "User unblocked");
      fetchUsers();
    } else {
      toast.error(result.message || "Failed to update user status");
    }
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
          User Management
        </p>

        <h1 className={pageTitleClass}>Manage Users</h1>

        <p className={`${mutedText} mt-2`}>
          View normal users, block or unblock accounts, and check portfolio
          count.
        </p>
      </div>

      <div className={tableWrapper}>
        <table className={tableClass}>
          <thead className={tableHeadClass}>
            <tr>
              <th className={tableCellClass}>Name</th>
              <th className={tableCellClass}>Email</th>
              <th className={tableCellClass}>Wallet</th>
              <th className={tableCellClass}>Portfolio Count</th>
              <th className={tableCellClass}>Status</th>
              <th className={tableCellClass}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={tableRowClass}>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </td>

                <td className={tableCellClass}>{user.email}</td>

                <td className={tableCellClass}>
                  ₹{Number(user.walletBalance || 0).toFixed(2)}
                </td>

                <td className={tableCellClass}>{user.portfolioCount || 0}</td>

                <td className={tableCellClass}>
                  {user.isActive ? (
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">
                      Blocked
                    </span>
                  )}
                </td>

                <td className={tableCellClass}>
                  <button
                    onClick={() => handleStatusChange(user)}
                    className={
                      user.isActive
                        ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                        : "px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-xl font-semibold transition"
                    }
                  >
                    {user.isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className={`${mutedText} mt-5`}>No users found.</p>
      )}
    </div>
  );
}

export default AdminUsers;