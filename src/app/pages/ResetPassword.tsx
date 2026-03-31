import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase";

export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    if (!result.ok) {
      setError(result.error || "Unable to reset password.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setNotice("Password updated successfully. Redirecting to login...");
    setLoading(false);
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-400/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="backdrop-blur-md bg-yellow-50/90 border border-amber-100/50 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Reset Password</h1>
            <p className="text-slate-600 text-sm leading-relaxed">Set your new account password</p>
          </div>

          <div className="mb-5.5">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-orange-600 transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors duration-300" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-orange-600 transition-colors duration-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {notice && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 animate-in fade-in duration-300">
              <p className="text-emerald-700 text-sm font-medium">{notice}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 animate-in fade-in duration-300">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base transition-all duration-300 active:scale-95 disabled:opacity-70 shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 hover:from-amber-400 hover:to-orange-500"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
