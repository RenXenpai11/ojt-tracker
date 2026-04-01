import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../lib/supabase";

type User = {
  id: string;
  name: string;
  email: string;
  school: string;
  course?: string;
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
};

type AuthResult = {
  ok: boolean;
  error?: string;
  needsEmailVerification?: boolean;
};

interface AuthContextType {
  user: User | null;
  profile: OJTProfile | null;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, school: string, course: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  logout: () => void;
  saveProfile: (profile: OJTProfile) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  school: string;
  course: string;
  company: string | null;
  phone: string | null;
  location: string | null;
  required_hours: number | null;
  start_date: string | null;
  target_end_date: string | null;
  avatar_url: string | null;
};

function mapProfileRowToState(row: ProfileRow): OJTProfile {
  return {
    requiredHours: row.required_hours ?? 0,
    startDate: row.start_date ?? "",
    targetEndDate: row.target_end_date ?? "",
    company: row.company ?? "",
    avatarUrl: row.avatar_url ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    course: row.course ?? "",
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as ProfileRow;
}

async function ensureProfileFromMetadata(
  authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }
): Promise<ProfileRow | null> {
  const existing = await fetchProfile(authUser.id);
  if (existing) return existing;

  const metadata = authUser.user_metadata ?? {};
  const fullName = (metadata.full_name as string | undefined)?.trim() || "Student";
  const school = (metadata.school as string | undefined)?.trim() || "Not set";
  const course = (metadata.course as string | undefined)?.trim() || "Not set";
  const email = (authUser.email ?? "").trim().toLowerCase();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: authUser.id,
      full_name: fullName,
      email,
      school,
      course,
      company: "",
      phone: "",
      location: "",
      required_hours: 0,
      start_date: null,
      target_end_date: null,
      avatar_url: null,
    },
    { onConflict: "id" }
  );

  if (error) return null;
  return fetchProfile(authUser.id);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<OJTProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user || !mounted) return;

      const row = await fetchProfile(session.user.id);
      if (!row || !mounted) return;

      setUser({
        id: row.id,
        name: row.full_name,
        email: row.email,
        school: row.school,
        course: row.course,
      });
      setProfileState(mapProfileRowToState(row));
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setProfileState(null);
        return;
      }

      void (async () => {
        const row = await fetchProfile(session.user.id);
        if (!row || !mounted) return;
        setUser({
          id: row.id,
          name: row.full_name,
          email: row.email,
          school: row.school,
          course: row.course,
        });
        setProfileState(mapProfileRowToState(row));
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isSetupComplete = !!profile && profile.requiredHours > 0;

  async function login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return { ok: false, error: error?.message || "Invalid email or password." };
    }

    const row = await ensureProfileFromMetadata(data.user);
    if (!row) {
      await supabase.auth.signOut();
      return { ok: false, error: "Profile not found for this account." };
    }

    setUser({
      id: row.id,
      name: row.full_name,
      email: row.email,
      school: row.school,
      course: row.course,
    });
    setProfileState(mapProfileRowToState(row));
    return { ok: true };
  }

  async function register(
    name: string,
    email: string,
    password: string,
    school: string,
    course: string
  ): Promise<AuthResult> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSchool = school.trim();
    const trimmedCourse = course.trim();

    if (!trimmedName || !trimmedEmail || !password || !trimmedSchool || !trimmedCourse) {
      return { ok: false, error: "Please complete all required fields." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          school: trimmedSchool,
          course: trimmedCourse,
        },
      },
    });

    if (error || !data.user) {
      return { ok: false, error: error?.message || "Unable to create account." };
    }

    if (!data.session) {
      return {
        ok: true,
        needsEmailVerification: true,
      };
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: trimmedName,
        email: trimmedEmail,
        school: trimmedSchool,
        course: trimmedCourse,
        company: "",
        phone: "",
        location: "",
        required_hours: 0,
        start_date: null,
        target_end_date: null,
        avatar_url: null,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { ok: false, error: "Account created, but profile initialization failed." };
    }

    const row = await fetchProfile(data.user.id);
    if (!row) {
      return { ok: false, error: "Account created, but profile was not found." };
    }

    setUser({
      id: row.id,
      name: row.full_name,
      email: row.email,
      school: row.school,
      course: row.course,
    });
    setProfileState(mapProfileRowToState(row));
    return { ok: true };
  }

  async function requestPasswordReset(email: string): Promise<AuthResult> {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { ok: false, error: "Please enter your email." };
    }

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, { redirectTo });

    if (error) {
      return { ok: false, error: error.message || "Unable to send reset email." };
    }

    return { ok: true };
  }

  async function updatePassword(newPassword: string): Promise<AuthResult> {
    if (!newPassword.trim()) {
      return { ok: false, error: "Please enter a new password." };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { ok: false, error: error.message || "Unable to update password." };
    }

    return { ok: true };
  }

  function logout() {
    void supabase.auth.signOut();
    setUser(null);
    setProfileState(null);
  }

  async function saveProfile(next: OJTProfile): Promise<AuthResult> {
    if (!user) {
      return { ok: false, error: "You must be logged in to save your profile." };
    }

    const { data, error } = await supabase.from("profiles").update({
      full_name: user.name,
      email: user.email,
      school: user.school,
      course: next.course ?? user.course ?? "",
      company: next.company ?? "",
      phone: next.phone ?? "",
      location: next.location ?? "",
      required_hours: Math.max(0, next.requiredHours),
      start_date: next.startDate || null,
      target_end_date: next.targetEndDate || null,
      avatar_url: next.avatarUrl || null,
    }).eq("id", user.id).select("*").single();

    if (error || !data) {
      return { ok: false, error: error?.message || "Failed to save profile." };
    }

    const row = data as ProfileRow;
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: row.full_name,
        email: row.email,
        school: row.school,
        course: row.course,
      };
    });
    setProfileState(mapProfileRowToState(row));
    return { ok: true };
  }

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isSetupComplete,
    login,
    register,
    requestPasswordReset,
    updatePassword,
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
