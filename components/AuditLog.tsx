"use client";

import { actorLabel, ui } from "@/lib/copy";
import type { AuditEntry } from "@/lib/mock-deal";
import { useLang } from "./LangProvider";
import { Chip, Panel } from "./ui";

export function AuditLog({ entries }: { entries: readonly AuditEntry[] }) {
  const { tr } = useLang();

  return (
    <Panel title={tr(ui.dealFlow.audit)} meta={`${entries.length}`}>
      {entries.length === 0 ? (
        <p className="text-xs text-muted">{tr(ui.dealFlow.auditEmpty)}</p>
      ) : (
        <ol className="relative space-y-4 border-l border-line pl-4">
          {entries.map((entry, index) => (
            <li key={entry.id} className="relative animate-fade-up">
              <span
                aria-hidden="true"
                className="absolute -left-5 top-1.5 h-2 w-2 rounded-full border border-accent/50 bg-accent/30"
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip tone={entry.actor === "reviewer" ? "accent" : "muted"}>
                  {tr(actorLabel[entry.actor])}
                </Chip>
                <span className="font-mono text-[10px] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium">{tr(entry.action)}</p>
              <p className="text-[11px] leading-relaxed text-muted">{tr(entry.detail)}</p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
