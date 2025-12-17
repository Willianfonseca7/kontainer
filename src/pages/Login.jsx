import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../lib/authService";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Wandelt Strapi-Fehler in klare Meldungen um.
  const extractMessage = (err) => {
    const apiMsg = err?.response?.data?.error?.message;
    if (apiMsg) return apiMsg;
    if (err?.message === "Network Error") return "Network error. Try again.";
    return err?.message || "Unknown error.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await authService.login({ identifier: email, password });
      } else {
        await authService.register({ username: username || email, email, password });
      }
      navigate("/dashboard");
    } catch (err) {
      const msg = extractMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strapiFacebookUrl = "http://localhost:1337/api/connect/facebook";

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Access your account</h1>
        <p className="text-muted-foreground">
          Sign in or create an account to continue to your dashboard.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition ${
            mode === "register"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {mode === "register" && (
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Username</span>
            <input
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="your-name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={mode === "register"}
            />
          </label>
        )}

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Password</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <div className="text-center text-sm text-muted-foreground">or</div>

        <a
          href={strapiFacebookUrl}
          className="inline-flex w-full items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Sign in with Facebook
        </a>
      </form>
    </div>
  );
}
