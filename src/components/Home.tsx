import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Check,
  ChevronDown,
  Command,
  Database,
  FlaskConical,
  GitBranch,
  Globe2,
  LayoutTemplate,
  Mic,
  Monitor,
  PenTool,
  Plus,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { cn } from "./ui";

const NAV_MODELS = ["Bolt Agent", "Claude Sonnet 4.5", "GPT-5.2", "Gemini 3 Pro"];

const MODES = [
  { id: "website", label: "Website", icon: Globe2, hint: "Marketing sites, blogs, portfolios" },
  { id: "app", label: "App", icon: Monitor, hint: "Full-stack web applications" },
  { id: "prototype", label: "Prototype", icon: FlaskConical, hint: "Quick interactive concepts" },
  { id: "slides", label: "Slides", icon: Presentation, hint: "Pitch decks and presentations" },
] as const;

const PLACEHOLDERS = [
  "Let's build a prototype...",
  "Build me a SaaS analytics dashboard...",
  "Create a booking site for a boutique hotel...",
  "Make a habit tracker with streaks and charts...",
  "Design a landing page for an AI startup...",
];

const LOGOS = ["Google", "Microsoft", "Salesforce", "AWS", "Meta", "HubSpot", "Accenture", "TikTok", "Shopify", "Stripe"];

const ROLES = [
  {
    role: "Product managers",
    body: "Go from insight to interactive prototype in hours, and put something real in front of your team before the day is over.",
    stat: "6×",
    statLabel: "faster validation",
  },
  {
    role: "Entrepreneurs",
    body: "Launch a complete business in days, not months. Landing page, product, payments and hosting in one flow.",
    stat: "3 days",
    statLabel: "idea to launch",
  },
  {
    role: "Marketers",
    body: "Spin up high-performing campaign pages in hours, with SEO, analytics and custom domains built in.",
    stat: "40+",
    statLabel: "pages per sprint",
  },
  {
    role: "Agencies",
    body: "Deliver more projects without scaling headcount. Reusable design systems keep every client on-brand.",
    stat: "2×",
    statLabel: "client capacity",
  },
  {
    role: "Students & builders",
    body: "Learn by doing. Turn class projects and late-night ideas into fully working apps you can share.",
    stat: "2M+",
    statLabel: "builders",
  },
];

