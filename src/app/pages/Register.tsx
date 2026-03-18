import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = register(name, email, password, school);
    if (!result.ok) {
      setError(result.error || "Unable to create account.");
      return;
    }

    navigate("/setup", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-7"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set up your OJT student account.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              placeholder="e.g. University of Mindanao"
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition"
        >
          Create Account
        </button>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
