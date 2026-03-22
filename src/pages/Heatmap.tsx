import { useMemo } from "react";
import { motion } from "framer-motion";
import { submissions } from "@/data/submissions";
import { Flame, Calendar, TrendingUp } from "lucide-react";

export default function Heatmap() {
  const { grid, totalSubmissions, currentStreak, longestStreak } = useMemo(() => {
    const userSubs = submissions.filter(s => s.userId === 1);
    const countByDate: Record<string, number> = {};
    userSubs.forEach(s => {
      const d = new Date(s.time).toISOString().split("T")[0];
      countByDate[d] = (countByDate[d] || 0) + 1;
    });

    const today = new Date(2026, 2, 14);
    const days = 365;
    const grid: { date: string; count: number; level: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const count = countByDate[key] || 0;
      const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
      grid.push({ date: key, count, level });
    }

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    for (let i = grid.length - 1; i >= 0; i--) {
      if (grid[i].count > 0) {
        tempStreak++;
        if (i === grid.length - 1 || (i < grid.length - 1 && grid[i + 1].count > 0)) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        if (i === grid.length - 1) currentStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { grid, totalSubmissions: userSubs.length, currentStreak, longestStreak };
  }, []);

  const weeks: typeof grid[] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  const levelColors = [
    "bg-secondary",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary",
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Coding Activity</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: "Total Submissions", value: totalSubmissions },
            { icon: Flame, label: "Current Streak", value: `${currentStreak} days` },
            { icon: Flame, label: "Longest Streak", value: `${longestStreak} days` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">{grid.filter(d => d.count > 0).length} active days in the last year</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-[11px] h-[11px] rounded-sm ${levelColors[day.level]} transition-colors`}
                      title={`${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              {levelColors.map((c, i) => (
                <div key={i} className={`w-[11px] h-[11px] rounded-sm ${c}`} />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* Monthly labels */}
          <div className="flex mt-2 text-xs text-muted-foreground">
            {months.map(m => (
              <span key={m} className="flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
