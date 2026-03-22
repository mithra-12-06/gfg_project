import { useState } from "react";
import { motion } from "framer-motion";
import { leaderboard } from "@/data/leaderboard";
import { ArrowUpDown } from "lucide-react";

type SortKey = "rank" | "problemsSolved" | "streak";

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);

  const sorted = [...leaderboard].sort((a, b) => {
    const mul = asc ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * mul;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setAsc(!asc);
    else { setSortBy(key); setAsc(true); }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
      {label} <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">// Leaderboard</h1>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border bg-secondary">
            <div className="col-span-1"><SortHeader label="#" field="rank" /></div>
            <div className="col-span-5 text-xs text-muted-foreground uppercase tracking-wider">Student</div>
            <div className="col-span-2"><SortHeader label="Solved" field="problemsSolved" /></div>
            <div className="col-span-2"><SortHeader label="Streak" field="streak" /></div>
            <div className="col-span-2 text-xs text-muted-foreground uppercase tracking-wider">Dept</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {sorted.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-surface-raised transition-colors"
              >
                <div className="col-span-1">
                  <span className={`font-mono text-sm font-bold ${entry.rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {entry.rank}
                  </span>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <img src={entry.avatar} alt={entry.name} className="h-8 w-8 rounded-md border border-border" />
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                </div>
                <div className="col-span-2 font-mono text-sm text-foreground">{entry.problemsSolved}</div>
                <div className="col-span-2 font-mono text-sm text-primary">{entry.streak}d</div>
                <div className="col-span-2 text-xs text-muted-foreground">{entry.department}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
