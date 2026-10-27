"use client";

import { ui } from "@/lib/copy";
import { useLang } from "./LangProvider";
import {
  AlertIcon,
  HashIcon,
  IconTile,
  LockIcon,
  Panel,
  SectionHeading,
  ShieldIcon,
  SparkIcon,
  TruckIcon,
  UserIcon,
} from "./ui";

export function TrustTab() {
  const { tr } = useLang();
  const icons = [ShieldIcon, LockIcon, TruckIcon, UserIcon, HashIcon, SparkIcon];

  return (
    <div className="space-y-6">
      <SectionHeading title={tr(ui.trust.title)} lede={tr(ui.trust.lede)} />

      <div className="grid gap-3 sm:grid-cols-2">
        {ui.trust.pillars.map((pillar, index) => {
          const Icon = icons[index] ?? ShieldIcon;
          return (
            <div key={pillar.title.en} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start gap-3">
                <IconTile tone="accent">
                  <Icon className="h-4 w-4" />
                </IconTile>
                <div>
                  <h3 className="text-sm font-semibold leading-snug">{tr(pillar.title)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{tr(pillar.body)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Panel
        title={
          <span className="flex items-center gap-2">
            <AlertIcon className="h-4 w-4 text-accent" />
            {tr(ui.trust.limitsTitle)}
          </span>
        }
        className="border-accent/30 bg-accent/5"
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {ui.trust.limits.map((limit) => (
            <li key={limit.en} className="flex items-center gap-2 text-xs font-medium">
              <span
                aria-hidden="true"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {tr(limit)}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-accent/20 pt-3 text-[11px] leading-relaxed text-muted">
          {tr(ui.trust.limitsNote)}
        </p>
      </Panel>
    </div>
  );
}
