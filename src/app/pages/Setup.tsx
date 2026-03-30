import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchableSelect } from "../components/SearchableSelect";
import { getDepartmentOptionsByCourse } from "../data/departments";

export function Setup() {
  const { profile, saveProfile, user } = useAuth();
  const navigate = useNavigate();

  const [requiredHours, setRequiredHours] = useState<number>(profile?.requiredHours ?? 480);
  const [startDate, setStartDate] = useState(profile?.startDate ?? "");
  const [targetEndDate, setTargetEndDate] = useState(profile?.targetEndDate ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const [department, setDepartment] = useState(profile?.department ?? "");
  const course = profile?.course ?? user?.course ?? "";
  const departmentOptions = getDepartmentOptionsByCourse(course);

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
      course,
      department,
    });
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl backdrop-blur-md bg-yellow-50/90 rounded-2xl border border-amber-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-7"
      >
        <h1 className="text-2xl font-bold text-slate-900">OJT Setup</h1>
        <p className="mt-1 text-sm text-slate-600">
          Hi {user?.name ?? "Student"}, set your required hours and training info.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/60 px-3 py-2.5 text-sm text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Required Hours</label>
            <input
              type="number"
              min={1}
              value={requiredHours}
              onChange={(e) => setRequiredHours(Number(e.target.value))}
              required
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/60 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/60 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Target End Date</label>
            <input
              type="date"
              value={targetEndDate}
              onChange={(e) => setTargetEndDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/60 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Company / Host Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp Solutions Inc."
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/60 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Course</label>
            <input
              type="text"
              value={course || "Not set"}
              readOnly
              className="mt-1 w-full rounded-xl border border-amber-200/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700"
            />
          </div>

          <div className="sm:col-span-2">
            <SearchableSelect
              options={departmentOptions}
              value={department}
              onChange={setDepartment}
              placeholder="Search department..."
              label="Department"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 font-semibold transition-all duration-300 hover:from-amber-400 hover:to-orange-500"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}
