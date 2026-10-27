"use client";

import type { DeliveryPath } from "@/lib/deal-machine";
import { pathLabel, ui } from "@/lib/copy";
import { evidenceByPath } from "@/lib/mock-deal";
import { useLang } from "./LangProvider";
import {
  ArrowRightIcon,
  Chip,
  IconTile,
  Meter,
  Panel,
  SectionHeading,
  StoreIcon,
  TruckIcon,
  button,
  cx,
} from "./ui";

type RowKey = keyof typeof ui.delivery.rows;

const ROW_KEYS: readonly RowKey[] = [
  "whoCarries",
  "liability",
  "tracking",
  "proof",
  "evidence",
  "release",
  "bestFor",
];

function PathCard({ path }: { path: DeliveryPath }) {
  const { tr } = useLang();
  const profile = evidenceByPath[path];
  const values = path === "platform" ? ui.delivery.platformValues : ui.delivery.ownValues;
  const Icon = path === "platform" ? TruckIcon : StoreIcon;

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2.5">
        <IconTile tone="accent">
          <Icon className="h-4 w-4" />
        </IconTile>
        <h3 className="text-sm font-semibold">{tr(pathLabel[path])}</h3>
        <Chip tone={path === "platform" ? "accent" : "muted"} className="ml-auto">
          {tr(
            profile.strength === "strong"
              ? ui.dealFlow.evidenceStrong
              : ui.dealFlow.evidenceModerate,
          )}
        </Chip>
      </div>

      <div className="mt-3">
        <Meter value={profile.score} total={profile.total} label={tr(ui.dealFlow.evidence)} />
      </div>

      <dl className="mt-4 divide-y divide-line text-xs">
        {ROW_KEYS.map((key) => (
          <div key={key} className="grid grid-cols-[38%_62%] gap-2 py-2">
            <dt className="text-muted">{tr(ui.delivery.rows[key])}</dt>
            <dd className="leading-relaxed">{tr(values[key])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function DeliveryTab({ onWalk }: { onWalk: () => void }) {
  const { tr } = useLang();

  return (
    <div className="space-y-6">
      <SectionHeading title={tr(ui.delivery.title)} lede={tr(ui.delivery.lede)} />

      <div className="grid gap-4 lg:grid-cols-2">
        <PathCard path="platform" />
        <PathCard path="own" />
      </div>

      <Panel>
        <div className="flex items-start gap-3">
          <IconTile tone="accent">
            <StoreIcon className="h-4 w-4" />
          </IconTile>
          <div>
            <h3 className="text-sm font-semibold">{tr(ui.delivery.calloutTitle)}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">{tr(ui.delivery.callout)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onWalk}
          className={cx(button.base, button.secondary, "mt-4")}
        >
          {tr(ui.common.seeInFlow)}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </Panel>
    </div>
  );
}
