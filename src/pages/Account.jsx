import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      // Strapi Users-Permissions akzeptiert standardmäßig username/email. Phone wird nur gespeichert, falls das Backend das Feld kennt.
      const payload = { username, email };
      if (phone) payload.phone = phone;
      await updateProfile(payload);
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Unbekannter Fehler";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">My Account</h1>
        <p className="text-muted-foreground">View and edit your profile details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Profile updated.
          </div>
        ) : null}

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Username</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Phone</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+49 ..."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
