import { Link, useLocation, useNavigate } from "react-router-dom";
import { Terminal, LayoutDashboard, Trophy, Code2, Calendar, BarChart3, Swords, Users, History, Flame, Timer } from "lucide-react";
import { useState } from "react";
import { clearAuthSession, getCurrentUser } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Home", icon: Terminal },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/problems", label: "Problems", icon: Code2 },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const moreItems = [
  { to: "/contest", label: "Contest", icon: Timer },
  { to: "/battle", label: "Battle", icon: Swords },
  { to: "/pair", label: "Pair Code", icon: Users },
  { to: "/submissions", label: "Submissions", icon: History },
  { to: "/heatmap", label: "Heatmap", icon: Flame },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isLoginPage = location.pathname.startsWith("/login");

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login/user");
  };

  const renderLink = ({ to, label, icon: Icon }: typeof navItems[0]) => {
    const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    return (
      <Link
        key={to}
        to={to}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {!isLoginPage ? (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center px-4 gap-1">
            <Link to="/" className="flex items-center gap-2 mr-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Terminal className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-mono text-sm font-bold text-foreground">GFG<span className="text-primary">::</span>Campus</span>
            </Link>
            <div className="flex items-center gap-1">
              {currentUser?.role !== "admin" && (
                <>
                  {navItems.map(renderLink)}
                  {/* More dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setMoreOpen(!moreOpen)}
                      className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      More ▾
                    </button>
                    {moreOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-md border border-border bg-card shadow-lg py-1">
                          {moreItems.map(({ to, label, icon: Icon }) => {
                            const active = location.pathname === to;
                            return (
                              <Link
                                key={to}
                                to={to}
                                onClick={() => setMoreOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {currentUser?.role === "admin" ? (
                <Link
                  to="/admin/users"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Admin
                </Link>
              ) : null}
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {currentUser?.name || "Guest"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      ) : null}
      <main>{children}</main>
    </div>
  );
}
