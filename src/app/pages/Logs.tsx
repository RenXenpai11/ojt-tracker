import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Search,
  Trash2,
  Plus,
  Filter,
  FileText,
  X,
} from "lucide-react";
import { useOJT } from "../context/OJTContext";
import type { LogEntry } from "../store/ojt-store";
import { calcHours } from "../store/ojt-store";

export function Logs() {
  const { logs, deleteLog, addLog, totalHoursCompleted, requiredHours } = useOJT();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState({ date: "", timeIn: "", timeOut: "", notes: "" });
  const [formError, setFormError] = useState("");

  const filtered = logs
    .filter(
      (log) =>
        log.date.toLowerCase().includes(search.toLowerCase()) ||
        log.notes.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") return b.id.localeCompare(a.id);
      return a.id.localeCompare(b.id);
    });

  function handleAdd() {
    if (!form.date || !form.timeIn || !form.timeOut) {
      setFormError("Please fill in all required fields.");
      return;
    }
    const hours = calcHours(formatTo12h(form.timeIn), formatTo12h(form.timeOut));
    if (hours <= 0) {
      setFormError("Time Out must be after Time In.");
      return;
    }
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      date: formatDateDisplay(form.date),
      timeIn: formatTo12h(form.timeIn),
      timeOut: formatTo12h(form.timeOut),
      totalHours: hours,
      notes: form.notes,
    };
    addLog(newLog);
    setForm({ date: "", timeIn: "", timeOut: "", notes: "" });
    setFormError("");
    setShowModal(false);
  }

  function formatTo12h(time24: string): string {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  }

  function formatDateDisplay(d: string): string {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Daily Logs</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "14px" }}>
            {logs.length} entries · {totalHoursCompleted} / {requiredHours} hours completed
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-blue-300 hover:shadow-md active:scale-95"
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Search by date or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-700 transition-colors"
            style={{ fontSize: "13px" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 appearance-none pr-8 transition-colors"
            style={{ fontSize: "13px" }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          {["Date", "Time In", "Time Out", "Hours", "Notes", ""].map((h, i) => (
            <div
              key={i}
              className={`text-gray-500 dark:text-gray-500 ${
                i === 1 || i === 2
                  ? "col-span-2 hidden sm:block"
                  : i === 4
                    ? "col-span-2 hidden md:block"
                    : i === 5
                      ? "col-span-1 text-right"
                      : i === 3
                        ? "col-span-2"
                        : "col-span-3"
              }`}
              style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {h}
            </div>
          ))}
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "14px", fontWeight: 500 }}>No logs found</p>
              <p className="text-gray-400 dark:text-gray-600 mt-1" style={{ fontSize: "13px" }}>
                {search ? "Try a different search term" : "Start tracking your OJT hours"}
              </p>
            </div>
          ) : (
            filtered.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-2 items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="col-span-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950 rounded-lg hidden sm:flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-800 dark:text-gray-100" style={{ fontSize: "13px", fontWeight: 600 }}>{log.date}</p>
                </div>

                <div className="col-span-2 hidden sm:block">
                  <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300" style={{ fontSize: "13px" }}>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    {log.timeIn}
                  </span>
                </div>

                <div className="col-span-2 hidden sm:block">
                  <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300" style={{ fontSize: "13px" }}>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    {log.timeOut ?? "—"}
                  </span>
                </div>

                <div className="col-span-2">
                  <span
                    className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  >
                    <Clock className="w-3 h-3" />
                    {log.totalHours ?? "—"} hrs
                  </span>
                </div>

                <div className="col-span-2 hidden md:block">
                  <p className="text-gray-400 dark:text-gray-600 truncate" style={{ fontSize: "12px" }}>
                    {log.notes || "—"}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end">
                  {deleteConfirm === log.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteLog(log.id);
                          setDeleteConfirm(null);
                        }}
                        className="text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 px-2 py-1 rounded-lg transition-colors"
                        style={{ fontSize: "11px", fontWeight: 600 }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
                        style={{ fontSize: "11px", fontWeight: 600 }}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(log.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "12px" }}>
              Showing {filtered.length} of {logs.length} entries
            </p>
            <p className="text-gray-600 dark:text-gray-300" style={{ fontSize: "12px", fontWeight: 600 }}>
              Total: {filtered.reduce((s, l) => s + (l.totalHours ?? 0), 0)} hrs
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 dark:text-white">Add Log Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontSize: "13px" }}>
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-700 transition-colors"
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Time In", key: "timeIn" },
                  { label: "Time Out", key: "timeOut" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontSize: "13px" }}>
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-700 transition-colors"
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontSize: "13px" }}>
                  Notes / Activities
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Describe your tasks for the day..."
                  rows={3}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-700 resize-none transition-colors"
                  style={{ fontSize: "13px" }}
                />
              </div>

              {formError && (
                <p className="text-red-500" style={{ fontSize: "12px" }}>{formError}</p>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2.5 rounded-xl transition-colors"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-200"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
