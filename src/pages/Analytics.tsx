import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { problems } from "@/data/problems";
import { submissions } from "@/data/submissions";

export default function Analytics() {
  // Weekly solved (last 12 weeks)
  const weeklySolved = useMemo(() => {
    const weeks: { week: string; count: number }[] = [];
    for (let w = 11; w >= 0; w--) {
      const end = new Date(2026, 2, 14);
      end.setDate(end.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      const count = submissions.filter(s =>
        s.status === "Accepted" && new Date(s.time) >= start && new Date(s.time) < end
      ).length;
      weeks.push({ week: `W${12 - w}`, count });
    }
    return weeks;
  }, []);

  // Difficulty distribution
  const diffDist = useMemo(() => [
    { name: "Easy", value: problems.filter(p => p.difficulty === "Easy").length },
    { name: "Medium", value: problems.filter(p => p.difficulty === "Medium").length },
    { name: "Hard", value: problems.filter(p => p.difficulty === "Hard").length },
  ], []);

  const COLORS = ["hsl(142, 70%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

  // Activity heatmap (last 180 days)
  const heatmapData = useMemo(() => {
    return Array.from({ length: 180 }, (_, i) => {
      const d = new Date(2026, 2, 14);
      d.setDate(d.getDate() - (179 - i));
      const count = submissions.filter(s => new Date(s.time).toDateString() === d.toDateString()).length;
      return { date: d, count };
    });
  }, []);

  const maxActivity = Math.max(...heatmapData.map(d => d.count), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">// Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Weekly Solved */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Weekly Accepted Submissions</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklySolved}>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(220, 10%, 65%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 65%)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 15%, 8%)", border: "1px solid hsl(220, 15%, 15%)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                />
                <Bar dataKey="count" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Difficulty Distribution */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Difficulty Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={diffDist} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0}>
                    {diffDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 15%, 8%)", border: "1px solid hsl(220, 15%, 15%)", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {diffDist.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Activity Heatmap (180 Days)</h3>
          <div className="flex flex-wrap gap-[3px]">
            {heatmapData.map((d, i) => (
              <div
                key={i}
                title={`${d.date.toLocaleDateString()}: ${d.count} submissions`}
                className="h-3 w-3 rounded-sm transition-colors"
                style={{
                  backgroundColor: d.count === 0
                    ? "hsl(220, 15%, 12%)"
                    : `hsla(142, 70%, 45%, ${0.2 + (d.count / maxActivity) * 0.8})`,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0.2, 0.4, 0.6, 0.8, 1].map(o => (
              <div key={o} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `hsla(142, 70%, 45%, ${o})` }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
