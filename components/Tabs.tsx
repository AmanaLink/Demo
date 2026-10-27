"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import { TABS, type TabId } from "@/lib/tabs";
import { useLang } from "./LangProvider";
import { cx } from "./ui";

export function Tabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const { tr } = useLang();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const index = TABS.findIndex((tab) => tab.id === active);
    refs.current[index]?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    if (next === null) return;

    event.preventDefault();
    event.stopPropagation();
    onChange(TABS[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Sections"
      className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((tab, index) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cx(
              "relative shrink-0 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              selected ? "font-medium text-ink" : "text-muted hover:text-ink",
            )}
          >
            {tr(tab.label)}
            <span
              aria-hidden="true"
              className={cx(
                "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent transition-opacity",
                selected ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
