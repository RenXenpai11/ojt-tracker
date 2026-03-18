import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Setup() {
  const { profile, saveProfile, user } = useAuth();
  const navigate = useNavigate();

  const [requiredHours, setRequiredHours] = useState<number>(profile?.requiredHours ?? 480);
  const [startDate, setStartDate] = useState(profile?.startDate ?? "");
  const [targetEndDate, setTargetEndDate] = useState(profile?.targetEndDate ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveProfile({
      requiredHours: Math.max(1, requiredHours),
      startDate,
      targetEndDate,
      company,
      avatarUrl,
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
      course: profile?.course ?? "",
      department: profile?.department ?? "",
    });
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-7"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">OJT Setup</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Hi {user?.name ?? "Student"}, set your required hours and training info.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Required Hours</label>
            <input
              type="number"
              min={1}
              value={requiredHours}
              onChange={(e) => setRequiredHours(Number(e.target.value))}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target End Date</label>
            <input
              type="date"
              value={targetEndDate}
              onChange={(e) => setTargetEndDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company / Host Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp Solutions Inc."
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}
