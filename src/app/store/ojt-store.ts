// OJT Tracker shared store using React context + localStorage

export interface LogEntry {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  totalHours: number | null;
  notes: string;
}

export const TOTAL_REQUIRED_HOURS = 480;

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calcHours(timeIn: string, timeOut: string): number {
  const [inH, inM, inPeriod] = parseTime(timeIn);
  const [outH, outM, outPeriod] = parseTime(timeOut);
  const inMinutes = to24h(inH, inM, inPeriod);
  const outMinutes = to24h(outH, outM, outPeriod);
  return Math.max(0, Math.round(((outMinutes - inMinutes) / 60) * 10) / 10);
}

function parseTime(t: string): [number, number, string] {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [0, 0, "AM"];
  return [parseInt(match[1]), parseInt(match[2]), match[3].toUpperCase()];
}

function to24h(h: number, m: number, period: string): number {
  let hour = h;
  if (period === "PM" && h !== 12) hour += 12;
  if (period === "AM" && h === 12) hour = 0;
  return hour * 60 + m;
}

export const SAMPLE_LOGS: LogEntry[] = [
  {
    id: "1",
    date: "Mar 18, 2026",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    totalHours: 9,
    notes: "Worked on frontend components and attended team standup.",
  },
  {
    id: "2",
    date: "Mar 17, 2026",
    timeIn: "8:30 AM",
    timeOut: "5:30 PM",
    totalHours: 9,
    notes: "Fixed UI bugs and reviewed pull requests.",
  },
  {
    id: "3",
    date: "Mar 16, 2026",
    timeIn: "9:00 AM",
    timeOut: "5:00 PM",
    totalHours: 8,
    notes: "Attended orientation and set up development environment.",
  },
  {
    id: "4",
    date: "Mar 15, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:00 PM",
    totalHours: 8,
    notes: "Completed onboarding tasks and met with supervisor.",
  },
  {
    id: "5",
    date: "Mar 14, 2026",
    timeIn: "8:00 AM",
    timeOut: "3:00 PM",
    totalHours: 7,
    notes: "Worked on documentation and unit tests.",
  },
  {
    id: "6",
    date: "Mar 13, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:00 PM",
    totalHours: 8,
    notes: "Participated in sprint planning and started feature work.",
  },
  {
    id: "7",
    date: "Mar 12, 2026",
    timeIn: "8:30 AM",
    timeOut: "5:00 PM",
    totalHours: 8.5,
    notes: "Deployed staging build and wrote test cases.",
  },
  {
    id: "8",
    date: "Mar 11, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:30 PM",
    totalHours: 8.5,
    notes: "Code review session and knowledge sharing.",
  },
  {
    id: "9",
    date: "Mar 10, 2026",
    timeIn: "9:00 AM",
    timeOut: "5:00 PM",
    totalHours: 8,
    notes: "Database schema updates and API integration.",
  },
  {
    id: "10",
    date: "Mar 9, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:30 PM",
    totalHours: 8.5,
    notes: "Completed module assignment and demo for supervisor.",
  },
  {
    id: "11",
    date: "Mar 8, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:00 PM",
    totalHours: 8,
    notes: "Weekly report submission and mentor meeting.",
  },
  {
    id: "12",
    date: "Mar 7, 2026",
    timeIn: "8:30 AM",
    timeOut: "4:30 PM",
    totalHours: 8,
    notes: "Research on best practices and code optimization.",
  },
  {
    id: "13",
    date: "Mar 6, 2026",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    totalHours: 9,
    notes: "Joined client call and prepared presentation slides.",
  },
  {
    id: "14",
    date: "Mar 5, 2026",
    timeIn: "8:00 AM",
    timeOut: "4:30 PM",
    totalHours: 8.5,
    notes: "Implemented new feature per requirements.",
  },
  {
    id: "15",
    date: "Mar 4, 2026",
    timeIn: "8:30 AM",
    timeOut: "4:30 PM",
    totalHours: 8,
    notes: "Resolved merge conflicts and updated changelog.",
  },
];
