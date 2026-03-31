import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SearchableSelect } from "../components/SearchableSelect";
import { SCHOOLS } from "../data/schools";
import { COURSES } from "../data/courses";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
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
    const result = await register(name, email, password, school, course);

    if (result.ok && result.needsEmailVerification) {
      setNotice("Account created. Please check your email and verify your account, then sign in.");
      setLoading(false);
      return;
    }
    
    if (!result.ok) {
      setError(result.error || "Unable to create account.");
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
              Create Account
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Start your OJT tracking journey today
            </p>
          </div>

          {/* Full Name Field */}
          <div className="mb-5.5">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors duration-300" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
              />
            </div>
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
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-amber-200/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* School Field with Searchable Dropdown */}
          <div className="mb-5.5">
            <SearchableSelect
              options={SCHOOLS}
              value={school}
              onChange={setSchool}
              placeholder="Search schools..."
              label="School"
            />
          </div>

          {/* Course Field with Searchable Dropdown */}
          <div className="mb-5.5">
            <SearchableSelect
              options={COURSES}
              value={course}
              onChange={setCourse}
              placeholder="Search courses..."
              label="Course"
            />
          </div>

          {/* Password Field */}
          <div className="mb-5.5">
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

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="text-slate-700 text-sm font-semibold mb-2.5 block">
              Confirm Password
            </label>
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
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Success Notice */}
          {notice && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 animate-in fade-in duration-300">
              <p className="text-emerald-700 text-sm font-medium">{notice}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 animate-in fade-in duration-300">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base transition-all duration-300 active:scale-95 disabled:opacity-70 shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 hover:from-amber-400 hover:to-orange-500"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-yellow-50/90 text-slate-600">
                Already registered?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full py-3.5 rounded-2xl border border-amber-300 text-slate-700 font-semibold text-base transition-all duration-300 hover:bg-amber-50/70 hover:border-orange-300 flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </form>
    </div>
  );
}
