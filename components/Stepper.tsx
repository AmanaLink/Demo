"use client";

import { HAPPY_PATH, type DealState } from "@/lib/deal-machine";
import { stateLabel, ui } from "@/lib/copy";
import { useLang } from "./LangProvider";
import { CheckIcon, cx } from "./ui";

type HappyState = (typeof HAPPY_PATH)[number];

const isHappyState = (state: DealState): state is HappyState =>
  (HAPPY_PATH as readonly DealState[]).includes(state);

export function Stepper({ state, trail }: { state: DealState; trail: readonly DealState[] }) {
  const { tr } = useLang();
  const disputed = trail.includes("DISPUTED");

  const current: HappyState = isHappyState(state)
    ? state
    : [...trail].reverse().find(isHappyState) ?? "CREATED";
  const index = HAPPY_PATH.indexOf(current);
  const finished = state === "RELEASED";

  return (
    <div>
      <ol className="flex items-start gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HAPPY_PATH.map((step, position) => {
          const done = position < index || (finished && position === index);
          const active = position === index && !finished;
          return (
            <li
              key={step}
              aria-current={active ? "step" : undefined}
              className="flex shrink-0 items-start gap-1.5"
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                    done && "border-accent bg-accent text-accent-ink",
                    active && "border-accent bg-accent/10 text-accent",
                    !done && !active && "border-line bg-surface text-muted",
                  )}
                >
                  {done ? <CheckIcon className="h-3 w-3" /> : position + 1}
                </span>
                <span
                  className={cx(
                    "whitespace-nowrap text-[10px] leading-none",
                    active ? "font-medium text-ink" : "text-muted",
                  )}
                >
                  {tr(stateLabel[step])}
                </span>
              </div>
              {position < HAPPY_PATH.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cx(
                    "mt-3 h-px w-4 sm:w-7",
                    position < index ? "bg-accent/50" : "bg-line",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {disputed && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-line px-3 py-2 text-[11px]">
          <span className="font-medium text-muted">{tr(ui.dealFlow.disputeBranch)}</span>
          <span
            className={cx(
              "rounded-full border px-2 py-0.5",
              state === "DISPUTED"
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-line text-muted",
            )}
          >
            {tr(stateLabel.DISPUTED)}
          </span>
          <span className="text-muted">→</span>
          {state === "REFUNDED" && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">
              {tr(stateLabel.REFUNDED)}
            </span>
          )}
          {state === "RELEASED" && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">
              {tr(stateLabel.RELEASED)}
            </span>
          )}
          {state === "DISPUTED" && (
            <span className="text-muted">
              {tr(stateLabel.REFUNDED)} / {tr(stateLabel.RELEASED)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
