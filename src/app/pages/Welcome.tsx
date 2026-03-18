import { ArrowRight, GraduationCap, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 md:p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <GraduationCap className="w-4 h-4" />
            OJT Student Portal
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold leading-tight">
            Track your OJT hours with confidence
          </h1>
          <p className="mt-3 text-blue-100 text-sm md:text-base">
            Keep daily logs, monitor progress, and stay on target with your required training hours.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3">
              <Clock3 className="w-5 h-5 mt-0.5 text-blue-100" />
              <p className="text-blue-100 text-sm">Quick Time In/Time Out with daily notes</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-blue-100" />
              <p className="text-blue-100 text-sm">Personal account and progress history</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold">Get Started</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Sign in to your account or create a new one.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
