import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error || "Unable to login.");
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Login to continue your OJT tracking.</p>

        <div className="mt-6 space-y-4">
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
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          Login
        </button>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
          No account yet?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
