"use client";

import { ui } from "@/lib/copy";
import { useLang } from "./LangProvider";
import { CheckIcon, Chip, SectionHeading } from "./ui";

export function RoadmapTab() {
  const { tr } = useLang();

  return (
    <div className="space-y-6">
      <SectionHeading
        title={tr(ui.roadmap.title)}
        lede={tr(ui.roadmap.lede)}
        aside={<Chip tone="outline">{tr(ui.roadmap.timeline)}</Chip>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {ui.roadmap.phases.map((phase, index) => (
          <section
            key={phase.title.en}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <Chip tone={index === 0 ? "accent" : "muted"}>
                <span className="font-mono">0{index + 1}</span>
              </Chip>
              <span className="text-[10px] uppercase tracking-wide text-muted">
                {tr(ui.roadmap.timeline)}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{tr(phase.title)}</h3>
            <ul className="mt-3 space-y-2">
              {phase.items.map((item) => (
                <li key={item.en} className="flex gap-2 text-xs leading-relaxed">
                  {index === 0 ? (
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                      <CheckIcon className="h-2.5 w-2.5" />
                    </span>
                  ) : (
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted" />
                    </span>
                  )}
                  {tr(item)}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
