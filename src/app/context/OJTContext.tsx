import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LogEntry } from "../store/ojt-store";
import { calcHours, formatTime, formatDate, TOTAL_REQUIRED_HOURS } from "../store/ojt-store";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";

type OJTLogRow = {
  id: string;
  user_id: string;
  log_date: string;
  time_in: string;
  time_out: string | null;
  rendered_hours: number | null;
  note: string | null;
  status: string | null;
};

function formatDateDisplay(dateValue: string): string {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeDateForDb(dateValue: string): string {
  if (!dateValue) return new Date().toISOString().slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function mapRowToLogEntry(row: OJTLogRow): LogEntry {
  return {
    id: row.id,
    date: formatDateDisplay(row.log_date),
    timeIn: row.time_in,
    timeOut: row.time_out,
    totalHours: row.rendered_hours,
    notes: row.note ?? "",
  };
}

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
  const activeSessionKey = user ? `ojt_active_session_${user.id}` : "ojt_active_session";

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockInDate, setClockInDate] = useState<string | null>(null);
  const [todayNote, setTodayNote] = useState("");

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setIsClockedIn(false);
      setClockInTime(null);
      setClockInDate(null);
      setTodayNote("");
      return;
    }

    void (async () => {
      const { data, error } = await supabase
        .from("ojt_logs")
        .select("id,user_id,log_date,time_in,time_out,rendered_hours,note,status")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false })
        .order("time_in", { ascending: false });

      if (error || !data) {
        setLogs([]);
        return;
      }

      const mappedLogs = (data as OJTLogRow[]).map(mapRowToLogEntry);
      setLogs(mappedLogs);
    })();

    try {
      const savedSession = localStorage.getItem(activeSessionKey);
      if (!savedSession) {
        setIsClockedIn(false);
        setClockInTime(null);
        setClockInDate(null);
        setTodayNote("");
        return;
      }

      const parsed = JSON.parse(savedSession) as {
        clockInTime: string | null;
        clockInDate: string | null;
        todayNote: string;
      };

      if (parsed.clockInTime && parsed.clockInDate) {
        setIsClockedIn(true);
        setClockInTime(parsed.clockInTime);
        setClockInDate(parsed.clockInDate);
        setTodayNote(parsed.todayNote ?? "");
      }
    } catch {
      setIsClockedIn(false);
      setClockInTime(null);
      setClockInDate(null);
      setTodayNote("");
    }
  }, [user, storageKey, activeSessionKey]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(storageKey, JSON.stringify(logs));
  }, [user, logs, storageKey]);

  useEffect(() => {
    if (!user) return;
    if (!isClockedIn || !clockInTime || !clockInDate) {
      localStorage.removeItem(activeSessionKey);
      return;
    }

    localStorage.setItem(
      activeSessionKey,
      JSON.stringify({
        clockInTime,
        clockInDate,
        todayNote,
      })
    );
  }, [user, isClockedIn, clockInTime, clockInDate, todayNote, activeSessionKey]);

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

    const logDate = normalizeDateForDb(clockInDate);
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      date: formatDateDisplay(logDate),
      timeIn: clockInTime,
      timeOut,
      totalHours: hours,
      notes: todayNote,
    };

    if (user) {
      void (async () => {
        const { data, error } = await supabase
          .from("ojt_logs")
          .insert({
            user_id: user.id,
            log_date: logDate,
            time_in: clockInTime,
            time_out: timeOut,
            rendered_hours: hours,
            note: todayNote || "",
            status: "completed",
          })
          .select("id,user_id,log_date,time_in,time_out,rendered_hours,note,status")
          .single();

        if (error || !data) {
          return;
        }

        setLogs((prev) => [mapRowToLogEntry(data as OJTLogRow), ...prev]);
      })();
    } else {
      setLogs((prev) => [newLog, ...prev]);
    }

    setIsClockedIn(false);
    setClockInTime(null);
    setClockInDate(null);
    setTodayNote("");
  }

  function addLog(log: LogEntry) {
    if (!user) {
      setLogs((prev) => [log, ...prev]);
      return;
    }

    void (async () => {
      const { data, error } = await supabase
        .from("ojt_logs")
        .insert({
          user_id: user.id,
          log_date: normalizeDateForDb(log.date),
          time_in: log.timeIn,
          time_out: log.timeOut,
          rendered_hours: log.totalHours,
          note: log.notes || "",
          status: "completed",
        })
        .select("id,user_id,log_date,time_in,time_out,rendered_hours,note,status")
        .single();

      if (error || !data) {
        return;
      }

      setLogs((prev) => [mapRowToLogEntry(data as OJTLogRow), ...prev]);
    })();
  }

  function deleteLog(id: string) {
    if (!user) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
      return;
    }

    void (async () => {
      const { error } = await supabase
        .from("ojt_logs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) return;
      setLogs((prev) => prev.filter((l) => l.id !== id));
    })();
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
