"use client";

import { ui } from "@/lib/copy";
import { useLang } from "./LangProvider";
import {
  ArrowRightIcon,
  ChatIcon,
  CheckIcon,
  Chip,
  IconTile,
  Panel,
  SectionHeading,
  SparkIcon,
} from "./ui";

export function DisputesTab() {
  const { tr } = useLang();
  const outcomeIcons = [ArrowRightIcon, CheckIcon, ChatIcon];

  return (
    <div className="space-y-6">
      <SectionHeading title={tr(ui.disputes.title)} lede={tr(ui.disputes.lede)} />

      <div className="grid gap-3 sm:grid-cols-3">
        {ui.disputes.outcomes.map((outcome, index) => {
          const Icon = outcomeIcons[index] ?? CheckIcon;
          return (
            <div key={outcome.title.en} className="rounded-2xl border border-line bg-surface p-4">
              <IconTile tone="accent">
                <Icon className="h-4 w-4" />
              </IconTile>
              <h3 className="mt-3 text-sm font-semibold">{tr(outcome.title)}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{tr(outcome.body)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <Panel title={tr(ui.disputes.seesTitle)}>
          <ul className="space-y-2.5">
            {ui.disputes.sees.map((item) => (
              <li key={item.en} className="flex gap-2 text-xs leading-relaxed">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                {tr(item)}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={tr(ui.disputes.aiTitle)}
          action={
            <Chip tone="accent">
              <SparkIcon className="h-3 w-3" />
              AI
            </Chip>
          }
        >
          <p className="text-xs leading-relaxed text-muted">{tr(ui.disputes.aiBody)}</p>
          <p className="mt-4 rounded-xl border border-dashed border-line px-3 py-2 text-[11px] leading-relaxed text-muted">
            {tr(ui.disputes.window)}
          </p>
        </Panel>
      </div>

      <Panel title={tr(ui.disputes.caseTitle)} meta={<Chip>{tr(ui.common.mock)}</Chip>}>
        <p className="text-sm leading-relaxed text-muted">{tr(ui.disputes.caseBody)}</p>

        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
          {ui.disputes.caseSteps.map((step, index) => (
            <li key={step.en} className="rounded-xl border border-line bg-surface-2 p-3">
              <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
              <p className="mt-1 text-xs font-medium">{tr(step)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-3 rounded-xl border border-accent/25 bg-accent/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            {tr(ui.disputes.decision)}
          </p>
          <p className="mt-0.5 text-sm font-medium">{tr(ui.disputes.decisionValue)}</p>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-line p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {tr(ui.disputes.advisory)}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            {tr(ui.disputes.advisoryValue)}
          </p>
        </div>
      </Panel>
    </div>
  );
}
