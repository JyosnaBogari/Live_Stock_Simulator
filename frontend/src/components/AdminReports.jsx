import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "../store/adminStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
} from "../styles/common.js";

function AdminReports() {
  const reports = useAdmin((state) => state.reports);
  const fetchReports = useAdmin((state) => state.fetchReports);
  const resolveReport = useAdmin((state) => state.resolveReport);
  const [resolveModal, setResolveModal] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);
const [adminReply, setAdminReply] = useState("");

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const bugReports = reports.filter((report) => report.type === "BUG");
  const feedbackReports = reports.filter((report) => report.type === "FEEDBACK");

  const openResolveModal = (report) => {
  setSelectedReport(report);
  setAdminReply("");
  setResolveModal(true);
};

const handleResolve = async (e) => {
  e.preventDefault();

  if (!adminReply.trim()) {
    toast.error("Please enter resolution message");
    return;
  }

  const result = await resolveReport(selectedReport._id, adminReply);

  if (result.success) {
    toast.success("Bug report resolved with message");
    setResolveModal(false);
    setSelectedReport(null);
    setAdminReply("");
    fetchReports();
  } else {
    toast.error(result.message || "Failed to resolve report");
  }
};

  const ReportCard = ({ report, isBug }) => (
    <div className={cardClass}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={
                report.type === "BUG"
                  ? "px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
                  : "px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold"
              }
            >
              {report.type}
            </span>

            {isBug && (
              <span
                className={
                  report.status === "OPEN"
                    ? "px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold"
                    : "px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold"
                }
              >
                {report.status}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {report.subject}
          </h2>

          <p className="mt-3 text-slate-600 dark:text-gray-300 leading-relaxed">
            {report.message}
          </p>

          <p className="text-sm mt-4 text-slate-500 dark:text-gray-400 break-words">
            By: {report.userId?.firstName} {report.userId?.lastName} (
            {report.userId?.email})
          </p>
        </div>

        {isBug && report.status === "OPEN" && (
          <button
           onClick={() => openResolveModal(report)}
            className="w-full sm:w-auto px-5 py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={pageWrapper}>
      <div className="mb-8">
        <p className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-4">
          Admin Support
        </p>

        <h1 className={pageTitleClass}>Reports & Feedback</h1>

        <p className={`${mutedText} mt-2`}>
          Review user bug reports separately from general feedback.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Bug Reports
        </h2>

        <div className="grid gap-5">
          {bugReports.length === 0 ? (
            <div className={cardClass}>
              <p className="text-slate-600 dark:text-gray-300">
                No bug reports submitted yet.
              </p>
            </div>
          ) : (
            bugReports.map((report) => (
              <ReportCard key={report._id} report={report} isBug={true} />
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          User Feedback
        </h2>

        <div className="grid gap-5">
          {feedbackReports.length === 0 ? (
            <div className={cardClass}>
              <p className="text-slate-600 dark:text-gray-300">
                No feedback submitted yet.
              </p>
            </div>
          ) : (
            feedbackReports.map((report) => (
              <ReportCard key={report._id} report={report} isBug={false} />
            ))
          )}
        </div>
      </section>
      {resolveModal && (
  <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="w-full max-w-lg bg-white dark:bg-[#0f1b2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Resolve Bug Report
      </h2>

      <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
        Add a message so the user understands what was fixed or what action was taken.
      </p>

      <div className="mt-5 bg-slate-100 dark:bg-[#08111f] rounded-xl p-4 border border-slate-200 dark:border-white/10">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {selectedReport?.subject}
        </p>
        <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
          {selectedReport?.message}
        </p>
      </div>

      <form onSubmit={handleResolve} className="space-y-4 mt-5">
        <textarea
          value={adminReply}
          onChange={(e) => setAdminReply(e.target.value)}
          placeholder="Example: The live price refresh issue has been fixed. Please refresh your dashboard and check again."
          rows="5"
          className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#08111f] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-green-500"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition"
          >
            Resolve with Message
          </button>

          <button
            type="button"
            onClick={() => setResolveModal(false)}
            className="w-full py-3 border border-slate-300 dark:border-white/20 rounded-xl text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
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

export default AdminReports;