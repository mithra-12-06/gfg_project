import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { users } from "@/data/users";
import { Users, Send, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function PairProgramming() {
  const [joined, setJoined] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [code, setCode] = useState("# Pair programming session\n# Start coding together!\n");
  const [chatMessages, setChatMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [partner] = useState(users[Math.floor(Math.random() * users.length)]);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate partner typing
  useEffect(() => {
    if (!joined) return;
    const msgs = [
      "Hey! Let's work on this together 🤝",
      "I'll handle the edge cases",
      "What approach should we use?",
      "Nice! That looks clean",
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < msgs.length) {
        setChatMessages(prev => [...prev, { user: partner.name, text: msgs[i] }]);
        i++;
      }
    }, 8000);
    return () => clearInterval(t);
  }, [joined, partner.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: "You", text: chatInput }]);
    setChatInput("");
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    toast({ title: "Copied!", description: "Session ID copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!joined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Users className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-4xl font-bold text-foreground">Pair Programming</h1>
          <p className="text-muted-foreground">Code together in real-time with a shared editor and chat.</p>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 inline-flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Session ID:</span>
              <span className="font-mono text-lg text-primary font-bold">{sessionId}</span>
              <Button size="sm" variant="outline" onClick={copySessionId} className="gap-1.5">
                {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="flex gap-2 justify-center">
              <Button size="lg" onClick={() => setJoined(true)}>Create Session</Button>
              <Button size="lg" variant="outline" onClick={() => setJoined(true)}>Join Session</Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Session: <span className="font-mono text-primary">{sessionId}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <img src={users[0].avatar} alt="" className="h-6 w-6 rounded-full border-2 border-card" />
            <img src={partner.avatar} alt="" className="h-6 w-6 rounded-full border-2 border-card" />
          </div>
          <span className="text-xs text-muted-foreground">2 online</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex">
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
        {/* Chat panel */}
        <div className="w-72 border-l border-border bg-card flex flex-col">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Chat</span>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={`text-xs rounded-lg p-2 ${m.user === "You" ? "bg-primary/10 text-foreground ml-4" : "bg-secondary text-foreground mr-4"}`}>
                <span className="font-medium text-primary">{m.user}: </span>{m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t border-border flex gap-1.5">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Type a message..."
              className="flex-1 bg-secondary text-foreground text-xs rounded px-2.5 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="sm" onClick={sendChat} className="h-7 px-2">
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
