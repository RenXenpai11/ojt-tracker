import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = login(email, password);

    if (!result.ok) {
      setError(result.error || "Unable to login.");
      setLoading(false);
      return;
    }

    navigate("/setup", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Logo/Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-400/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card Container */}
        <div className="backdrop-blur-md bg-yellow-50/90 border border-amber-100/50 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Welcome back to your OJT training journey
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-5.5">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">
              Password
            </label>
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 animate-in fade-in duration-300">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base transition-all duration-300 active:scale-95 disabled:opacity-70 shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 hover:from-amber-400 hover:to-orange-500"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-yellow-50/90 text-slate-600">
                New here?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="w-full py-3.5 rounded-2xl border border-amber-300 text-slate-700 font-semibold text-base transition-all duration-300 hover:bg-amber-50/70 hover:border-orange-300 flex items-center justify-center"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </form>
    </div>
  );
}