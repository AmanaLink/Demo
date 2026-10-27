"use client";

import { useEffect } from "react";
import { ui } from "@/lib/copy";
import { TABS } from "@/lib/tabs";
import { useHashTab } from "@/lib/useHashTab";
import { DealFlowTab } from "./DealFlowTab";
import { DeliveryTab } from "./DeliveryTab";
import { DisputesTab } from "./DisputesTab";
import { LangToggle } from "./LangToggle";
import { OverviewTab } from "./OverviewTab";
import { RoadmapTab } from "./RoadmapTab";
import { Tabs } from "./Tabs";
import { ThemeToggle } from "./ThemeToggle";
import { TrustTab } from "./TrustTab";
import { useLang } from "./LangProvider";
import { ShieldIcon } from "./ui";

export function DemoApp() {
  const { tr } = useLang();
  const { tab, go } = useHashTab();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      const current = TABS.findIndex((item) => item.id === tab);
      let next: number | null = null;
      if (event.key === "ArrowRight") next = (current + 1) % TABS.length;
      else if (event.key === "ArrowLeft") next = (current - 1 + TABS.length) % TABS.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = TABS.length - 1;

      if (next === null) return;
      event.preventDefault();
      go(TABS[next].id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, go]);

  const panel =
    tab === "overview" ? (
      <OverviewTab onWalk={() => go("deal-flow")} onRules={() => go("trust")} />
    ) : tab === "deal-flow" ? (
      <DealFlowTab />
    ) : tab === "disputes" ? (
      <DisputesTab />
    ) : tab === "delivery" ? (
      <DeliveryTab onWalk={() => go("deal-flow")} />
    ) : tab === "trust" ? (
      <TrustTab />
    ) : (
      <RoadmapTab />
    );

  return (
    <>
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:border focus:border-line focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        {tr(ui.skip)}
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="border-b border-accent/15 bg-accent/10">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-[11px] sm:px-6">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="shrink-0 font-semibold text-accent">{tr(ui.bannerTag)}</span>
            <span className="truncate text-muted">· {tr(ui.bannerRest)}</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <a href="#overview" className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-ink">
              <ShieldIcon className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">{ui.brand}</span>
            <span className="hidden truncate text-[11px] text-muted md:inline">
              · {tr(ui.brandTagline)}
            </span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Tabs active={tab} onChange={go} />
        </div>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6 outline-none sm:px-6"
      >
        <section
          key={tab}
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="animate-fade-up"
        >
          {panel}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-2xl leading-relaxed">{tr(ui.footer.note)}</p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span>{tr(ui.footer.built)}</span>
            <a
              href="https://github.com/AmanaLink/Demo"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-ink"
            >
              {tr(ui.footer.repo)}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
