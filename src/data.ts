export type BuildStep = {
  label: string;
  detail: string;
  file?: string;
  additions?: number;
};

export const BUILD_STEPS: BuildStep[] = [
  { label: "Analyzing your request", detail: "Claude Sonnet 4.5 · 2.1s" },
  { label: "Scaffolding the project", detail: "Vite + React + TypeScript" },
  { label: "Installing dependencies", detail: "148 packages · 6.4s" },
  {
    label: "Creating components",
    detail: "HabitCard, ProgressRing, WeekChart",
    file: "src/components/HabitCard.tsx",
    additions: 86,
  },
  {
    label: "Wiring up state",
    detail: "localStorage persistence",
    file: "src/lib/habits.ts",
    additions: 54,
  },
  {
    label: "Polishing the UI",
    detail: "Responsive layout + micro-interactions",
    file: "src/App.tsx",
    additions: 132,
  },
];

export const SUGGESTIONS = [
  { label: "Habit tracker", prompt: "Build a beautiful habit tracker with daily streaks, progress rings and weekly insights", icon: "target" },
  { label: "SaaS dashboard", prompt: "Build a modern SaaS analytics dashboard with charts, stat cards and a customers table", icon: "chart" },
  { label: "Landing page", prompt: "Create a premium landing page for an AI note-taking app called Lumen", icon: "layout" },
  { label: "AI chat app", prompt: "Build an AI chat app with streaming responses, chat history and a polished dark UI", icon: "message" },
];

export const TEMPLATES = [
  {
    name: "Analytics dashboard",
    tag: "Web app",
    prompt: "Build a SaaS analytics dashboard with revenue charts, active users and a customers table",
    gradient: "from-indigo-500/25 via-sky-500/10 to-transparent",
    accent: "#818cf8",
  },
  {
    name: "Marketplace",
    tag: "Full-stack",
    prompt: "Build a marketplace for vintage furniture with listings, filters and a product detail page",
    gradient: "from-amber-400/25 via-orange-500/10 to-transparent",
    accent: "#fbbf24",
  },
  {
    name: "AI writing studio",
    tag: "AI app",
    prompt: "Build an AI writing studio with document editor, tone controls and a clean light interface",
    gradient: "from-emerald-400/25 via-teal-500/10 to-transparent",
    accent: "#34d399",
  },
];

type CodeFile = {
  path: string;
  lang: "tsx" | "ts" | "css" | "json" | "md";
  code: string;
};

export const PROJECT_FILES: CodeFile[] = [
  {
    path: "src/App.tsx",
    lang: "tsx",
    code: `import { useEffect, useState } from "react";
import { Plus, Flame, CalendarDays } from "lucide-react";
import { HabitCard } from "./components/HabitCard";
import { ProgressRing } from "./components/ProgressRing";
import { WeekChart } from "./components/WeekChart";
import { loadHabits, saveHabits, type Habit } from "./lib/habits";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => saveHabits(habits), [habits]);

  const completed = habits.filter((h) => h.doneToday).length;
  const progress = Math.round((completed / Math.max(habits.length, 1)) * 100);

  function toggle(id: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, doneToday: !h.doneToday, streak: h.doneToday ? h.streak - 1 : h.streak + 1 }
          : h,
      ),
    );
  }

  function addHabit() {
    if (!name.trim()) return;
    setHabits((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), doneToday: false, streak: 0, color: "#6366f1" },
    ]);
    setName("");
    setShowNew(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f9] text-slate-900">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-10 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="grid size-8 place-items-center rounded-xl bg-indigo-600 text-white">h</span>
              habitflow
            </div>
            <nav className="space-y-1 text-sm text-slate-500">
              <a className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-medium text-slate-900 shadow-sm">
                <CalendarDays className="size-4" /> Today
              </a>
              <a className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/70">
                <Flame className="size-4" /> Streaks
              </a>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500">Tuesday, March 18</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Good morning, Alex</h1>
            </div>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <Plus className="size-4" /> New habit
            </button>
          </header>

          <section className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Today's progress</p>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing value={progress} />
                <div>
                  <p className="text-3xl font-semibold">{completed}/{habits.length}</p>
                  <p className="text-sm text-slate-500">habits completed</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Current streak</p>
              <p className="mt-3 text-3xl font-semibold">12 days</p>
              <p className="mt-1 text-sm text-emerald-600">Best streak: 24 days</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">This week</p>
              <WeekChart />
            </div>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-medium text-slate-500">Your habits</h2>
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onToggle={() => toggle(habit.id)} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}`,
  },
  {
    path: "src/components/HabitCard.tsx",
    lang: "tsx",
    code: `import { Check, Flame, MoreHorizontal } from "lucide-react";
import type { Habit } from "../lib/habits";

type Props = {
  habit: Habit;
  onToggle: () => void;
};

export function HabitCard({ habit, onToggle }: Props) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <button
        onClick={onToggle}
        aria-label={habit.doneToday ? "Mark as not done" : "Mark as done"}
        className={
          "grid size-10 shrink-0 place-items-center rounded-full border-2 transition " +
          (habit.doneToday
            ? "border-transparent bg-indigo-600 text-white"
            : "border-slate-200 text-transparent hover:border-indigo-300")
        }
      >
        <Check className="size-5" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p className={"truncate font-medium " + (habit.doneToday ? "text-slate-400 line-through" : "text-slate-900")}>
          {habit.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">Every day · Morning</p>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
        <Flame className="size-3.5" />
        {habit.streak}
      </div>

      <button className="rounded-lg p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100">
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  );
}`,
  },
  {
    path: "src/lib/habits.ts",
    lang: "ts",
    code: `export type Habit = {
  id: string;
  name: string;
  doneToday: boolean;
  streak: number;
  color: string;
};

const KEY = "habitflow.habits.v1";

const seed: Habit[] = [
  { id: "1", name: "Morning run", doneToday: true, streak: 12, color: "#6366f1" },
  { id: "2", name: "Read 20 pages", doneToday: true, streak: 8, color: "#f59e0b" },
  { id: "3", name: "Meditate", doneToday: false, streak: 4, color: "#10b981" },
  { id: "4", name: "Drink 2L of water", doneToday: true, streak: 21, color: "#0ea5e9" },
  { id: "5", name: "Journal", doneToday: false, streak: 2, color: "#ec4899" },
];

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : seed;
  } catch {
    return seed;
  }
}

export function saveHabits(habits: Habit[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(habits));
  } catch {
    /* storage unavailable */
  }
}`,
  },
  {
    path: "src/index.css",
    lang: "css",
    code: `@import "tailwindcss";

:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-feature-settings: "cv11", "ss01";
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

@keyframes pop {
  0% { transform: scale(0.92); opacity: 0 }
  100% { transform: scale(1); opacity: 1 }
}

.pop-in {
  animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}`,
  },
  {
    path: "package.json",
    lang: "json",
    code: `{
  "name": "habitflow",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^1.77.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.5",
    "@vitejs/plugin-react": "^6.3.0",
    "tailwindcss": "^4.3.5",
    "typescript": "^7.0.2",
    "vite": "^8.3.8"
  }
}`,
  },
  {
    path: "README.md",
    lang: "md",
    code: `# HabitFlow

A calm, focused habit tracker built with Bolt.

## Features

- Daily habit check-ins with streak tracking
- Animated progress ring and weekly chart
- Local-first persistence — no account required
- Responsive layout with a clean, warm interface

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Built with React 19, TypeScript, Tailwind CSS 4 and Vite.
`,
  },
];
