import { motion } from "framer-motion";
import { users } from "@/data/users";
import { submissions } from "@/data/submissions";

export default function Dashboard() {
  const user = users[0]; // Simulated logged-in user
  const userSubmissions = submissions.filter(s => s.userId === user.id);
  const accepted = userSubmissions.filter(s => s.status === "Accepted").length;
  const totalSubs = userSubmissions.length;

  const stats = [
    { label: "Problems Solved", value: user.problemsSolved },
    { label: "Streak", value: `${user.streak} days`, highlight: true },
    { label: "Campus Rank", value: `#${user.rank}` },
    { label: "Acceptance Rate", value: totalSubs ? `${Math.round((accepted / totalSubs) * 100)}%` : "N/A" },
  ];

  // Activity for last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 2, 14);
    d.setDate(d.getDate() - (6 - i));
    const count = submissions.filter(s => s.userId === user.id && new Date(s.time).toDateString() === d.toDateString()).length;
    return { day: d.toLocaleDateString("en", { weekday: "short" }), count };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">// Dashboard</h1>

        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-card p-6 flex items-center gap-6 mb-8">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-lg border-2 border-primary"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.department} • {user.year}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-mono text-xl font-bold mt-1 ${s.highlight ? "text-primary" : "text-foreground"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Weekly Activity */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-3 h-32">
            {last7.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-primary transition-all"
                  style={{ height: `${Math.max(d.count * 25, 4)}px`, opacity: d.count ? 1 : 0.2 }}
                />
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mt-8 rounded-lg border border-border bg-card">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider p-4 border-b border-border">
            Recent Submissions
          </h3>
          <div className="divide-y divide-border">
            {userSubmissions.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-foreground font-mono">Problem #{s.problemId}</span>
                <span className="text-xs text-muted-foreground">{s.language}</span>
                <span className={`text-xs font-medium ${
                  s.status === "Accepted" ? "text-easy" : s.status === "Wrong Answer" ? "text-hard" : "text-medium"
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
