import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  ExternalLink,
  GitBranch,
  LogOut,
  Menu,
  Rocket,
  Settings,
  Share2,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Home from "./components/Home";
import Workspace from "./components/Workspace";
import { Avatar, Modal, Toast, Wordmark, cn } from "./components/ui";
import { BUILD_STEPS } from "./data";
import type { Msg, Phase, Tab } from "./types";

const NAV = ["Solutions", "Resources", "Careers", "Pricing"];

export default function App() {
  const [view, setView] = useState<"home" | "workspace">("home");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<Tab>("preview");
  const [replying, setReplying] = useState(false);
  const [projectName] = useState("HabitFlow");
  const [deployOpen, setDeployOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const buildCount = useRef(0);

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (phase !== "building") return;
    const timers: number[] = [];
    BUILD_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), 680 * (i + 1)));
    });
    timers.push(
      window.setTimeout(() => {
        setPhase("done");
      }, 680 * BUILD_STEPS.length + 1000),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, buildCount.current]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (view === "home") document.getElementById("hero-prompt")?.focus();
        else document.getElementById("chat-composer")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  function startBuild(prompt: string) {
    buildCount.current += 1;
    setMessages([{ id: crypto.randomUUID(), role: "user", text: prompt }]);
    setPhase("building");
    setStep(0);
    setReplying(false);
    setTab("preview");
    setView("workspace");
  }

  function send(text: string) {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setReplying(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Done — I updated the preview. I also tightened the spacing on mobile and added a subtle animation when habits are completed. Want me to add weekly email reminders next?",
        },
      ]);
      setReplying(false);
    }, 1500);
  }

  function newChat() {
    setView("home");
    setMessages([]);
    setPhase("idle");
    setStep(0);
    setReplying(false);
  }

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(label);
  }

  return (
    <div className="min-h-dvh bg-ink">
      <header
        className={cn(
          "relative sticky top-0 z-40 bg-[#111114]",
          view === "home" ? "h-[68px]" : "h-[56px]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-full w-full items-center",
            view === "home" ? "max-w-[1248px] px-6" : "px-3 sm:px-4",
          )}
        >
        <button onClick={newChat} className="focus-ring rounded-lg" aria-label="Bolt home">
          <Wordmark />
        </button>

        {view === "home" ? (
          <>
            <nav className="absolute left-[calc(50%-2px)] hidden -translate-x-1/2 items-center gap-1 md:flex">
              {NAV.map((item) => (
                <button
                  key={item}
                  onClick={() => showToast(`${item} — demo only`)}
                  className="flex items-center gap-1 rounded px-3.5 py-2 text-[14px] font-medium text-white/75 transition hover:bg-white/[0.05] hover:text-white/90"
                >
                  {item}
                  {(item === "Solutions" || item === "Resources") && (
                    <ChevronDown className="size-3 text-white/45" strokeWidth={2} />
                  )}
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={() => showToast("Sign in — demo only")}
                className="hidden text-[14px] font-medium text-white/75 transition hover:text-white sm:block"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  document.getElementById("hero-prompt")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  window.setTimeout(() => document.getElementById("hero-prompt")?.focus(), 350);
                }}
                className="flex h-9 items-center rounded-md bg-[#1488fc] px-[13px] text-[14px] font-medium text-[#f9f6f9] transition hover:bg-[#3d9bff]"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileNav((v) => !v)}
                className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/[0.06] md:hidden"
                aria-label="Menu"
              >
                {mobileNav ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
            {mobileNav && (
              <div className="absolute inset-x-0 top-[68px] border-b border-white/10 bg-[#0c0c0f] p-2 md:hidden">
                {NAV.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMobileNav(false);
                      showToast(`${item} — demo only`);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-white/60 hover:bg-white/[0.05]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mx-2.5 h-4 w-px bg-white/10" />
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={() => showToast("Project settings — demo only")}
                className="flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-[12.5px] font-medium text-white/80 transition hover:bg-white/[0.06]"
              >
                <span className="grid size-5 place-items-center rounded bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
                  H
                </span>
                {projectName}
                <ChevronDown className="size-3 text-white/30" />
              </button>
              <span
                className={cn(
                  "hidden items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium sm:flex",
                  phase === "building"
                    ? "border-amber-400/20 bg-amber-400/[0.07] text-amber-300"
                    : phase === "done"
                      ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-white/40",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    phase === "building" ? "animate-pulse-dot bg-amber-400" : phase === "done" ? "bg-emerald-400" : "bg-white/30",
                  )}
                />
                {phase === "building" ? "Building" : phase === "done" ? "Ready" : "Draft"}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <div className="mr-1 hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10.5px] text-white/40 lg:flex">
                <Sparkles className="size-3 text-indigo-300" />
                1,284 tokens
              </div>
              <button
                onClick={() => setShareOpen(true)}
                className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] text-white/55 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Share2 className="size-3.5" /> <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setDeployOpen(true)}
                className="flex h-7 items-center gap-1.5 rounded-md bg-white px-2.5 text-[12px] font-semibold text-black transition hover:bg-white/90"
              >
                <Rocket className="size-3.5" /> <span className="hidden sm:inline">Deploy</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  className="focus-ring ml-0.5 rounded-full"
                >
                  <Avatar name="Alex" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-9 z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#151518] p-1.5 shadow-2xl">
                      <div className="border-b border-white/[0.06] px-2.5 pb-2 pt-1.5">
                        <p className="text-[12.5px] font-medium text-white/85">Alex Martin</p>
                        <p className="text-[11px] text-white/35">alex@bolt.new</p>
                      </div>
                      {[
                        { icon: User, label: "Account settings" },
                        { icon: Settings, label: "Preferences" },
                        { icon: CreditCard, label: "Plans & billing" },
                        { icon: GitBranch, label: "Connect GitHub" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setMenuOpen(false);
                            showToast(`${item.label} — demo only`);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <item.icon className="size-3.5 text-white/35" /> {item.label}
                        </button>
                      ))}
                      <div className="my-1 h-px bg-white/[0.06]" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          newChat();
                          showToast("Signed out — demo only");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <LogOut className="size-3.5 text-white/35" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </header>

      {view === "home" ? (
        <Home onBuild={startBuild} onToast={showToast} />
      ) : (
        <Workspace
          messages={messages}
          phase={phase}
          step={step}
          tab={tab}
          setTab={setTab}
          projectName={projectName}
          replying={replying}
          onSend={send}
          onNewChat={newChat}
          onDeploy={() => setDeployOpen(true)}
          onShare={() => setShareOpen(true)}
          onToast={showToast}
        />
      )}

      <Modal open={deployOpen} onClose={() => setDeployOpen(false)} width="max-w-lg">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
              <Rocket className="size-5" />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-white">Deployment successful</h2>
              <p className="text-[12px] text-white/40">Your app is live and ready to share.</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/30 p-3">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">Production URL</p>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white/75">
                https://habitflow-bolt-remake.vercel.app
              </span>
              <button
                onClick={() => copy("https://habitflow-bolt-remake.vercel.app", "Production URL copied")}
                className="grid size-7 shrink-0 place-items-center rounded-md border border-white/10 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Copy URL"
              >
                <Copy className="size-3.5" />
              </button>
              <button
                onClick={() => showToast("Opening production URL — demo only")}
                className="grid size-7 shrink-0 place-items-center rounded-md border border-white/10 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Open URL"
              >
                <ExternalLink className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["Build time", "38s"],
              ["Bundle size", "142 kB"],
              ["Region", "iad1"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <p className="text-[10px] text-white/30">{k}</p>
                <p className="mt-0.5 font-mono text-[12px] text-white/75">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setDeployOpen(false)}
              className="h-9 flex-1 rounded-lg bg-white text-[12.5px] font-semibold text-black transition hover:bg-white/90"
            >
              Done
            </button>
            <button
              onClick={() => copy("https://habitflow-bolt-remake.vercel.app", "Link copied to clipboard")}
              className="h-9 rounded-lg border border-white/10 px-4 text-[12.5px] font-medium text-white/75 transition hover:bg-white/[0.06]"
            >
              Copy link
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} width="max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <Share2 className="size-4 text-white/50" />
            <h2 className="text-[15px] font-semibold text-white">Share this project</h2>
          </div>
          <p className="mt-1 text-[12px] text-white/40">
            Anyone with the link can view and remix this project.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 p-2 pl-3">
            <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-white/60">
              https://bolt.new/~/habitflow
            </span>
            <button
              onClick={() => copy("https://bolt.new/~/habitflow", "Project link copied")}
              className="flex h-7 items-center gap-1.5 rounded-md bg-white px-2.5 text-[11.5px] font-semibold text-black"
            >
              <Copy className="size-3" /> Copy
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-white/10">
                <User className="size-3 text-white/60" />
              </span>
              <div>
                <p className="text-[12px] text-white/75">Public access</p>
                <p className="text-[10.5px] text-white/30">Visible to anyone with the link</p>
              </div>
            </div>
            <Check className="size-4 text-emerald-400" />
          </div>
          <button
            onClick={() => setShareOpen(false)}
            className="mt-5 h-9 w-full rounded-lg bg-white text-[12.5px] font-semibold text-black transition hover:bg-white/90"
          >
            Done
          </button>
        </div>
      </Modal>

      <Toast message={toast} />
    </div>
  );
}
