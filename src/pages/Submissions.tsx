import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { submissions } from "@/data/submissions";
import { problems } from "@/data/problems";
import { History, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const statusConfig = {
  "Accepted": { icon: CheckCircle2, className: "text-easy" },
  "Wrong Answer": { icon: XCircle, className: "text-destructive" },
  "Time Limit Exceeded": { icon: Clock, className: "text-warning" },
  "Compilation Error": { icon: AlertTriangle, className: "text-muted-foreground" },
};

export default function Submissions() {
  const [filter, setFilter] = useState<string>("all");

  const userSubmissions = useMemo(() => {
    const subs = submissions
      .filter(s => s.userId === 1)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .map(s => ({
        ...s,
        problemTitle: problems.find(p => p.id === s.problemId)?.title || `Problem #${s.problemId}`,
        executionTime: `${(Math.random() * 0.5 + 0.01).toFixed(2)}s`,
      }));
    if (filter === "all") return subs;
    return subs.filter(s => s.status === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Submission History</h1>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-secondary text-foreground text-xs rounded px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Time Limit Exceeded">TLE</option>
          </select>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Problem</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Language</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {userSubmissions.map((s, i) => {
                const cfg = statusConfig[s.status as keyof typeof statusConfig] || statusConfig["Compilation Error"];
                const Icon = cfg.icon;
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 text-foreground">{s.problemTitle}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.language}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.className}`}>
                        <Icon className="h-3 w-3" /> {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.executionTime}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(s.time).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {userSubmissions.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
