"use client";

import { useMemo, useState } from "react";
import {
  HAPPY_PATH,
  allowedTransitions,
  applyEvent,
  primaryTransition,
  type DealContext,
  type DealEvent,
  type DealState,
  type DeliveryPath,
} from "@/lib/deal-machine";
import { actorLabel, guardCopy, pathLabel, stateLabel, ui } from "@/lib/copy";
import type { Localized } from "@/lib/i18n";
import {
  DEFAULT_TRACKING_REF,
  ORDER,
  auditForStep,
  chatForStep,
  ledgerForTrail,
} from "@/lib/mock-deal";
import { AuditLog } from "./AuditLog";
import { EvidencePanel } from "./EvidencePanel";
import { LedgerPanel } from "./LedgerPanel";
import { PhoneMockup } from "./PhoneMockup";
import { Stepper } from "./Stepper";
import { useLang } from "./LangProvider";
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatIcon,
  Chip,
  LockIcon,
  Panel,
  ResetIcon,
  SectionHeading,
  button,
  cx,
} from "./ui";

const PATHS: readonly DeliveryPath[] = ["platform", "own"];

export function DealFlowTab() {
  const { tr } = useLang();

  const [path, setPath] = useState<DeliveryPath>("platform");
  const [trackingRef, setTrackingRef] = useState(DEFAULT_TRACKING_REF);
  const [liabilitySigned, setLiabilitySigned] = useState(true);
  const [trail, setTrail] = useState<readonly DealState[]>(["CREATED"]);
  const [notice, setNotice] = useState<Localized | null>(null);

  const state = trail[trail.length - 1];
  const context: DealContext = { deliveryPath: path, trackingRef, liabilitySigned };

  const primary = primaryTransition(state, context);
  const next = primary?.guard.ok ? primary.transition : null;
  const blockedCode = primary && !primary.guard.ok ? primary.guard.code : null;

  const disputed = trail.includes("DISPUTED");
  const terminal = state === "RELEASED" || state === "REFUNDED";
  const decisions = state === "DISPUTED" ? allowedTransitions(state, context) : [];
  const canReport = allowedTransitions(state, context).some(
    (entry) => entry.transition.event === "OPEN_DISPUTE",
  );

  const messages = useMemo(
    () =>
      trail.flatMap((step) =>
        chatForStep(step, path, { fromDispute: step === "RELEASED" && disputed }),
      ),
    [trail, path, disputed],
  );

  const audit = useMemo(
    () =>
      trail.flatMap((step) =>
        auditForStep(step, path, { fromDispute: step === "RELEASED" && disputed }),
      ),
    [trail, path, disputed],
  );

  const chain = useMemo(() => ledgerForTrail(trail), [trail]);

  function fire(event: DealEvent) {
    const result = applyEvent(state, event, context);
    if (!result.ok) {
      setNotice(guardCopy[result.code]);
      return;
    }
    setNotice(null);
    setTrail((previous) => [...previous, result.state]);
  }

  function reset() {
    setTrail(["CREATED"]);
    setTrackingRef(DEFAULT_TRACKING_REF);
    setLiabilitySigned(true);
    setNotice(null);
  }

  function changePath(nextPath: DeliveryPath) {
    if (nextPath === path) return;
    setPath(nextPath);
    setTrail(["CREATED"]);
    setNotice(null);
  }

  const stepNumber =
    HAPPY_PATH.indexOf(
      ([...trail].reverse().find((step) =>
        (HAPPY_PATH as readonly DealState[]).includes(step),
      ) ?? "CREATED") as (typeof HAPPY_PATH)[number],
    ) + 1;

  return (
    <div className="space-y-6">
      <SectionHeading
        title={tr(ui.dealFlow.title)}
        lede={tr(ui.dealFlow.lede)}
        aside={
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {tr(ui.dealFlow.path)}
            </span>
            <div className="flex rounded-xl border border-line bg-surface-2 p-0.5">
              {PATHS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={path === option}
                  onClick={() => changePath(option)}
                  className={cx(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    path === option
                      ? "bg-surface text-ink shadow-sm"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {tr(pathLabel[option])}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-muted">{tr(ui.dealFlow.pathReset)}</span>
          </div>
        }
      />

      <div className="rounded-2xl border border-line bg-surface px-4 py-3">
        <Stepper state={state} trail={trail} />
      </div>

      <Panel>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                {tr(ui.dealFlow.currentStep)}
              </span>
              <Chip tone="accent">{tr(stateLabel[state])}</Chip>
              {stepNumber > 0 && (
                <span className="font-mono text-[10px] text-muted">
                  {String(stepNumber).padStart(2, "0")}/{HAPPY_PATH.length}
                </span>
              )}
              {disputed && <Chip>{tr(ui.dealFlow.disputeBranch)}</Chip>}
            </div>

            {primary && !terminal && state !== "DISPUTED" && (
              <div className="text-xs leading-relaxed">
                <span className="text-muted">{tr(ui.dealFlow.nextActor)}: </span>
                <span className="font-medium">{tr(actorLabel[primary.transition.actor])}</span>
                <span className="mx-2 text-line">|</span>
                <span className="text-muted">{tr(ui.dealFlow.requires)}: </span>
                <span>{tr(primary.transition.requires)}</span>
              </div>
            )}

            {state === "DISPUTED" && (
              <p className="text-xs leading-relaxed text-muted">{tr(ui.dealFlow.disputeHint)}</p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {tr(ui.dealFlow.trackingRef)}
                </span>
                <input
                  value={trackingRef}
                  onChange={(event) => {
                    setTrackingRef(event.target.value);
                    setNotice(null);
                  }}
                  placeholder={tr(ui.dealFlow.trackingPlaceholder)}
                  spellCheck={false}
                  className="mt-1 w-full rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </label>

              {path === "own" && (
                <label className="flex items-center gap-2 self-end rounded-lg border border-line bg-surface-2 px-2.5 py-2 text-xs">
                  <input
                    type="checkbox"
                    checked={liabilitySigned}
                    onChange={(event) => {
                      setLiabilitySigned(event.target.checked);
                      setNotice(null);
                    }}
                    className="h-3.5 w-3.5 accent-accent"
                  />
                  <span className="min-w-0 truncate">{tr(ui.dealFlow.liability)}</span>
                  <Chip
                    tone={liabilitySigned ? "accent" : "outline"}
                    className="ml-auto shrink-0"
                  >
                    {tr(liabilitySigned ? ui.dealFlow.signed : ui.dealFlow.notSigned)}
                  </Chip>
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {state === "DISPUTED" ? (
                decisions.map(({ transition }) => (
                  <button
                    key={transition.event}
                    type="button"
                    onClick={() => fire(transition.event)}
                    className={cx(
                      button.base,
                      transition.event === "REVIEW_REFUND" ? button.primary : button.secondary,
                    )}
                  >
                    {tr(
                      transition.event === "REVIEW_REFUND"
                        ? ui.dealFlow.uphold
                        : ui.dealFlow.dismiss,
                    )}
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => next && fire(next.event)}
                  disabled={!next}
                  className={cx(button.base, button.primary)}
                >
                  {tr(ui.dealFlow.next)}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setTrail((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous))
                }
                disabled={trail.length < 2}
                className={cx(button.base, button.secondary)}
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                {tr(ui.dealFlow.back)}
              </button>

              <button
                type="button"
                onClick={() => fire("OPEN_DISPUTE")}
                disabled={!canReport}
                title={canReport ? undefined : tr(ui.dealFlow.reportHint)}
                className={cx(button.base, button.outline)}
              >
                <ChatIcon className="h-3.5 w-3.5" />
                {tr(ui.dealFlow.reportIssue)}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {state === "DELIVERED" && (
                <button
                  type="button"
                  onClick={() => fire("AUTO_RELEASE")}
                  className={cx(button.base, button.dashed)}
                >
                  <LockIcon className="h-3.5 w-3.5" />
                  {tr(ui.dealFlow.autoRelease)} · {tr(ui.common.tbd)}
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className={cx(button.base, button.ghost)}
              >
                <ResetIcon className="h-3.5 w-3.5" />
                {tr(ui.dealFlow.reset)}
              </button>
            </div>
          </div>
        </div>

        {blockedCode && !terminal && state !== "DISPUTED" && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-muted">
            <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            {tr(guardCopy[blockedCode])}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="mt-3 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] leading-relaxed text-accent"
          >
            {tr(notice)}
          </p>
        )}

        {terminal && (
          <p className="mt-3 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-muted">
            {tr(ui.dealFlow.closed)}
          </p>
        )}
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[minmax(330px,400px)_minmax(0,1fr)]">
        <div className="space-y-5">
          <PhoneMockup messages={messages} />

          <Panel title={tr(ui.dealFlow.order)} meta={<Chip>{tr(ui.common.mock)}</Chip>}>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.vendor)}</dt>
                <dd className="font-medium">{ORDER.vendor}</dd>
              </div>
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.buyer)}</dt>
                <dd className="font-medium">{tr(ORDER.buyer)}</dd>
              </div>
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.item)}</dt>
                <dd className="font-medium">{tr(ORDER.item)}</dd>
              </div>
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.orderValue)}</dt>
                <dd className="font-mono">
                  {ORDER.currency} {ORDER.amountKes.toLocaleString("en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.holdRef)}</dt>
                <dd className="font-mono">{ORDER.holdRef}</dd>
              </div>
              <div>
                <dt className="text-muted">{tr(ui.dealFlow.trackingRef)}</dt>
                <dd className="font-mono">{trackingRef.trim() || tr(ui.dealFlow.trackingUnset)}</dd>
              </div>
            </dl>
          </Panel>

          <EvidencePanel path={path} trail={trail} />
        </div>

        <div className="space-y-5">
          <AuditLog entries={audit} />
          <LedgerPanel chain={chain} />
        </div>
      </div>
    </div>
  );
}
