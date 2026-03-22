import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { events } from "@/data/events";
import { Clock } from "lucide-react";

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Started"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [targetDate]);

  return <span className="font-mono text-xs text-primary">{timeLeft}</span>;
}

export default function Events() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">// Events</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{ev.type}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <Countdown targetDate={ev.date} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{ev.title}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ev.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <a
                  href={ev.registrationLink}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110 transition-all"
                >
                  Register →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
