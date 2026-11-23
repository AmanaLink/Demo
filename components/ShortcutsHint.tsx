"use client";

import { useEffect, useState } from "react";
import { cx } from "./ui";
import { XIcon } from "./ui";

const SHORTCUTS = [
  { keys: ["←", "→"], action: "Previous / Next slide" },
  { keys: ["Home", "End"], action: "First / Last slide" },
  { keys: ["F"], action: "Toggle fullscreen" },
  { keys: ["?"], action: "Show / Hide this help" },
] as const;

export function ShortcutsHint() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show on first load
    const seen = sessionStorage.getItem("shortcuts-seen");
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem("shortcuts-seen", "true");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "?" || (event.key === "/" && !event.ctrlKey && !event.metaKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted]);

  if (!open) return null;

  return (
    <div
      className={cx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
        !mounted && "hidden"
      )}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label="Keyboard Shortcuts"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">Keyboard Shortcuts</h3>
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-lg p-1.5 text-muted hover:text-ink transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <dl className="mt-4 space-y-3">
          {SHORTCUTS.map(({ keys, action }) => (
            <div key={action} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {keys.map((key, i) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center min-w-[2rem] h-6 rounded border border-line bg-surface-2 px-2 text-[11px] font-mono text-ink"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <dd className="text-sm text-muted">{action}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[11px] text-center text-muted">
          Press <kbd className="inline-flex items-center justify-center min-w-[2rem] h-5 rounded border border-line bg-surface-2 px-1.5 text-[10px] font-mono text-ink">?</kbd> to toggle
        </p>
      </div>
    </div>
  );
}