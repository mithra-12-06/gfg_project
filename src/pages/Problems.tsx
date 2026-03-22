import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { problems } from "@/data/problems";
import { Search } from "lucide-react";

export default function Problems() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = diffFilter === "All" || p.difficulty === diffFilter;
      return matchSearch && matchDiff;
    });
  }, [search, diffFilter]);

  const diffCounts = useMemo(() => ({
    All: problems.length,
    Easy: problems.filter(p => p.difficulty === "Easy").length,
    Medium: problems.filter(p => p.difficulty === "Medium").length,
    Hard: problems.filter(p => p.difficulty === "Hard").length,
  }), []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">// Problems</h1>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems or tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-1">
            {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  diffFilter === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {d} ({diffCounts[d]})
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border bg-secondary">
            <div className="col-span-1 text-xs text-muted-foreground uppercase tracking-wider">#</div>
            <div className="col-span-5 text-xs text-muted-foreground uppercase tracking-wider">Title</div>
            <div className="col-span-2 text-xs text-muted-foreground uppercase tracking-wider">Difficulty</div>
            <div className="col-span-4 text-xs text-muted-foreground uppercase tracking-wider">Tags</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(p => (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-surface-raised transition-colors cursor-pointer"
              >
                <div className="col-span-1 font-mono text-xs text-muted-foreground">{p.id}</div>
                <div className="col-span-5 text-sm font-medium text-foreground">{p.title}</div>
                <div className="col-span-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                    p.difficulty === "Easy" ? "bg-easy text-easy" :
                    p.difficulty === "Medium" ? "bg-medium text-medium" :
                    "bg-hard text-hard"
                  }`}>
                    {p.difficulty}
                  </span>
                </div>
                <div className="col-span-4 flex flex-wrap gap-1">
                  {p.tags.map(t => (
                    <span key={t} className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{filtered.length} problems</p>
      </motion.div>
    </div>
  );
}
