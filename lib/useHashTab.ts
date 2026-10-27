"use client";

import { useCallback, useEffect, useState } from "react";
import { isTabId, type TabId } from "./tabs";

function tabFromHash(): TabId | null {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return isTabId(raw) ? raw : null;
}

/**
 * Tabs live in the URL hash so every panel is linkable and back/forward work.
 * Falls back to Overview for unknown hashes.
 */
export function useHashTab(): { tab: TabId; go: (next: TabId) => void } {
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    const sync = () => setTab(tabFromHash() ?? "overview");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = useCallback((next: TabId) => {
    setTab(next);
    if (window.location.hash !== `#${next}`) {
      window.location.hash = next;
    }
  }, []);

  return { tab, go };
}
