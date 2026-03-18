import {
  Clock,
  CheckCircle2,
  Timer,
  TrendingUp,
  Play,
  Square,
  Sparkles,
  CalendarDays,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useOJT } from "../context/OJTContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

const weeklyData = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 8.5 },
  { day: "Wed", hours: 9 },
  { day: "Thu", hours: 8 },
  { day: "Fri", hours: 8.5 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

export function Dashboard() {
  const {
    logs,
    requiredHours,
    isClockedIn,
    clockInTime,
    todayNote,
    setTodayNote,
    handleTimeIn,
    handleTimeOut,
    totalHoursCompleted,
    remainingHours,
    averageHoursPerDay,
    progressPercent,
  } = useOJT();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function onTimeIn() {
    handleTimeIn();
  }

  function onTimeOut() {
    handleTimeOut();
  }

  const recentLogs = logs.slice(0, 5);

  const chartGridColor = isDark ? "#374151" : "#f0f0f0";
  const chartTickColor = isDark ? "#6b7280" : "#9ca3af";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipText = isDark ? "#f3f4f6" : "#111827";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white font-bold">OJT Tracker Dashboard</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "14px" }}>
            Track your on-the-job training hours and activities
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span style={{ fontSize: "12px", fontWeight: 600 }}>Batch 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-blue-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 right-12 w-24 h-24 bg-white/5 rounded-full translate-y-8" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-blue-200" style={{ fontSize: "13px", fontWeight: 500 }}>Total Progress</p>
                <h2 className="text-white mt-0.5" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.2 }}>
                  {totalHoursCompleted}
                  <span className="text-blue-200" style={{ fontSize: "16px", fontWeight: 500 }}>
                    {" "}/ {requiredHours} hrs
                  </span>
                </h2>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white" style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>{progressPercent}%</p>
                  <p className="text-blue-200" style={{ fontSize: "10px" }}>done</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-200" style={{ fontSize: "12px" }}>Progress</span>
                <span className="text-blue-100" style={{ fontSize: "12px", fontWeight: 600 }}>{progressPercent}% completed</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-700 relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Completed", value: `${totalHoursCompleted} hrs`, color: "text-green-300" },
                { label: "Remaining", value: `${remainingHours} hrs`, color: "text-yellow-300" },
                { label: "Avg/Day", value: `${averageHoursPerDay} hrs`, color: "text-blue-200" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl px-3 py-2.5">
                  <p className={stat.color} style={{ fontSize: "15px", fontWeight: 700, lineHeight: 1.2 }}>{stat.value}</p>
                  <p className="text-blue-200" style={{ fontSize: "11px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 dark:text-gray-100">Time Tracker</h3>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isClockedIn ? "bg-green-50 dark:bg-green-950" : "bg-gray-100 dark:bg-gray-800"}`}>
              <div className={`w-2 h-2 rounded-full ${isClockedIn ? "bg-green-500 animate-pulse" : "bg-gray-400 dark:bg-gray-600"}`} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: isClockedIn ? "#16a34a" : isDark ? "#9ca3af" : "#6b7280" }}>
                {isClockedIn ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 text-center transition-colors">
            <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 mb-1">
              <Timer className="w-4 h-4" />
              <span style={{ fontSize: "12px" }}>Today's Session</span>
            </div>
            {isClockedIn && clockInTime ? (
              <div>
                <p className="text-gray-800 dark:text-gray-100" style={{ fontSize: "22px", fontWeight: 700 }}>{clockInTime}</p>
                <p className="text-green-500 mt-0.5" style={{ fontSize: "12px", fontWeight: 500 }}>Clocked in — session running</p>
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: "14px" }}>No active session</p>
            )}
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-end">
            <button
              onClick={onTimeIn}
              disabled={isClockedIn}
              className={`
                w-full flex items-center justify-center gap-2.5 py-3 rounded-xl transition-all duration-200 shadow-sm
                ${isClockedIn
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-green-200 hover:shadow-green-300 hover:shadow-md active:scale-95"
                }
              `}
            >
              <Play className="w-4 h-4" fill={isClockedIn ? (isDark ? "#4b5563" : "#9ca3af") : "white"} />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Time In</span>
            </button>

            <button
              onClick={onTimeOut}
              disabled={!isClockedIn}
              className={`
                w-full flex items-center justify-center gap-2.5 py-3 rounded-xl transition-all duration-200 shadow-sm
                ${!isClockedIn
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-red-200 hover:shadow-red-300 hover:shadow-md active:scale-95"
                }
              `}
            >
              <Square className="w-4 h-4" fill={!isClockedIn ? (isDark ? "#4b5563" : "#9ca3af") : "white"} />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Time Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Total Hours Completed",
            value: `${totalHoursCompleted} hrs`,
            sub: `Out of ${requiredHours} required`,
            icon: CheckCircle2,
            iconBg: "bg-green-50 dark:bg-green-950",
            iconColor: "text-green-500",
            trend: "+9 hrs this week",
            trendColor: "text-green-500",
          },
          {
            title: "Remaining Hours",
            value: `${remainingHours} hrs`,
            sub: "To complete OJT",
            icon: Clock,
            iconBg: "bg-orange-50 dark:bg-orange-950",
            iconColor: "text-orange-500",
            trend: `~${Math.ceil(remainingHours / Math.max(1, averageHoursPerDay))} days left`,
            trendColor: "text-orange-500",
          },
          {
            title: "Average Hours / Day",
            value: `${averageHoursPerDay} hrs`,
            sub: `Across ${logs.length} working days`,
            icon: TrendingUp,
            iconBg: "bg-blue-50 dark:bg-blue-950",
            iconColor: "text-blue-500",
            trend: "Consistent pace",
            trendColor: "text-blue-500",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className={card.trendColor} style={{ fontSize: "11px", fontWeight: 500 }}>
                {card.trend}
              </span>
            </div>
            <p className="text-gray-800 dark:text-gray-100" style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>{card.value}</p>
            <p className="text-gray-800 dark:text-gray-200 mt-0.5" style={{ fontSize: "13px", fontWeight: 600 }}>{card.title}</p>
            <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "12px" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-800 dark:text-gray-100">Weekly Overview</h3>
              <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "13px" }}>Hours logged this week</p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
              <span style={{ fontSize: "12px", fontWeight: 600 }}>This Week</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: chartTickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: chartTickColor }} axisLine={false} tickLine={false} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  fontSize: "12px",
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                }}
                labelStyle={{ fontWeight: 600, color: tooltipText }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#hoursGradient)"
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: isDark ? "#1f2937" : "#fff" }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            <h3 className="text-gray-800 dark:text-gray-100">Today's Notes</h3>
          </div>
          {isClockedIn ? (
            <div className="flex-1 flex flex-col">
              <textarea
                value={todayNote}
                onChange={(e) => setTodayNote(e.target.value)}
                placeholder="Describe your tasks and activities for today..."
                className="flex-1 w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-3 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-300 dark:focus:border-blue-700 transition-all"
                style={{ fontSize: "13px", minHeight: "140px" }}
              />
              <p className="text-gray-400 dark:text-gray-600 mt-2" style={{ fontSize: "11px" }}>
                Notes will be saved when you click Time Out
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "13px", fontWeight: 500 }}>Clock in to add notes</p>
              <p className="text-gray-400 dark:text-gray-600 mt-1" style={{ fontSize: "12px" }}>
                Start a session first to track your daily activities
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-gray-800 dark:text-gray-100">Recent Daily Logs</h3>
            <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "13px" }}>Your latest time entries</p>
          </div>
          <button
            onClick={() => navigate("/logs")}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {recentLogs.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-600" style={{ fontSize: "14px" }}>
              No logs yet. Start by clocking in!
            </div>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-100" style={{ fontSize: "13px", fontWeight: 600 }}>{log.date}</p>
                    <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "12px" }}>
                      {log.timeIn} — {log.timeOut ?? "In progress"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  >
                    <Clock className="w-3 h-3" />
                    {log.totalHours ?? "—"} hrs
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
