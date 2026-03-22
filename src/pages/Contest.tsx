import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { problems } from "@/data/problems";
import { users } from "@/data/users";
import { Timer, Trophy, Play, Send, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTEST_DURATION = 60 * 60; // 60 minutes in seconds

function getContestProblems() {
  const easy = problems.filter(p => p.difficulty === "Easy").slice(0, 1);
  const medium = problems.filter(p => p.difficulty === "Medium").slice(0, 1);
  const hard = problems.filter(p => p.difficulty === "Hard").slice(0, 1);
  return [...easy, ...medium, ...hard];
}

function generateLeaderboard() {
  return users.slice(0, 15).map((u, i) => ({
    ...u,
    score: Math.max(0, 3 - Math.floor(i / 5)),
    time: `${5 + i * 3}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
  }));
}

export default function Contest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CONTEST_DURATION);
  const [contestProblems] = useState(getContestProblems);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [codes, setCodes] = useState<string[]>(["", "", ""]);
  const [results, setResults] = useState<(null | "accepted" | "wrong")[]>([null, null, null]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard] = useState(generateLeaderboard);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  const formatTime = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const submitSolution = useCallback((idx: number) => {
    setResults(prev => {
      const n = [...prev];
      n[idx] = Math.random() > 0.3 ? "accepted" : "wrong";
      return n;
    });
  }, []);

  const score = results.filter(r => r === "accepted").length;

  if (!started) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">60 Minute Contest</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Campus Coding Contest</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Solve 3 problems of increasing difficulty. Your score and time will be recorded on the leaderboard.</p>
          <div className="flex gap-2 justify-center">
            {["Easy", "Medium", "Hard"].map(d => (
              <span key={d} className={`rounded px-3 py-1 text-xs font-medium ${
                d === "Easy" ? "bg-easy/20 text-easy" : d === "Medium" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
              }`}>{d}</span>
            ))}
          </div>
          <Button size="lg" onClick={() => setStarted(true)} className="gap-2">
            <Play className="h-4 w-4" /> Start Contest
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showLeaderboard || timeLeft === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center space-y-2">
            <Trophy className="h-10 w-10 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Contest Results</h1>
            <p className="text-muted-foreground">Your score: <span className="text-primary font-bold">{score}/3</span></p>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary">
                <th className="px-4 py-2 text-left text-xs text-muted-foreground">Rank</th>
                <th className="px-4 py-2 text-left text-xs text-muted-foreground">Name</th>
                <th className="px-4 py-2 text-left text-xs text-muted-foreground">Score</th>
                <th className="px-4 py-2 text-left text-xs text-muted-foreground">Time</th>
              </tr></thead>
              <tbody>
                {leaderboard.map((u, i) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <img src={u.avatar} alt="" className="h-6 w-6 rounded-full" />
                      <span className="text-foreground">{u.name}</span>
                    </td>
                    <td className="px-4 py-2 text-primary font-medium">{u.score}/3</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{u.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  }

  const prob = contestProblems[currentProblem];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Timer bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex gap-2">
          {contestProblems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentProblem(i)}
              className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors ${
                i === currentProblem ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {results[i] === "accepted" ? <CheckCircle2 className="h-3 w-3 text-easy" /> :
               results[i] === "wrong" ? <XCircle className="h-3 w-3 text-destructive" /> : null}
              Problem {i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-foreground">{formatTime(timeLeft)}</span>
          <Button size="sm" variant="outline" onClick={() => setShowLeaderboard(true)}>Finish</Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Problem */}
        <div className="w-1/3 border-r border-border overflow-auto p-4 space-y-4">
          <h2 className="text-lg font-bold text-foreground">{prob.title}</h2>
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            prob.difficulty === "Easy" ? "bg-easy/20 text-easy" : prob.difficulty === "Medium" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
          }`}>{prob.difficulty}</span>
          <p className="text-sm text-foreground">{prob.description}</p>
          <div className="rounded bg-secondary p-3">
            <p className="font-mono text-xs text-muted-foreground mb-1">Input</p>
            <code className="text-sm text-primary">{prob.exampleInput}</code>
          </div>
          <div className="rounded bg-secondary p-3">
            <p className="font-mono text-xs text-muted-foreground mb-1">Output</p>
            <code className="text-sm text-primary">{prob.exampleOutput}</code>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language="python"
              value={codes[currentProblem]}
              onChange={(v) => setCodes(prev => { const n = [...prev]; n[currentProblem] = v || ""; return n; })}
              theme="vs-dark"
              options={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 12 } }}
            />
          </div>
          <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-border bg-card">
            <Button size="sm" onClick={() => submitSolution(currentProblem)} className="gap-1.5">
              <Send className="h-3 w-3" /> Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
