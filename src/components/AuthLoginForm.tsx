import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { setAuthSession } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface AuthLoginFormProps {
  title: string;
  role: UserRole;
}

export default function AuthLoginForm({ title, role }: AuthLoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(email, password);
      if (response.user.role !== role) {
        setError(`This is a ${role} login. Please use valid ${role} credentials.`);
        return;
      }

      setAuthSession(response.token, response.user);

      const state = location.state as { from?: string } | null;
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate(state?.from || "/dashboard");
      }
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl items-center px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Sign in with your login ID and password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Login ID</span>
            <div className="flex items-center rounded-md border border-border bg-background px-3">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 w-full bg-transparent text-sm outline-none"
                placeholder={role === "admin" ? "admin@123" : "user@123"}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Password</span>
            <div className="flex items-center rounded-md border border-border bg-background px-3">
              <LockKeyhole className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 w-full bg-transparent text-sm outline-none"
                placeholder="Enter password"
              />
            </div>
          </label>

          {error ? <p className="text-sm text-hard">{error}</p> : null}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          {role === "admin" ? (
            <p>
              Not admin? <Link to="/login/user" className="text-primary hover:underline">User login</Link>
            </p>
          ) : (
            <p>
              Admin? <Link to="/login/admin" className="text-primary hover:underline">Admin login</Link>
            </p>
          )}
        </div>

        {role === "admin" ? (
          <div className="mt-4 rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground">Default Admin</p>
            <p>Login ID: admin@123</p>
            <p>Password: admin123</p>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground">Default User</p>
            <p>Login ID: user@123</p>
            <p>Password: user123</p>
          </div>
        )}
      </div>
    </div>
  );
}
