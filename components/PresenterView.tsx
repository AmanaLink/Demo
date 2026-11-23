"use client";

import { useEffect, useState } from "react";
import { TABS } from "@/lib/tabs";
import { useHashTab } from "@/lib/useHashTab";
import { useLang } from "./LangProvider";
import { cx } from "./ui";

export function PresenterView() {
  const { tab } = useHashTab();
  const { tr } = useLang();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currentIndex = TABS.findIndex((t) => t.id === tab);

  useEffect(() => {
    setMounted(true);
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!mounted || !isFullscreen) return null;

  const currentTab = TABS[currentIndex];
  const nextTab = TABS[(currentIndex + 1) % TABS.length];
  const prevTab = TABS[(currentIndex - 1 + TABS.length) % TABS.length];

  return (
    <aside
      className={cx(
        "fixed top-4 left-4 z-50 w-64 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md",
        "animate-slide-in-left"
      )}
      aria-label="Presenter View"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-accent uppercase tracking-wide">Presenter View</span>
        <span
          className="text-xs font-mono text-muted tabular-nums"
          aria-live="polite"
        >
          {currentIndex + 1} / {TABS.length}
        </span>
      </div>

      <h3 className="text-base font-semibold tracking-tight truncate">
        {tr(currentTab.label)}
      </h3>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
        <span className="flex-1 truncate">← {tr(prevTab.label)}</span>
        <span className="shrink-0 px-1.5 py-0.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-medium">
          Current
        </span>
        <span className="flex-1 truncate text-right">{tr(nextTab.label)} →</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-muted">
        <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-2">←</kbd>
        <span>/</span>
        <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-2">→</kbd>
        <span>Navigate ·</span>
        <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-2">F</kbd>
        <span>Exit Fullscreen</span>
      </div>
    </aside>
  );
}