import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Code2, Trophy, Calendar } from "lucide-react";
import { users } from "@/data/users";
import { problems } from "@/data/problems";
import { events } from "@/data/events";

const tagline = "Code • Compete • Collaborate";

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span>
      {displayed}
      <span className="cursor-blink text-primary">▊</span>
    </span>
  );
}

const stats = [
  { label: "Active Students", value: users.length, icon: Users },
  { label: "Problems", value: problems.length, icon: Code2 },
  { label: "Events", value: events.length, icon: Calendar },
];

export default function Home() {
  const featuredProblem = problems[7]; // N-Queens
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="mb-2 font-mono text-xs text-muted-foreground">SYSTEM.LOG: {users.length} Students Active.</p>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          <TypingText text={tagline} />
        </h1>
        <p className="mb-8 max-w-xl text-muted-foreground">
          The campus coding platform built for speed. Track progress, crush problems, climb the leaderboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Execute Challenge <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            View Dashboard
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:-translate-y-0.5">
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </motion.section>

      {/* Featured Challenge */}
      <section className="mb-16">
        <h2 className="mb-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">// Featured Challenge</h2>
        <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary">
          <div className="flex items-start justify-between">
            <div>
              <span className="mb-2 inline-block rounded bg-hard px-2 py-0.5 text-xs font-medium text-hard">
                {featuredProblem.difficulty}
              </span>
              <h3 className="mt-2 text-lg font-bold text-foreground">{featuredProblem.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{featuredProblem.description}</p>
              <div className="mt-3 flex gap-2">
                {featuredProblem.tags.map(t => (
                  <span key={t} className="rounded bg-accent px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
            <Link
              to={`/problems/${featuredProblem.id}`}
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110"
            >
              Solve →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">// Upcoming Events</h2>
          <Link to="/events" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {upcomingEvents.map(ev => (
            <div key={ev.id} className="rounded-lg border border-border bg-card p-5 transition-all hover:border-primary hover:-translate-y-0.5">
              <span className="mb-2 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{ev.type}</span>
              <h3 className="mt-1 font-semibold text-foreground">{ev.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="mb-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">// About the Club</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Campus Coding Club is a student-run initiative focused on building a culture of competitive programming, 
            collaborative learning, and technical excellence. We host weekly contests, workshops, and hackathons to prepare 
            students for placements and real-world engineering challenges.
          </p>
        </div>
      </section>
    </div>
  );
}
