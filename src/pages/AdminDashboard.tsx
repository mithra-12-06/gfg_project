import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import type { AdminStatsResponse, ManagedUser, UserRole } from "@/types/auth";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "user" as UserRole,
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("admin_dark_mode");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("admin_dark_mode", String(isDark));
  }, [isDark]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getUsers({
        search,
        role: roleFilter,
        page,
        limit: 10,
        sort,
      });
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Failed to load users";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.getAdminStats();
      setStats(response);
    } catch {
      toast.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, page, sort]);

  useEffect(() => {
    void loadStats();
  }, []);

  const submitLabel = useMemo(() => (editingId ? "Update User" : "Add User"), [editingId]);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const selectedUser = users.find((user) => (user._id || user.id) === editingId);
        const roleChanged = selectedUser && selectedUser.role !== form.role;
        if (roleChanged) {
          const confirmRole = window.confirm(
            `Are you sure you want to change role from ${selectedUser.role} to ${form.role}?`
          );
          if (!confirmRole) return;
        }

        await api.updateUser(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success("User updated successfully");
      } else {
        await api.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        toast.success("User added successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Operation failed");
    }
  };

  const handleEdit = (user: ManagedUser) => {
    setEditingId((user._id || user.id) as string);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm("Delete this user?");
    if (!shouldDelete) return;

    try {
      await api.deleteUser(id);
      toast.success("User deleted successfully");
      await Promise.all([loadUsers(), loadStats()]);
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Delete failed");
    }
  };

  const handleResetPassword = async (id: string) => {
    const password = window.prompt("Enter new password (min 6 chars)", "password123");
    if (!password) return;

    try {
      await api.resetUserPassword(id, password);
      toast.success("Password reset successfully");
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Password reset failed");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportUsersCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users-export.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Users exported");
    } catch {
      toast.error("Failed to export users");
    }
  };

  const cardItems = [
    { label: "Total Users", value: stats?.cards.totalUsers ?? 0 },
    { label: "Active Users (30d)", value: stats?.cards.activeUsers ?? 0 },
    { label: "Admin Count", value: stats?.cards.adminCount ?? 0 },
  ];

  const pieColors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : "Never");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          // Admin Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => void handleExport()}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-primary"
          >
            Export Users
          </button>
          <Link
            to="/admin/logs"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:border-primary"
          >
            View Logs
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {cardItems.map((card) => (
          <div key={card.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            User Registrations Over Time
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.registrationsTrend ?? []}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Role Distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.roleDistribution ?? []} dataKey="count" nameKey="role" outerRadius={90} label>
                  {(stats?.roleDistribution ?? []).map((entry, index) => (
                    <Cell key={`${entry.role}-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-4">
        <input
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Search by name or email"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none sm:col-span-2"
        />
        <select
          value={roleFilter}
          onChange={(event) => {
            setPage(1);
            setRoleFilter(event.target.value as "all" | "user" | "admin");
          }}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="recent">Recent Activity</option>
          <option value="oldest">Oldest Created</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
        </select>
        <input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Name"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
        />
        <input
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
          type="text"
        />
        <input
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder={editingId ? "Password (optional)" : "Password"}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
          type="password"
          required={!editingId}
        />
        <select
          value={form.role}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => void handleSubmit()}
          className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:col-span-4"
        >
          {submitLabel}
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-12 border-b border-border px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="col-span-2">Name</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-1">Role</span>
          <span className="col-span-2">Created</span>
          <span className="col-span-2">Last Login</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {loading ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No users found.</p>
        ) : (
          users.map((user) => {
            const userId = (user._id || user.id) as string;
            return (
              <div
                key={userId}
                className="grid grid-cols-12 items-center border-b border-border px-4 py-3 text-sm last:border-b-0"
              >
                <span className="col-span-2 text-foreground">{user.name}</span>
                <span className="col-span-3 text-muted-foreground">{user.email}</span>
                <span className="col-span-1 text-foreground">{user.role}</span>
                <span className="col-span-2 text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
                <span className="col-span-2 text-xs text-muted-foreground">{formatDate(user.lastLogin)}</span>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="rounded border border-border px-3 py-1 text-xs text-foreground hover:border-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void handleResetPassword(userId)}
                    className="rounded border border-border px-3 py-1 text-xs text-foreground hover:border-primary"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleDelete(userId)}
                    className="rounded border border-hard/40 px-3 py-1 text-xs text-hard hover:bg-hard/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="rounded border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="rounded border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
