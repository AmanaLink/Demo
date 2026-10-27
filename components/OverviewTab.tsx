"use client";

import { stateLabel, ui } from "@/lib/copy";
import { ORDER } from "@/lib/mock-deal";
import { useLang } from "./LangProvider";
import {
  ArrowRightIcon,
  Chip,
  IconTile,
  Panel,
  ShieldIcon,
  TruckIcon,
  UserIcon,
  button,
  cx,
} from "./ui";

export function OverviewTab({
  onWalk,
  onRules,
}: {
  onWalk: () => void;
  onRules: () => void;
}) {
  const { tr } = useLang();
  const principleIcons = [ShieldIcon, TruckIcon, UserIcon];

  return (
    <div className="space-y-8">
      <section className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {tr(ui.overview.eyebrow)}
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.7rem] lg:leading-[1.08]">
            {tr(ui.overview.title)}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
            {tr(ui.overview.lede)}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={onWalk} className={cx(button.base, button.primary)}>
              {tr(ui.common.walkFlow)}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={onRules} className={cx(button.base, button.secondary)}>
              {tr(ui.common.readRules)}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <Chip tone="accent">{tr(stateLabel.FUNDED)}</Chip>
            <span className="text-[10px] uppercase tracking-wide text-muted">
              {tr(ui.common.mock)}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">{ORDER.vendor}</p>
          <p className="text-xs text-muted">{tr(ORDER.item)}</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
            {ORDER.currency} {ORDER.amountKes.toLocaleString("en-US")}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted">
            {tr(ui.dealFlow.orderValue)}
          </p>

          <div className="mt-4 space-y-1.5 border-t border-line pt-4">
            {ui.overview.terms.map((term) => (
              <div key={term.en} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">{tr(term)}</span>
                <Chip tone="outline">{tr(ui.common.tbd)}</Chip>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-1.5 border-t border-line pt-4 text-[10px] leading-relaxed text-muted">
            <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            {tr(ui.phone.secureBanner)}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">{tr(ui.overview.principlesTitle)}</h2>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ui.overview.principles.map((principle, index) => {
            const Icon = principleIcons[index] ?? ShieldIcon;
            return (
              <div
                key={principle.title.en}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <IconTile tone="accent">
                  <Icon className="h-4 w-4" />
                </IconTile>
                <h3 className="mt-3 text-sm font-semibold leading-snug">
                  {tr(principle.title)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{tr(principle.body)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">{tr(ui.overview.moneyTitle)}</h2>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-4">
          {ui.overview.moneySteps.map((step, index) => (
            <li
              key={step.en}
              className="relative rounded-xl border border-line bg-surface-2 px-3 py-3"
            >
              <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
              <p className="mt-1 text-xs font-medium leading-snug">{tr(step)}</p>
              {index < ui.overview.moneySteps.length - 1 && (
                <ArrowRightIcon className="absolute -right-2.5 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-muted sm:block" />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">{tr(ui.overview.moneyNote)}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={tr(ui.overview.termsTitle)}>
          <div className="flex flex-wrap gap-2">
            {ui.overview.terms.map((term) => (
              <Chip key={term.en} tone="outline">
                {tr(term)}
                <span className="text-muted">· {tr(ui.common.tbd)}</span>
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            {tr(ui.overview.termsNote)}
          </p>
        </Panel>

        <Panel title={tr(ui.overview.notTitle)}>
          <ul className="space-y-2 text-xs leading-relaxed text-muted">
            {ui.overview.notItems.map((item) => (
              <li key={item.en} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {tr(item)}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
