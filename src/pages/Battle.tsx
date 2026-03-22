import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { problems } from "@/data/problems";
import { users } from "@/data/users";
import { Swords, Timer, Trophy, Play, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const BATTLE_TIME = 15 * 60; // 15 minutes

export default function Battle() {
  const [phase, setPhase] = useState<"lobby" | "battle" | "result">("lobby");
  const [timeLeft, setTimeLeft] = useState(BATTLE_TIME);
  const [code, setCode] = useState("");
  const [opponent] = useState(users[Math.floor(Math.random() * users.length)]);
  const [problem] = useState(() => problems[Math.floor(Math.random() * problems.length)]);
  const [opponentProgress, setOpponentProgress] = useState(0);

  useEffect(() => {
    if (phase !== "battle" || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { setPhase("result"); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase !== "battle") return;
    const t = setInterval(() => {
      setOpponentProgress(p => Math.min(100, p + Math.random() * 5));
    }, 3000);
    return () => clearInterval(t);
  }, [phase]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const myProgress = Math.min(100, (code.length / 200) * 100);
  const winner = myProgress >= opponentProgress ? "You" : opponent.name;

  if (phase === "lobby") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Swords className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-4xl font-bold text-foreground">1v1 Coding Battle</h1>
          <p className="text-muted-foreground">Challenge another student. Solve a random problem in 15 minutes.</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <img src={users[0].avatar} alt="" className="h-16 w-16 rounded-full mx-auto border-2 border-primary" />
              <p className="mt-2 text-sm font-medium text-foreground">You</p>
            </div>
            <span className="text-2xl font-bold text-primary">VS</span>
            <div className="text-center">
              <img src={opponent.avatar} alt="" className="h-16 w-16 rounded-full mx-auto border-2 border-destructive" />
              <p className="mt-2 text-sm font-medium text-foreground">{opponent.name}</p>
            </div>
          </div>
          <Button size="lg" onClick={() => setPhase("battle")} className="gap-2">
            <Play className="h-4 w-4" /> Start Battle
          </Button>
        </motion.div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <Crown className="h-16 w-16 text-warning mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Winner: {winner}</h1>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <img src={users[0].avatar} alt="" className="h-12 w-12 rounded-full mx-auto" />
              <p className="text-sm text-foreground mt-1">You</p>
              <div className="mt-2 w-32 bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${myProgress}%` }} /></div>
            </div>
            <span className="text-lg font-bold text-muted-foreground">VS</span>
            <div className="text-center">
              <img src={opponent.avatar} alt="" className="h-12 w-12 rounded-full mx-auto" />
              <p className="text-sm text-foreground mt-1">{opponent.name}</p>
              <div className="mt-2 w-32 bg-secondary rounded-full h-2"><div className="bg-destructive h-2 rounded-full" style={{ width: `${opponentProgress}%` }} /></div>
            </div>
          </div>
          <Button onClick={() => { setPhase("lobby"); setTimeLeft(BATTLE_TIME); setCode(""); setOpponentProgress(0); }}>
            New Battle
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={users[0].avatar} alt="" className="h-6 w-6 rounded-full" />
            <div className="w-24 bg-secondary rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${myProgress}%` }} /></div>
          </div>
          <Swords className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className="w-24 bg-secondary rounded-full h-1.5"><div className="bg-destructive h-1.5 rounded-full transition-all" style={{ width: `${opponentProgress}%` }} /></div>
            <img src={opponent.avatar} alt="" className="h-6 w-6 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-foreground font-mono text-sm">
          <Timer className="h-4 w-4" /> {formatTime(timeLeft)}
        </div>
      </div>
      <div className="flex-1 min-h-0 flex">
        <div className="w-1/3 border-r border-border overflow-auto p-4 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{problem.title}</h2>
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            problem.difficulty === "Easy" ? "bg-easy/20 text-easy" : problem.difficulty === "Medium" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
          }`}>{problem.difficulty}</span>
          <p className="text-sm text-foreground">{problem.description}</p>
          <div className="rounded bg-secondary p-3">
            <p className="font-mono text-xs text-muted-foreground mb-1">Input</p>
            <code className="text-sm text-primary">{problem.exampleInput}</code>
          </div>
          <div className="rounded bg-secondary p-3">
            <p className="font-mono text-xs text-muted-foreground mb-1">Output</p>
            <code className="text-sm text-primary">{problem.exampleOutput}</code>
          </div>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language="python"
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            options={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 12 } }}
          />
        </div>
      </div>
    </div>
  );
}
