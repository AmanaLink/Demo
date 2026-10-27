"use client";

import type { DealState, DeliveryPath } from "@/lib/deal-machine";
import { ui } from "@/lib/copy";
import { evidenceByPath } from "@/lib/mock-deal";
import { useLang } from "./LangProvider";
import { CheckIcon, Chip, Meter, Panel, cx } from "./ui";

export function EvidencePanel({
  path,
  trail,
}: {
  path: DeliveryPath;
  trail: readonly DealState[];
}) {
  const { tr } = useLang();
  const profile = evidenceByPath[path];
  const strength =
    profile.strength === "strong" ? ui.dealFlow.evidenceStrong : ui.dealFlow.evidenceModerate;

  const items = profile.items.map((item) => ({
    ...item,
    collected: item.met && item.readyAt !== null && trail.includes(item.readyAt),
  }));
  const score = items.filter((item) => item.collected).length;

  return (
    <Panel
      title={tr(ui.dealFlow.evidence)}
      meta={`${score}/${profile.total}`}
      action={<Chip tone={path === "platform" ? "accent" : "muted"}>{tr(strength)}</Chip>}
    >
      <Meter value={score} total={profile.total} label={tr(ui.dealFlow.evidence)} />

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.label.en} className="flex gap-2">
            <span
              aria-hidden="true"
              className={cx(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                item.collected
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-dashed border-line text-transparent",
              )}
            >
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            <div>
              <p className={cx("text-xs font-medium", !item.collected && "text-muted")}>
                {tr(item.label)}
              </p>
              <p className="text-[11px] leading-relaxed text-muted">{tr(item.detail)}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
        {tr(profile.note)}
      </p>
    </Panel>
  );
}
