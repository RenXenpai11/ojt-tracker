import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  school: string;
  course?: string;
};

type StoredUser = User & {
  password: string;
};

type OJTProfile = {
  requiredHours: number;
  startDate: string;
  targetEndDate: string;
  company: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  course?: string;
  department?: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

interface AuthContextType {
  user: User | null;
  profile: OJTProfile | null;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string, school: string, course: string) => AuthResult;
  logout: () => void;
  saveProfile: (profile: OJTProfile) => void;
}

const USERS_KEY = "ojt_mock_users";
const CURRENT_USER_KEY = "ojt_current_user";
const profileKey = (userId: string) => `ojt_profile_${userId}`;
const logsKey = (userId: string) => `ojt_logs_${userId}`;

const AuthContext = createContext<AuthContextType | null>(null);

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    safeParse<User | null>(localStorage.getItem(CURRENT_USER_KEY), null)
  );

  const [profile, setProfileState] = useState<OJTProfile | null>(() => {
    const current = safeParse<User | null>(localStorage.getItem(CURRENT_USER_KEY), null);
    if (!current) return null;
    return safeParse<OJTProfile | null>(localStorage.getItem(profileKey(current.id)), null);
  });

  const persistedProfile = user
    ? safeParse<OJTProfile | null>(localStorage.getItem(profileKey(user.id)), null)
    : null;
  const effectiveProfile = profile ?? persistedProfile;
  const isSetupComplete = !!effectiveProfile && effectiveProfile.requiredHours > 0;

  function login(email: string, password: string): AuthResult {
    const users = safeParse<StoredUser[]>(localStorage.getItem(USERS_KEY), []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, error: "Invalid email or password." };
    }

    const nextUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      school: found.school || "Not set",
      course: found.course || "",
    };
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    setProfileState(safeParse<OJTProfile | null>(localStorage.getItem(profileKey(nextUser.id)), null));
    return { ok: true };
  }

  function register(name: string, email: string, password: string, school: string, course: string): AuthResult {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSchool = school.trim();
    const trimmedCourse = course.trim();

    if (!trimmedName || !trimmedEmail || !password || !trimmedSchool || !trimmedCourse) {
      return { ok: false, error: "Please complete all required fields." };
    }

    const users = safeParse<StoredUser[]>(localStorage.getItem(USERS_KEY), []);
    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { ok: false, error: "Email is already registered." };
    }

    const stored: StoredUser = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      school: trimmedSchool,
      course: trimmedCourse,
      password,
    };

    users.push(stored);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const nextUser: User = {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      school: stored.school,
      course: stored.course,
    };
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(logsKey(nextUser.id), JSON.stringify([]));
    const initialProfile: OJTProfile = {
      requiredHours: 0,
      startDate: "",
      targetEndDate: "",
      company: "",
      phone: "",
      location: "",
      course: trimmedCourse,
      department: "",
    };
    localStorage.setItem(profileKey(nextUser.id), JSON.stringify(initialProfile));
    setProfileState(initialProfile);
    return { ok: true };
  }

  function logout() {
    setUser(null);
    setProfileState(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function saveProfile(next: OJTProfile) {
    if (!user) return;
    localStorage.setItem(profileKey(user.id), JSON.stringify(next));
    setProfileState(next);
  }

  const value: AuthContextType = {
    user,
    profile: effectiveProfile,
    isAuthenticated: !!user,
    isSetupComplete,
    login,
    register,
    logout,
    saveProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
