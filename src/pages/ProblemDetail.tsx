import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { problems } from "@/data/problems";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, Send, Bot, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const LANGUAGE_MAP: Record<string, { id: number; template: string }> = {
  python: { id: 71, template: '# Write your solution here\n\ndef solve():\n    pass\n\nsolve()' },
  c: { id: 50, template: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}' },
  cpp: { id: 54, template: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}' },
  java: { id: 62, template: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}' },
  javascript: { id: 63, template: '// Write your solution here\n\nfunction solve() {\n    \n}\n\nsolve();' },
};

const MONACO_LANG_MAP: Record<string, string> = {
  python: "python",
  c: "c",
  cpp: "cpp",
  java: "java",
  javascript: "javascript",
};

export default function ProblemDetail() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === Number(id));
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_MAP.python.template);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(LANGUAGE_MAP[lang].template);
  }, []);

  const runCode = useCallback(async () => {
    setRunning(true);
    setOutput("Running...");
    try {
      const { data, error } = await supabase.functions.invoke("run-code", {
        body: { source_code: code, language_id: LANGUAGE_MAP[language].id, stdin },
      });
      if (error) throw error;
      setOutput(data.output || data.error || "No output");
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setRunning(false);
    }
  }, [code, language, stdin]);

  const submitCode = useCallback(async () => {
    setSubmitting(true);
    try {
      await runCode();
      toast({ title: "Submitted!", description: "Your solution has been submitted." });
    } finally {
      setSubmitting(false);
    }
  }, [runCode]);

  const sendAiMessage = useCallback(async () => {
    if (!aiInput.trim()) return;
    const userMsg = { role: "user" as const, content: aiInput };
    const newMessages = [...aiMessages, userMsg];
    setAiMessages(newMessages);
    setAiInput("");
    setAiLoading(true);

    try {
      const context = problem
        ? `The student is working on: "${problem.title}" (${problem.difficulty}). Description: ${problem.description}. Their current code:\n\`\`\`${language}\n${code}\n\`\`\``
        : "";

      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: {
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context,
        },
      });
      if (error) throw error;
      setAiMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setAiMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, aiMessages, code, language, problem]);

  if (!problem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-muted-foreground">Problem not found.</p>
        <Link to="/problems" className="text-primary text-sm hover:underline">← Back to problems</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-card">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-mono text-xs text-muted-foreground">#{problem.id}</span>
          <span className="font-semibold text-sm text-foreground">{problem.title}</span>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${
            problem.difficulty === "Easy" ? "bg-easy/20 text-easy" :
            problem.difficulty === "Medium" ? "bg-warning/20 text-warning" :
            "bg-destructive/20 text-destructive"
          }`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAiOpen(!aiOpen)} className="gap-1.5">
            <Bot className="h-3.5 w-3.5" /> AI Assistant
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex">
        {/* Left: Problem description */}
        <div className="w-[35%] min-w-[20%] max-w-[50%] border-r border-border">
          <div className="h-full overflow-auto p-4 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {problem.tags.map(t => (
                <span key={t} className="rounded bg-accent px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
            <div>
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-foreground leading-relaxed">{problem.description}</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-md bg-secondary p-3">
                <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Example Input</h4>
                <code className="font-mono text-sm text-primary">{problem.exampleInput}</code>
              </div>
              <div className="rounded-md bg-secondary p-3">
                <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Example Output</h4>
                <code className="font-mono text-sm text-primary">{problem.exampleOutput}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor + console */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary border-b border-border">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-accent text-foreground text-xs rounded px-2 py-1 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Object.keys(LANGUAGE_MAP).map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={MONACO_LANG_MAP[language]}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>

          {/* Console */}
          <div className="h-56 md:h-64 flex flex-col bg-card border-t border-border">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">Console</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={runCode} disabled={running} className="gap-1.5 h-7 text-xs">
                  {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                  Run
                </Button>
                <Button size="sm" onClick={submitCode} disabled={submitting} className="gap-1.5 h-7 text-xs">
                  {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  Submit
                </Button>
              </div>
            </div>
            <div className="flex flex-1 min-h-0">
              <div className="w-[40%] min-w-[30%] max-w-[50%] border-r border-border p-2">
                <label className="font-mono text-xs text-muted-foreground block mb-1">Input</label>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter test input..."
                  className="w-full h-[calc(100%-1.5rem)] bg-secondary text-foreground text-xs font-mono rounded p-2 resize-none border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1 p-2">
                <label className="font-mono text-xs text-muted-foreground block mb-1">Output</label>
                <pre className="w-full h-[calc(100%-1.5rem)] bg-secondary text-foreground text-xs font-mono rounded p-2 overflow-auto border border-border">
                  {output || "Run your code to see output..."}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {aiOpen && (
          <div className="w-80 border-l border-border bg-card flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-primary" /> AI Assistant
              </span>
              <button onClick={() => setAiOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-3">
              {aiMessages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-8">Ask me anything about this problem, your code, or DSA concepts!</p>
              )}
              {aiMessages.map((m, i) => (
                <div key={i} className={`text-xs rounded-lg p-2.5 ${m.role === "user" ? "bg-primary/10 text-foreground ml-4" : "bg-secondary text-foreground mr-4"}`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : m.content}
                </div>
              ))}
              {aiLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                </div>
              )}
            </div>
            <div className="p-2 border-t border-border">
              <div className="flex gap-1.5">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAiMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-secondary text-foreground text-xs rounded px-2.5 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" onClick={sendAiMessage} disabled={aiLoading} className="h-7 px-2">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
