import { useEffect, useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function BoltMark({ size = 30, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-[9px] bg-gradient-to-b from-[#232329] to-[#101013] ring-1 ring-white/15",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-x-0 top-0 h-px bg-white/25"
        aria-hidden
      />
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" aria-hidden>
        <defs>
          <linearGradient id={`bolt-${id}`} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#c7c7d1" />
          </linearGradient>
        </defs>
        <path
          d="M13.7 2 5 13.4h5.3L9.2 22 19 9.9h-5.4L13.7 2Z"
          fill={`url(#bolt-${id})`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BoltMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
        bolt<span className="text-white/45">.new</span>
      </span>
    </span>
  );
}

export function IconButton({
  children,
  label,
  onClick,
  active,
  className,
  disabled,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "focus-ring grid size-8 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 disabled:pointer-events-none disabled:opacity-40",
        active && "bg-white/10 text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/45">
      {children}
    </kbd>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.18" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  children,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]",
              width,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="focus-ring absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1a1a1f] px-4 py-2 text-[13px] text-white/85 shadow-2xl">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Avatar({ name = "Alex", size = 28 }: { name?: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f4c07a] to-[#c97b4a] font-semibold text-[#231305] ring-1 ring-white/15"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
