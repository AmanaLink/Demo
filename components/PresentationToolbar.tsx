"use client";

import { useEffect, useState } from "react";
import { TABS } from "@/lib/tabs";
import { useHashTab } from "@/lib/useHashTab";
import { button, cx } from "./ui";

export function PresentationToolbar() {
  const { tab, go } = useHashTab();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentIndex = TABS.findIndex((t) => t.id === tab);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  return (
    <aside
      aria-label="Presentation Controls"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-line bg-surface/90 px-3 py-2 shadow-2xl backdrop-blur-md"
    >
      <span className="text-xs font-medium text-muted px-2">
        Slide {currentIndex + 1} / {TABS.length}
      </span>

      <div className="h-4 w-px bg-line" />

      <button
        onClick={() => {
          const next = (currentIndex - 1 + TABS.length) % TABS.length;
          go(TABS[next].id);
        }}
        className={cx(button.base, button.ghost, "px-2.5 py-1 text-xs")}
        title="Previous Slide (ArrowLeft)"
      >
        ← Prev
      </button>

      <button
        onClick={() => {
          const next = (currentIndex + 1) % TABS.length;
          go(TABS[next].id);
        }}
        className={cx(button.base, button.ghost, "px-2.5 py-1 text-xs")}
        title="Next Slide (ArrowRight)"
      >
        Next →
      </button>

      <div className="h-4 w-px bg-line" />

      <button
        onClick={toggleFullscreen}
        className={cx(button.base, button.secondary, "px-2.5 py-1 text-xs")}
        title="Toggle Fullscreen"
      >
        {isFullscreen ? "Exit Fullscreen" : "Present ⛶"}
      </button>
    </aside>
  );
}
