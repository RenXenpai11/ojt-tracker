import {
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  Edit3,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useOJT } from "../context/OJTContext";
import { useAuth } from "../context/AuthContext";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1765648636207-22c892e8fae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHdvbWFuJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzgwNTI5NXww&ixlib=rb-4.1.0&q=80&w=1080";

const milestones = [
  { label: "First Day Complete", hours: 0, achieved: true },
  { label: "25% Complete", hours: 120, achieved: true },
  { label: "50% Complete", hours: 240, achieved: false },
  { label: "75% Complete", hours: 360, achieved: false },
  { label: "OJT Graduate", hours: 480, achieved: false },
];

export function Profile() {
  const { totalHoursCompleted, remainingHours, progressPercent, logs, averageHoursPerDay, requiredHours } = useOJT();
  const { user, profile, saveProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const displayName = user?.name || "OJT Trainee";
  const displayEmail = user?.email || "Not set";
  const displaySchool = user?.school || "Not set";
  const companyName = profile?.company || "Not set";
  const displayPhone = profile?.phone || "Not set";
  const displayLocation = profile?.location || "Not set";
  const displayCourse = profile?.course || "BS Information Technology";
  const displayDepartment = profile?.department || "Software Development";
  const displayAvatar = profile?.avatarUrl || AVATAR_URL;
  const startDateLabel = profile?.startDate
    ? new Date(profile.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Not set";

  const [editCompany, setEditCompany] = useState(profile?.company ?? "");
  const [editPhone, setEditPhone] = useState(profile?.phone ?? "");
  const [editLocation, setEditLocation] = useState(profile?.location ?? "");
  const [editCourse, setEditCourse] = useState(profile?.course ?? "");
  const [editDepartment, setEditDepartment] = useState(profile?.department ?? "");
  const [editStartDate, setEditStartDate] = useState(profile?.startDate ?? "");
  const [editTargetEndDate, setEditTargetEndDate] = useState(profile?.targetEndDate ?? "");

  function buildProfile(overrides?: Partial<typeof profile>): NonNullable<typeof profile> {
    return {
      requiredHours,
      startDate: profile?.startDate ?? "",
      targetEndDate: profile?.targetEndDate ?? "",
      company: profile?.company ?? "",
      avatarUrl: profile?.avatarUrl,
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
      course: profile?.course ?? "",
      department: profile?.department ?? "",
      ...overrides,
    };
  }

  function openEditProfile() {
    setEditCompany(profile?.company ?? "");
    setEditPhone(profile?.phone ?? "");
    setEditLocation(profile?.location ?? "");
    setEditCourse(profile?.course ?? "");
    setEditDepartment(profile?.department ?? "");
    setEditStartDate(profile?.startDate ?? "");
    setEditTargetEndDate(profile?.targetEndDate ?? "");
    setIsEditingProfile(true);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(
      buildProfile({
        company: editCompany,
        phone: editPhone,
        location: editLocation,
        course: editCourse,
        department: editDepartment,
        startDate: editStartDate,
        targetEndDate: editTargetEndDate,
      })
    );
    setIsEditingProfile(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      saveProfile({
        requiredHours,
        startDate: profile?.startDate ?? "",
        targetEndDate: profile?.targetEndDate ?? "",
        company: profile?.company ?? "",
        avatarUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  }

  const estimatedEndDate = () => {
    if (averageHoursPerDay <= 0) return "N/A";
    const daysLeft = Math.ceil(remainingHours / averageHoursPerDay);
    const end = new Date();
    end.setDate(end.getDate() + daysLeft);
    return end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const targetEndDateLabel = profile?.targetEndDate
    ? new Date(profile.targetEndDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : estimatedEndDate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "14px" }}>
          Your OJT trainee information and progress overview
        </p>
      </div>

      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 dark:text-gray-100">Edit Profile</h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="e.g. +63 9xx xxx xxxx"
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. Davao City"
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
              <input
                type="text"
                value={editCourse}
                onChange={(e) => setEditCourse(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input
                type="text"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target End Date</label>
              <input
                type="date"
                value={editTargetEndDate}
                onChange={(e) => setEditTargetEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
          <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="px-5 pb-5">
            <div className="-mt-10 mb-3 flex items-end">
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 rounded-full ring-2 ring-white dark:ring-gray-900" />
              </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={openEditProfile}
                type="button"
                className="w-full sm:w-auto justify-center flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 px-3 py-1.5 rounded-xl transition-all"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="w-full sm:w-auto justify-center flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 px-3 py-1.5 rounded-xl transition-all"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <h2 className="text-gray-900 dark:text-white">{displayName}</h2>
            <p className="text-blue-500 dark:text-blue-400 mt-0.5" style={{ fontSize: "13px", fontWeight: 500 }}>
              OJT Trainee · Batch 2026
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                { icon: Mail, value: displayEmail, label: "Email" },
                { icon: Phone, value: displayPhone, label: "Phone" },
                { icon: MapPin, value: displayLocation, label: "Location" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 truncate" style={{ fontSize: "13px" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-colors">
            <h3 className="text-gray-800 dark:text-gray-100 mb-4">Training Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "Company", value: companyName },
                { icon: GraduationCap, label: "School", value: displaySchool },
                { icon: BookOpen, label: "Course", value: displayCourse },
                { icon: Calendar, label: "Department", value: displayDepartment },
                { icon: Calendar, label: "Start Date", value: startDateLabel },
                { icon: Calendar, label: "Est. End Date", value: targetEndDateLabel },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-gray-100 dark:border-gray-600">
                    <item.icon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p
                      className="text-gray-400 dark:text-gray-500"
                      style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      {item.label}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 mt-0.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Days", value: logs.length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
              { label: "Hours Done", value: `${totalHoursCompleted}`, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950" },
              { label: "Hours Left", value: `${remainingHours}`, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950" },
              { label: "Avg hrs/day", value: `${averageHoursPerDay}`, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center transition-colors`}>
                <p className={s.color} style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>{s.value}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-colors">
          <h3 className="text-gray-800 dark:text-gray-100 mb-4">OJT Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "13px" }}>
              {totalHoursCompleted} / {requiredHours} hours
            </span>
            <span className="text-blue-600 dark:text-blue-400" style={{ fontSize: "13px", fontWeight: 600 }}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-5">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-3 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-2">
            {[
              { label: "Week 1 (Mar 4–8)", hours: 41, maxHours: 48, color: "bg-blue-500" },
              { label: "Week 2 (Mar 9–13)", hours: 41.5, maxHours: 48, color: "bg-blue-500" },
              { label: "Week 3 (Mar 14–18)", hours: 37.5, maxHours: 48, color: "bg-blue-400" },
              { label: "Remaining Weeks", hours: 0, maxHours: 336, color: "bg-gray-300 dark:bg-gray-700" },
            ].map((week) => (
              <div key={week.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "12px" }}>{week.label}</span>
                  <span className="text-gray-600 dark:text-gray-300" style={{ fontSize: "12px", fontWeight: 500 }}>
                    {week.hours} / {week.maxHours} hrs
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`${week.color} rounded-full h-1.5`}
                    style={{ width: `${(week.hours / week.maxHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-yellow-500" />
            <h3 className="text-gray-800 dark:text-gray-100">Milestones</h3>
          </div>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.label}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  m.achieved
                    ? "bg-green-50 dark:bg-green-950"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    m.achieved ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {m.achieved ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Award className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={m.achieved ? "text-gray-800 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}
                    style={{ fontSize: "13px", fontWeight: m.achieved ? 600 : 400 }}
                  >
                    {m.label}
                  </p>
                  <p className="text-gray-400 dark:text-gray-600 mt-0.5" style={{ fontSize: "11px" }}>
                    Requires {m.hours} hrs completed
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    m.achieved
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  {m.achieved ? "Achieved" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
