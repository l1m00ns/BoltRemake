import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileCode2,
  FileJson,
  FileText,
  History,
  Loader2,
  Lock,
  Maximize2,
  MessageSquare,
  Monitor,
  Plus,
  RefreshCw,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
} from "lucide-react";
import { BUILD_STEPS, PROJECT_FILES } from "../data";
import type { Device, Msg, Phase, Tab } from "../types";
import { BoltMark, IconButton, Spinner, cn } from "./ui";

type Props = {
  messages: Msg[];
  phase: Phase;
  step: number;
  tab: Tab;
  setTab: (t: Tab) => void;
  projectName: string;
  replying: boolean;
  onSend: (text: string) => void;
  onNewChat: () => void;
  onDeploy: () => void;
  onShare: () => void;
  onToast: (message: string) => void;
};

export default function Workspace({
  messages,
  phase,
  step,
  tab,
  setTab,
  projectName,
  replying,
  onSend,
  onNewChat,
  onDeploy,
  onShare,
  onToast,
}: Props) {
  const [value, setValue] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const [refreshing, setRefreshing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, phase, step]);

  function submit() {
    if (!value.trim() || phase === "building" || replying) return;
    onSend(value.trim());
    setValue("");
  }

  function refresh() {
    setRefreshing(true);
    setPreviewKey((k) => k + 1);
    window.setTimeout(() => setRefreshing(false), 700);
  }

  return (
    <div className="relative flex h-[calc(100dvh-52px)] min-h-0 bg-ink">
      {/* ---------------- chat ---------------- */}
      <aside
        className={cn(
          "min-h-0 w-full shrink-0 flex-col border-r border-line bg-[#0a0a0c] md:flex md:w-[392px] xl:w-[430px]",
          mobileView === "preview" ? "hidden md:flex" : "flex",
        )}
      >
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line-soft px-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-3.5 text-white/35" />
            <span className="text-[12.5px] font-medium text-white/70">Chat</span>
            <span className="rounded-full border border-white/10 px-1.5 py-px font-mono text-[10px] text-white/30">
              ⌘K
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <IconButton label="Chat history" onClick={() => onToast("Chat history — demo only")}>
              <History className="size-3.5" />
            </IconButton>
            <IconButton label="New chat" onClick={onNewChat}>
              <Plus className="size-4" />
            </IconButton>
          </div>
        </div>

        <div ref={scrollRef} className="scrollbar-thin min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[88%] rounded-2xl rounded-br-md border border-white/[0.08] bg-white/[0.055] px-3.5 py-2.5 text-[13px] leading-relaxed text-white/85">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-2.5">
                <BoltMark size={24} className="mt-0.5 shrink-0" />
                <p className="pt-0.5 text-[13px] leading-relaxed text-white/70">{m.text}</p>
              </div>
            ),
          )}

          {replying && (
            <div className="flex gap-2.5">
              <BoltMark size={24} className="mt-0.5 shrink-0" />
              <div className="flex h-6 items-center gap-1 pt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-white/35"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {phase !== "idle" && (
            <BuildActivity step={step} done={phase === "done"} />
          )}

          {phase === "done" && (
            <SummaryCard onDeploy={onDeploy} onOpen={() => setTab("preview")} onToast={onToast} />
          )}
        </div>

        <div className="shrink-0 border-t border-line-soft bg-[#0a0a0c] p-3">
          <div className="rounded-xl border border-white/[0.09] bg-[#111114] transition-colors focus-within:border-white/20">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder={
                phase === "building" ? "Bolt is working…" : replying ? "Bolt is typing…" : "Ask Bolt to make changes…"
              }
              className="scrollbar-thin block max-h-32 w-full resize-none bg-transparent px-3 pb-1 pt-2.5 text-[13px] leading-relaxed text-white placeholder:text-white/30 focus:outline-none"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-0.5">
                <IconButton label="Add context" onClick={() => onToast("Attachments — demo only")}>
                  <Plus className="size-4" />
                </IconButton>
                <button
                  onClick={() => onToast("Model selector — demo only")}
                  className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
                >
                  <Sparkles className="size-3 text-indigo-300/80" />
                  Sonnet 4.5
                  <ChevronDown className="size-2.5" />
                </button>
              </div>
              <button
                onClick={submit}
                disabled={!value.trim() || phase === "building" || replying}
                aria-label="Send message"
                className="grid size-7 place-items-center rounded-lg bg-white text-black transition hover:bg-white/90 disabled:bg-white/10 disabled:text-white/25"
              >
                <ArrowUp className="size-4" strokeWidth={2.6} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10.5px] text-white/25">
            Bolt can make mistakes. Always review the generated code.
          </p>
        </div>
      </aside>

      {/* ---------------- preview ---------------- */}
      <main
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col bg-[#0b0b0d] md:flex",
          mobileView === "chat" ? "hidden md:flex" : "flex",
        )}
      >
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-line-soft px-2.5">
          <div className="flex items-center rounded-lg bg-white/[0.05] p-0.5">
            <button
              onClick={() => setTab("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition",
                tab === "preview" ? "bg-white/[0.09] text-white shadow-sm" : "text-white/40 hover:text-white/70",
              )}
            >
              <Eye className="size-3.5" /> Preview
            </button>
            <button
              onClick={() => setTab("code")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition",
                tab === "code" ? "bg-white/[0.09] text-white shadow-sm" : "text-white/40 hover:text-white/70",
              )}
            >
              <Code2 className="size-3.5" /> Code
            </button>
          </div>

          <div className="mx-auto hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="flex h-7 w-full max-w-[380px] items-center gap-2 rounded-md border border-white/[0.06] bg-black/30 px-2.5">
              <Lock className="size-3 shrink-0 text-emerald-400/70" />
              <span className="truncate font-mono text-[11px] text-white/40">
                {projectName.toLowerCase().replace(/\s+/g, "-")}.bolt.host
              </span>
              <button
                onClick={() => onToast("Opening live preview — demo only")}
                className="ml-auto text-white/25 transition hover:text-white/70"
                aria-label="Open in new tab"
              >
                <ExternalLink className="size-3" />
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <div className="mr-1 hidden items-center rounded-md bg-white/[0.04] p-0.5 sm:flex">
              {(
                [
                  ["desktop", Monitor],
                  ["tablet", Tablet],
                  ["mobile", Smartphone],
                ] as const
              ).map(([key, Icon]) => (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  aria-label={key}
                  className={cn(
                    "grid size-6 place-items-center rounded transition",
                    device === key ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60",
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
            <IconButton label="Refresh preview" onClick={refresh}>
              <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
            </IconButton>
            <IconButton label="Fullscreen" onClick={() => onToast("Fullscreen — demo only")}>
              <Maximize2 className="size-3.5" />
            </IconButton>
            <button
              onClick={onShare}
              className="ml-1 hidden h-7 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-[11.5px] font-medium text-white/65 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              Share
            </button>
            <button
              onClick={onDeploy}
              className="ml-1 h-7 rounded-md bg-white px-2.5 text-[11.5px] font-semibold text-black transition hover:bg-white/90"
            >
              Deploy
            </button>
          </div>
        </div>

        {phase === "building" && (
          <div className="relative h-px w-full overflow-hidden bg-white/[0.06]">
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            />
          </div>
        )}

        <div className="preview-frame relative min-h-0 flex-1 overflow-hidden">
          {tab === "code" ? (
            <CodeView />
          ) : phase === "building" ? (
            <BuildingPreview step={step} />
          ) : (
            <div className="flex h-full w-full items-start justify-center overflow-hidden p-0 lg:p-4">
              <div
                className={cn(
                  "relative h-full overflow-hidden bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-[width,max-width] duration-500 ease-out",
                  device === "desktop" && "w-full",
                  device === "tablet" && "w-full max-w-[820px] rounded-xl border border-white/10",
                  device === "mobile" && "w-full max-w-[390px] rounded-xl border border-white/10",
                )}
              >
                <iframe
                  key={previewKey}
                  title="Project preview"
                  src="/demo/index.html"
                  className="h-full w-full border-0 bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* mobile switcher */}
      <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center md:hidden">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/70 p-1 backdrop-blur-xl">
          <button
            onClick={() => setMobileView("chat")}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition",
              mobileView === "chat" ? "bg-white text-black" : "text-white/55",
            )}
          >
            Chat
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition",
              mobileView === "preview" ? "bg-white text-black" : "text-white/55",
            )}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function BuildActivity({ step, done }: { step: number; done: boolean }) {
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    if (done) setExpanded(false);
  }, [done]);

  const pct = Math.min(100, Math.round((step / BUILD_STEPS.length) * 100));

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101013]">
      <button
        onClick={() => done && setExpanded((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 px-3 py-2.5 text-left",
          done && "transition hover:bg-white/[0.03]",
        )}
      >
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-md",
            done ? "bg-emerald-400/10 text-emerald-400" : "bg-indigo-400/10 text-indigo-300",
          )}
        >
          {done ? <Check className="size-3.5" strokeWidth={3} /> : <Spinner className="size-3.5" />}
        </span>
        <span className="flex-1">
          <span className="block text-[12.5px] font-medium text-white/85">
            {done ? "Build complete" : "Building your app"}
          </span>
          <span className="block text-[11px] text-white/35">
            {done ? "6 steps · 38s · 1,284 tokens" : BUILD_STEPS[Math.min(step, BUILD_STEPS.length - 1)]?.label}
          </span>
        </span>
        {done ? (
          <ChevronDown
            className={cn("size-3.5 text-white/30 transition-transform", expanded && "rotate-180")}
          />
        ) : (
          <span className="font-mono text-[10px] text-white/30">{pct}%</span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 border-t border-white/[0.06] px-2 py-2">
              {BUILD_STEPS.map((s, i) => {
                const state = i < step ? "done" : i === step && !done ? "active" : "pending";
                return (
                  <div key={s.label} className="flex items-start gap-2.5 rounded-md px-1.5 py-1.5">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center">
                      {state === "done" ? (
                        <CheckCircle2 className="size-3.5 text-emerald-400/80" />
                      ) : state === "active" ? (
                        <Loader2 className="size-3.5 animate-spin text-indigo-300" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-white/15" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-[11.5px] leading-tight",
                          state === "pending" ? "text-white/25" : "text-white/70",
                        )}
                      >
                        {s.label}
                      </p>
                      {s.file ? (
                        <p className="mt-0.5 flex items-center gap-1 truncate font-mono text-[10px] text-white/25">
                          <FileCode2 className="size-2.5 shrink-0" />
                          {s.file}
                          <span className="text-emerald-400/60">+{s.additions}</span>
                        </p>
                      ) : (
                        <p className="mt-0.5 truncate text-[10px] text-white/25">{s.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!done && (
        <div className="h-0.5 w-full bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  onDeploy,
  onOpen,
  onToast,
}: {
  onDeploy: () => void;
  onOpen: () => void;
  onToast: (m: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#121216] to-[#0e0e11]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
        <BoltMark size={20} />
        <span className="text-[12px] font-medium text-white/80">HabitFlow is ready</span>
        <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          Live
        </span>
      </div>
      <div className="space-y-3 p-3.5">
        <p className="text-[12.5px] leading-relaxed text-white/55">
          I built a complete habit tracker with daily check-ins, streak tracking, a
          weekly activity chart and local-first persistence. Try adding a habit or
          checking one off — the preview is fully interactive.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["React 19", "TypeScript", "Tailwind 4", "localStorage"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-white/40"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={onOpen}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-[12px] font-semibold text-black transition hover:bg-white/90"
          >
            <Eye className="size-3.5" /> Open preview
          </button>
          <button
            onClick={onDeploy}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[12px] font-medium text-white/75 transition hover:bg-white/[0.06]"
          >
            <Terminal className="size-3.5" /> Deploy
          </button>
          <IconButton label="Copy summary" onClick={() => onToast("Summary copied to clipboard")}>
            <Copy className="size-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function BuildingPreview({ step }: { step: number }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0e0e11] shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
            <span className="size-2 rounded-full bg-white/10" />
            <span className="size-2 rounded-full bg-white/10" />
            <span className="size-2 rounded-full bg-white/10" />
            <span className="ml-2 font-mono text-[10px] text-white/25">localhost:5173</span>
          </div>
          <div className="space-y-2.5 p-4">
            {[92, 64, 78, 48, 86, 56, 70].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/15">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="h-2 rounded-full bg-gradient-to-r from-white/[0.09] via-white/[0.16] to-white/[0.09] bg-[length:200%_100%] animate-shimmer"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-white/40">
          <Spinner className="size-3.5" />
          {BUILD_STEPS[Math.min(step, BUILD_STEPS.length - 1)]?.label ?? "Starting build"}…
        </div>
        <p className="mt-1 text-center text-[11px] text-white/20">
          Your app will appear here in a few seconds
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- code ------------------------------ */

const KEYWORDS =
  "import|from|export|default|function|return|const|let|var|if|else|for|while|type|interface|new|async|await|try|catch|finally|throw|extends|implements|class|of|in|as|typeof|instanceof|null|undefined|true|false|void|this|super|useState|useEffect";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string) {
  const re = new RegExp(
    `(\\/\\/[^\\n]*)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|\\b(${KEYWORDS})\\b|\\b(\\d+(?:\\.\\d+)?)\\b`,
    "g",
  );
  return escapeHtml(code).replace(re, (m, comment, str, kw, num) => {
    if (comment) return `<span class="text-[#5c6370] italic">${m}</span>`;
    if (str) return `<span class="text-[#98c379]">${m}</span>`;
    if (kw) return `<span class="text-[#c678dd]">${m}</span>`;
    if (num) return `<span class="text-[#d19a66]">${m}</span>`;
    return m;
  });
}

const EXT_ICON = {
  tsx: FileCode2,
  ts: FileCode2,
  css: FileText,
  json: FileJson,
  md: FileText,
};

function CodeView() {
  const [selected, setSelected] = useState(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const lines = selected.code.split("\n");

  function copy() {
    navigator.clipboard?.writeText(selected.code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="hidden w-56 shrink-0 flex-col border-r border-line-soft bg-[#0a0a0c] sm:flex">
        <div className="flex h-9 items-center gap-2 border-b border-line-soft px-3 text-[10px] font-medium uppercase tracking-wider text-white/30">
          <Terminal className="size-3" /> Files
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto p-1.5">
          <div className="mb-1 flex items-center gap-1.5 px-2 py-1 text-[11px] text-white/35">
            <ChevronDown className="size-3" /> src
          </div>
          {PROJECT_FILES.filter((f) => f.path.startsWith("src/")).map((f) => {
            const Icon = EXT_ICON[f.lang];
            const active = selected.path === f.path;
            return (
              <button
                key={f.path}
                onClick={() => setSelected(f)}
                className={cn(
                  "mb-0.5 flex w-full items-center gap-2 rounded-md py-1.5 pl-6 pr-2 text-left font-mono text-[11px] transition",
                  active ? "bg-white/[0.08] text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white/75",
                )}
              >
                <Icon className={cn("size-3.5 shrink-0", active ? "text-indigo-300" : "text-white/25")} />
                <span className="truncate">{f.path.split("/").pop()}</span>
              </button>
            );
          })}
          {PROJECT_FILES.filter((f) => !f.path.startsWith("src/")).map((f) => {
            const Icon = EXT_ICON[f.lang];
            const active = selected.path === f.path;
            return (
              <button
                key={f.path}
                onClick={() => setSelected(f)}
                className={cn(
                  "mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[11px] transition",
                  active ? "bg-white/[0.08] text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white/75",
                )}
              >
                <Icon className={cn("size-3.5 shrink-0", active ? "text-indigo-300" : "text-white/25")} />
                <span className="truncate">{f.path}</span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-line-soft p-2">
          <div className="flex items-center gap-1.5 rounded-md bg-emerald-400/[0.06] px-2 py-1.5 text-[10.5px] text-emerald-300/80">
            <CheckCircle2 className="size-3" /> All checks passing
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-[#0c0c0f]">
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-line-soft px-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
            {selected.path.split("/").map((part, i, arr) => (
              <span key={part} className="flex items-center gap-2">
                <span className={i === arr.length - 1 ? "text-white/80" : ""}>{part}</span>
                {i < arr.length - 1 && <span className="text-white/15">/</span>}
              </span>
            ))}
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10.5px] text-white/35 transition hover:bg-white/[0.06] hover:text-white/70"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-auto">
          <div className="flex min-w-full">
            <div className="shrink-0 select-none border-r border-white/[0.04] bg-black/20 py-3 text-right font-mono text-[11px] leading-5 text-white/15">
              {lines.map((_, i) => (
                <div key={i} className="px-3">{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 py-3 pl-4 pr-6 font-mono text-[11.5px] leading-5 text-[#abb2bf]">
              <code
                dangerouslySetInnerHTML={{
                  __html:
                    selected.lang === "md" || selected.lang === "json"
                      ? escapeHtml(selected.code)
                      : highlight(selected.code),
                }}
              />
            </pre>
          </div>
        </div>

        <div className="flex h-6 shrink-0 items-center gap-4 border-t border-line-soft bg-[#0a0a0c] px-3 font-mono text-[10px] text-white/30">
          <span className="flex items-center gap-1 text-emerald-400/70">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Ready
          </span>
          <span>{lines.length} lines</span>
          <span>UTF-8</span>
          <span className="ml-auto">{selected.lang.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