export default function Home({
  onBuild,
  onToast,
}: {
  onBuild: (prompt: string) => void;
  onToast: (message: string) => void;
}) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("website");
  const [model, setModel] = useState(NAV_MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(0);
  const [role, setRole] = useState(0);
  const [prompt, setPrompt] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLInputElement>(null);

  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  useEffect(() => {
    if (value) return;
    const id = window.setInterval(() => setPlaceholder((p) => (p + 1) % PLACEHOLDERS.length), 3200);
    return () => window.clearInterval(id);
  }, [value]);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  useEffect(() => {
    const close = () => {
      setModelOpen(false);
      setImportOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  function submit() {
    if (!value.trim()) return;
    onBuild(value.trim());
    setValue("");
  }

  function submitBottom() {
    if (!prompt.trim()) return;
    onBuild(prompt.trim());
    setPrompt("");
  }

  return (
    <div className="min-h-screen bg-[#171719] text-white">
      {/* hero panel */}
      <section className="relative mx-2.5 mt-2.5 flex min-h-[calc(100dvh-80px)] flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#06070d] sm:mx-3 sm:mt-3">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[24%] h-[820px] w-[1180px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(27,61,255,0.92),rgba(24,48,210,0.55)_38%,rgba(9,14,60,0.35)_68%,transparent)] blur-[10px]" />
          <div className="absolute left-1/2 top-[16%] h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(44,86,255,0.55),transparent)] blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(15,164,175,0.38),transparent)] blur-3xl" />
          <div className="absolute -right-20 top-24 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(87,45,255,0.32),transparent)] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,transparent_20%,rgba(4,5,10,0.4)_78%,#06070d_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="hero-grid absolute inset-0 opacity-[0.18]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-[52px] md:text-[58px]"
          >
            What will you build today?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-4 text-[15px] font-medium text-white/85 sm:text-[18px]"
          >
            Create stunning apps &amp; websites by chatting with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-9 w-full max-w-[632px]"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="group relative rounded-2xl border border-white/10 bg-[#17171b]/85 p-3 text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors focus-within:border-white/25"
            >
              <textarea
                ref={taRef}
                id="hero-prompt"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={2}
                placeholder={PLACEHOLDERS[placeholder]}
                className="scrollbar-thin block min-h-[64px] w-full resize-none bg-transparent px-2 pt-1.5 text-[15px] leading-relaxed text-white placeholder:text-white/40 focus:outline-none"
              />

              <div className="mt-2 flex items-center gap-1.5">
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Add context"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImportOpen((v) => !v);
                      setModelOpen(false);
                    }}
                    className="grid size-8 place-items-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <Plus className="size-[17px]" />
                  </button>
                  {importOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-11 left-0 z-30 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c21] p-1.5 shadow-2xl"
                    >
                      {[
                        { icon: GitBranch, label: "Import from GitHub" },
                        { icon: PenTool, label: "Import from Figma" },
                        { icon: LayoutTemplate, label: "Start from a template" },
                      ].map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={() => {
                            setImportOpen(false);
                            onToast(`${a.label} — demo only`);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/75 transition hover:bg-white/[0.07]"
                        >
                          <a.icon className="size-3.5 text-white/45" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModelOpen((v) => !v);
                      setImportOpen(false);
                    }}
                    className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Sparkles className="size-3.5 text-indigo-300" />
                    Plan
                    <ChevronDown className="size-3 text-white/35" />
                  </button>
                  {modelOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-11 left-0 z-30 w-56 rounded-xl border border-white/10 bg-[#1c1c21] p-1.5 shadow-2xl"
                    >
                      {NAV_MODELS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setModel(m);
                            setModelOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[12.5px] text-white/80 transition hover:bg-white/[0.06]"
                        >
                          {m}
                          {model === m && <Check className="size-3.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onToast("Voice input — demo only")}
                  aria-label="Voice input"
                  className="grid size-8 place-items-center rounded-full text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Mic className="size-4" />
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <span className="hidden text-[11px] text-white/30 sm:block">↵ to build</span>
                  <button
                    type="submit"
                    disabled={!value.trim()}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[#2f6bff] px-3 text-[12.5px] font-semibold text-white shadow-[0_0_24px_-6px_rgba(47,107,255,0.8)] transition hover:bg-[#4a7fff] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
                  >
                    Build now
                    <ArrowRight className="size-3.5" strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-start justify-center gap-2.5">
              {MODES.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    title={m.hint}
                    onClick={() => {
                      setMode(m.id);
                      taRef.current?.focus();
                    }}
                    className={cn(
                      "flex w-[78px] flex-col items-center gap-2 rounded-xl px-2 py-3 text-[12px] transition sm:w-[84px]",
                      active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-lg border transition",
                        active
                          ? "border-white/25 bg-white/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/65",
                      )}
                    >
                      <Icon className="size-[19px]" strokeWidth={1.7} />
                    </span>
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-white/55">
              <span className="mr-1 text-white/45">or start from</span>
              {[
                { icon: PenTool, label: "Figma" },
                { icon: GitBranch, label: "GitHub" },
                { icon: Users, label: "Team template" },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => onToast(`${c.label} import — demo only`)}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                >
                  <c.icon className="size-3.5" />
                  {c.label}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[11px] text-white/35">
              Active mode: <span className="text-white/65">{activeMode.label}</span> · {activeMode.hint}
            </p>
          </motion.div>
        </div>
      </section>

      {/* trusted by */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-white/30">Trusted by teams at</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
          {LOGOS.map((l) => (
            <span key={l} className="text-[15px] font-medium tracking-tight text-white/45 transition hover:text-white/80">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* empowering */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-blue-300/80">Bolt Agent 2.0</p>
          <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[44px]">
            Empowering product builders
            <br />
            <span className="text-white/40">with the most powerful coding agents</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/45">
            Bolt does the heavy lifting for you, so you can focus on your vision instead of fighting errors.
            It plans, writes, runs and repairs code in a real environment.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: Wand2,
              title: "The best model, every time",
              body: "Bolt automatically routes each task to the right model, balancing quality and cost. No more juggling platforms.",
              visual: (
                <div className="mt-5 space-y-2">
                  {["Claude Sonnet 4.5", "GPT-5.2", "Gemini 3 Pro"].map((m, i) => (
                    <div key={m} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                      <span className="text-[12px] text-white/70">{m}</span>
                      <span className={cn("text-[10px] uppercase tracking-wider", i === 0 ? "text-emerald-300" : "text-white/30")}>
                        {i === 0 ? "selected" : "standby"}
                      </span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              icon: Zap,
              title: "98% fewer errors",
              body: "Bolt automatically tests, refactors and iterates to reduce errors — so you stay focused on building.",
              visual: (
                <div className="mt-5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
                  <div className="flex items-end justify-between">
                    <span className="text-[38px] font-semibold leading-none tracking-tight">98%</span>
                    <span className="text-[11px] text-emerald-300">fewer errors</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" />
                  </div>
                </div>
              ),
            },
            {
              icon: Database,
              title: "Build big without breaking",
              body: "Projects 1,000× larger than before, with built-in context management that keeps complex apps running smoothly.",
              visual: (
                <div className="mt-5 grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-7 rounded border border-white/[0.06]"
                      style={{ background: `rgba(255,255,255,${0.02 + (i % 4) * 0.018})` }}
                    />
                  ))}
                </div>
              ),
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/[0.08] bg-[#1b1b1f] p-5 transition hover:border-white/[0.16]">
              <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/75">
                <c.icon className="size-4" />
              </span>
              <h3 className="mt-4 text-[15px] font-medium">{c.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/40">{c.body}</p>
              {c.visual}
            </div>
          ))}
        </div>
      </section>

      {/* built-in */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1b1b1f]">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-2">
            <div>
              <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-blue-300/80">Bolt Cloud</p>
              <h2 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[38px]">
                Everything you need to scale. <span className="text-white/35">Built in.</span>
              </h2>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/45">
                Stop stitching together platforms. Hosting, databases, auth and integrations live inside one
                familiar interface — with no extra accounts.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Unlimited databases",
                  "User management & auth",
                  "SEO optimization",
                  "Hosting, analytics & domains",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[12px] text-white/65">
                    <Check className="size-3.5 text-emerald-300" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014] p-3">
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2.5">
                <span className="size-2 rounded-full bg-white/15" />
                <span className="size-2 rounded-full bg-white/15" />
                <span className="size-2 rounded-full bg-white/15" />
                <span className="ml-2 rounded bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">app.bolt.new</span>
              </div>
              <div className="mt-3 grid grid-cols-[110px_1fr] gap-3">
                <div className="space-y-1.5">
                  {["Overview", "Database", "Auth", "Storage", "Domains", "Analytics"].map((i, idx) => (
                    <div key={i} className={cn("rounded px-2 py-1.5 text-[10.5px]", idx === 1 ? "bg-white/[0.08] text-white/80" : "text-white/35")}>
                      {i}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-white/35">Rows</span>
                      <span className="text-[10px] text-emerald-300">healthy</span>
                    </div>
                    <div className="mt-2 flex items-end gap-1">
                      {[22, 34, 28, 46, 38, 58, 49, 66, 54, 72, 61, 80].map((h, i) => (
                        <span key={i} className="w-full rounded-sm bg-gradient-to-t from-blue-500/30 to-blue-400/80" style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
                      <BarChart3 className="size-3.5 text-white/40" />
                      <p className="mt-2 text-[16px] font-medium">1.2M</p>
                      <p className="text-[9.5px] text-white/35">requests / day</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
                      <ShieldCheck className="size-3.5 text-white/40" />
                      <p className="mt-2 text-[16px] font-medium">99.99%</p>
                      <p className="text-[9.5px] text-white/35">uptime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* roles */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-blue-300/80">Whatever your role</p>
            <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[40px]">
              Bolt gives you <span className="text-white/35">superpowers</span>
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/45">
              From idea to live product, Bolt adapts to the way you work — turning every vision into something real, fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {ROLES.map((r, i) => (
                <button
                  key={r.role}
                  onClick={() => setRole(i)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px] transition",
                    role === i
                      ? "border-white/25 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/45 hover:text-white/80",
                  )}
                >
                  {r.role}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#1b1b1f] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">{ROLES[role].role}</p>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">{ROLES[role].body}</p>
              </div>
              <div className="text-right">
                <p className="text-[34px] font-semibold leading-none tracking-tight text-blue-300">{ROLES[role].stat}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">{ROLES[role].statLabel}</p>
              </div>
            </div>
            <div className="mt-6 h-px bg-white/[0.07]" />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["#f4c07a", "#8b9dfa", "#9ae6b4", "#f6a4c7"].map((c, i) => (
                  <span
                    key={c}
                    className="grid size-7 place-items-center rounded-full border-2 border-[#1b1b1f] text-[10px] font-semibold text-black/70"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {["A", "M", "J", "S"][i]}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-white/35">Joined this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1030] px-6 py-12 text-center sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,107,255,0.5),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-[30px] font-semibold tracking-[-0.04em] sm:text-[40px]">Ready to build something amazing?</h2>
            <p className="mt-3 text-[13.5px] text-white/55">Try it out and start building for free.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitBottom();
              }}
              className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-xl border border-white/15 bg-[#17171b]/90 p-2 backdrop-blur"
            >
              <input
                ref={bottomRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[13.5px] text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#2f6bff] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#4a7fff] disabled:bg-white/10 disabled:text-white/30"
              >
                Build now <ArrowUp className="size-3.5" />
              </button>
            </form>
            <p className="mt-3 text-[11px] text-white/30">No credit card required · Free daily tokens</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-md bg-white/10">
                  <Command className="size-3 text-white/70" />
                </span>
                <span className="text-[14px] font-semibold">bolt.new</span>
              </div>
              <p className="mt-3 max-w-xs text-[11.5px] leading-relaxed text-white/35">
                A faithful interface remake. Build apps and websites by chatting with AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-[11.5px] sm:grid-cols-3">
              {[
                { h: "Solutions", l: ["AI App Builder", "AI Website Builder", "Prototyping", "Enterprise"] },
                { h: "Resources", l: ["Blog", "Community", "Help Center", "Templates"] },
                { h: "More", l: ["Careers", "Pricing", "Terms", "Privacy"] },
              ].map((col) => (
                <div key={col.h}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">{col.h}</p>
                  <ul className="mt-3 space-y-2 text-white/50">
                    {col.l.map((l) => (
                      <li key={l}>
                        <button onClick={() => onToast(`${l} — demo only`)} className="transition hover:text-white">
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-5 text-[11px] text-white/25 sm:flex-row">
            <span>© 2026 Bolt Remake. Built for demonstration.</span>
            <span>Made with React, Vite &amp; Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
