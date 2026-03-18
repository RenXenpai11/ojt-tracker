import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LogEntry } from "../store/ojt-store";
import { calcHours, formatTime, formatDate, TOTAL_REQUIRED_HOURS } from "../store/ojt-store";
import { useAuth } from "./AuthContext";

interface OJTContextType {
  logs: LogEntry[];
  requiredHours: number;
  isClockedIn: boolean;
  clockInTime: string | null;
  todayNote: string;
  setTodayNote: (note: string) => void;
  handleTimeIn: () => void;
  handleTimeOut: () => void;
  totalHoursCompleted: number;
  remainingHours: number;
  averageHoursPerDay: number;
  progressPercent: number;
  addLog: (log: LogEntry) => void;
  deleteLog: (id: string) => void;
}

const OJTContext = createContext<OJTContextType | null>(null);

export function OJTProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const requiredHours = profile?.requiredHours ?? TOTAL_REQUIRED_HOURS;
  const storageKey = user ? `ojt_logs_${user.id}` : "ojt_logs";

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockInDate, setClockInDate] = useState<string | null>(null);
  const [todayNote, setTodayNote] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(logs));
  }, [logs, storageKey]);

  const totalHoursCompleted = logs.reduce((sum, log) => sum + (log.totalHours ?? 0), 0);
  const remainingHours = Math.max(0, requiredHours - totalHoursCompleted);
  const averageHoursPerDay = logs.length > 0 ? Math.round((totalHoursCompleted / logs.length) * 10) / 10 : 0;
  const progressPercent = requiredHours > 0
    ? Math.min(100, Math.round((totalHoursCompleted / requiredHours) * 100))
    : 0;

  function handleTimeIn() {
    if (isClockedIn) return;
    const now = new Date();
    setClockInTime(formatTime(now));
    setClockInDate(formatDate(now));
    setIsClockedIn(true);
  }

  function handleTimeOut() {
    if (!isClockedIn || !clockInTime || !clockInDate) return;
    const now = new Date();
    const timeOut = formatTime(now);
    const hours = calcHours(clockInTime, timeOut);
    const newLog: LogEntry = {
      id: Date.now().toString(),
      date: clockInDate,
      timeIn: clockInTime,
      timeOut,
      totalHours: hours,
      notes: todayNote,
    };
    setLogs((prev) => [newLog, ...prev]);
    setIsClockedIn(false);
    setClockInTime(null);
    setClockInDate(null);
    setTodayNote("");
  }

  function addLog(log: LogEntry) {
    setLogs((prev) => [log, ...prev]);
  }

  function deleteLog(id: string) {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <OJTContext.Provider
      value={{
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
        addLog,
        deleteLog,
      }}
    >
      {children}
    </OJTContext.Provider>
  );
}

export function useOJT() {
  const ctx = useContext(OJTContext);
  if (!ctx) throw new Error("useOJT must be used within OJTProvider");
  return ctx;
}
