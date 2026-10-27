import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { DEAL_STATES, HAPPY_PATH, TRANSITIONS, type DealState } from "@/lib/deal-machine";
import { actorLabel, pathLabel, ui } from "@/lib/copy";
import { ORDER, chatForStep, evidenceByPath, ledgerForTrail } from "@/lib/mock-deal";
import { verifyLedger } from "@/lib/ledger";
import {
  AlertIcon,
  ArrowRightIcon,
  ChatIcon,
  CheckIcon,
  DownloadIcon,
  HashIcon,
  LockIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
  TruckIcon,
  UserIcon,
  cx,
} from "./ui";

const en = (value: { readonly en: string }): string => value.en;

const TOTAL_PAGES = 7;

const contents = [
  { no: "02", label: "Overview" },
  { no: "03", label: "Deal flow" },
  { no: "04", label: "Delivery paths" },
  { no: "05", label: "Disputes" },
  { no: "06", label: "Trust & safety" },
  { no: "07", label: "Roadmap" },
];

function Page({
  page,
  takeaway,
  contentClassName,
  children,
}: {
  page: number;
  takeaway?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className="deck-page">
      <div className={cx("deck-content", contentClassName)}>{children}</div>
      {takeaway && (
        <div className="mt-auto border-t border-line pt-3">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-accent">
            Key takeaway
          </p>
          <p className="mt-1 text-[12.5px] font-medium leading-snug">{takeaway}</p>
        </div>
      )}
      <div
        className={cx(
          "flex items-center justify-between border-t border-line pt-2.5 text-[8px] uppercase tracking-[0.14em] text-muted",
          takeaway ? "mt-3" : "mt-auto",
        )}
      >
        <span>AmanaLink · Prototype, mock data · No real payments</span>
        <span>
          {String(page).padStart(2, "0")} / {String(TOTAL_PAGES).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

function Title({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-[32px] font-semibold leading-tight tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[170mm] text-[12.5px] leading-relaxed text-muted">{lede}</p>
    </header>
  );
}

function Bars({ value, total }: { value: number; total: number }) {
  return (
    <span className="inline-flex w-[30mm] gap-0.5 align-middle">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cx("h-2 flex-1 rounded-full", index < value ? "bg-accent" : "bg-line")}
        />
      ))}
    </span>
  );
}

function Bullet({ tone = "accent" }: { tone?: "accent" | "muted" }) {
  return (
    <span
      className={cx(
        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
        tone === "accent"
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-line text-muted",
      )}
    >
      <CheckIcon className="h-2.5 w-2.5" />
    </span>
  );
}

function Guarantee({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
          {icon}
        </span>
        <div>
          <p className="text-[13px] font-semibold leading-snug">{title}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{body}</p>
        </div>
      </div>
    </div>
  );
}

const guaranteeIcons = [
  <ShieldIcon key="shield" className="h-4 w-4" />,
  <LockIcon key="lock" className="h-4 w-4" />,
  <TruckIcon key="truck" className="h-4 w-4" />,
  <UserIcon key="user" className="h-4 w-4" />,
  <HashIcon key="hash" className="h-4 w-4" />,
  <SparkIcon key="spark" className="h-4 w-4" />,
];

const outcomeIcons = [
  <ArrowRightIcon key="arrow" className="h-4 w-4" />,
  <CheckIcon key="check" className="h-4 w-4" />,
  <ChatIcon key="chat" className="h-4 w-4" />,
];

function StateNode({ state }: { state: DealState }) {
  const terminal = state === "RELEASED";
  return (
    <span
      className={cx(
        "rounded border px-2 py-1.5 font-mono text-[9px] uppercase tracking-wide",
        terminal
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-line bg-surface text-ink",
      )}
    >
      {state}
    </span>
  );
}

export function Deck() {
  const created = chatForStep("CREATED", "platform");
  const funded = chatForStep("FUNDED", "platform");
  const verified = funded.find((message) => message.verified);

  const transitions = DEAL_STATES.flatMap((state) =>
    TRANSITIONS[state].map((transition) => ({ state, transition })),
  );

  const releasedTrail: DealState[] = [
    "CREATED",
    "FUNDED",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
    "RELEASED",
  ];
  const ledger = ledgerForTrail(releasedTrail);
  const ledgerCheck = verifyLedger(ledger);

  const deliveryRows = [
    {
      label: ui.delivery.rows.whoCarries,
      platform: ui.delivery.platformValues.whoCarries,
      own: ui.delivery.ownValues.whoCarries,
    },
    {
      label: ui.delivery.rows.liability,
      platform: ui.delivery.platformValues.liability,
      own: ui.delivery.ownValues.liability,
    },
    {
      label: ui.delivery.rows.tracking,
      platform: ui.delivery.platformValues.tracking,
      own: ui.delivery.ownValues.tracking,
    },
    {
      label: ui.delivery.rows.proof,
      platform: ui.delivery.platformValues.proof,
      own: ui.delivery.ownValues.proof,
    },
    {
      label: ui.delivery.rows.release,
      platform: ui.delivery.platformValues.release,
      own: ui.delivery.ownValues.release,
    },
    {
      label: ui.delivery.rows.bestFor,
      platform: ui.delivery.platformValues.bestFor,
      own: ui.delivery.ownValues.bestFor,
    },
  ];

  return (
    <div className="deck">
      <div className="no-print sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[210mm] items-center justify-between px-4 py-3 text-[11px]">
          <Link href="/" className="text-muted hover:text-ink">
            ← {en(ui.common.backToDemo)}
          </Link>
          <a
            href="/amanalink-deck.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[11px] font-medium text-accent-ink"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            {en(ui.common.downloadPdf)}
          </a>
        </div>
      </div>

      <main className="pb-8 pt-6">
        {/* 01 — Cover ------------------------------------------------------ */}
        <Page page={1} contentClassName="flex min-h-[238mm] flex-col">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-ink">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[14px] font-semibold leading-tight">
                  {ui.brand}
                </span>
                <span className="block text-[9px] text-muted">
                  {en(ui.brandTagline)}
                </span>
              </span>
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[8px] font-semibold uppercase tracking-wide text-accent">
              {en(ui.bannerTag)}
            </span>
          </div>

          <div className="mt-14 grid grid-cols-[1.06fr_0.94fr] items-start gap-8">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-accent">
                {en(ui.overview.eyebrow)}
              </p>
              <h1 className="mt-2 text-[42px] font-semibold leading-[1.04] tracking-tight">
                {en(ui.overview.title)}
              </h1>
              <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
                {en(ui.overview.lede)}
              </p>

              <ul className="mt-6 space-y-2.5">
                {ui.overview.principles.map((principle) => (
                  <li key={principle.title.en} className="flex gap-2 text-[11px]">
                    <Bullet />
                    <span className="pt-0.5">{en(principle.title)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-chat p-3">
              <div className="flex items-center gap-2 border-b border-line/70 pb-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-[9px] font-semibold text-accent">
                  ZT
                </span>
                <span>
                  <span className="block text-[10.5px] font-semibold leading-tight">
                    {ORDER.vendor}
                  </span>
                  <span className="block text-[8px] text-muted">
                    {en(ui.phone.verifiedBusiness)}
                  </span>
                </span>
              </div>
              <div className="mt-2.5 space-y-2">
                <p className="ml-auto max-w-[88%] rounded-xl rounded-br-sm bg-accent px-2.5 py-2 text-[10px] leading-snug text-accent-ink">
                  {en(created[0].text)}
                </p>
                <p className="max-w-[90%] rounded-xl rounded-bl-sm border border-line bg-surface px-2.5 py-2 text-[10px] leading-snug">
                  {en(created[1].text)}
                </p>
                {verified && (
                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-2.5">
                    <p className="flex items-center gap-1 text-[7.5px] font-semibold uppercase tracking-wide text-accent">
                      <ShieldIcon className="h-2.5 w-2.5" />
                      {en(ui.phone.partnerCallback)}
                    </p>
                    <p className="mt-1 text-[9px] leading-snug">{en(verified.text)}</p>
                  </div>
                )}
              </div>
              <p className="mt-2.5 text-center text-[7.5px] leading-snug text-muted">
                {en(ui.phone.secureBanner)}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-line bg-surface-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold">{en(ui.overview.termsTitle)}</p>
              <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[7.5px] font-medium uppercase tracking-wide text-muted">
                {en(ui.common.tbd)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ui.overview.terms.map((term) => (
                <span
                  key={term.en}
                  className="rounded-full border border-line bg-surface px-2.5 py-1 text-[9px] text-muted"
                >
                  {en(term)} · {en(ui.common.tbd)}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[9px] leading-relaxed text-muted">
              {en(ui.overview.termsNote)}
            </p>
          </div>

          <div className="mt-14 max-w-[132mm]">
            <p className="text-[23px] font-medium leading-snug tracking-tight">
              “Money moves only when the deal does.”
            </p>
            <p className="mt-2 text-[10px] text-muted">
              Escrow, tracking and disputes — inside the same conversation.
            </p>
          </div>

          <div className="mt-auto border-t border-line pt-4">
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              Contents
            </p>
            <div className="mt-2 grid grid-cols-3 gap-x-6 gap-y-1.5">
              {contents.map((entry) => (
                <div key={entry.no} className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px]">{entry.label}</span>
                  <span className="font-mono text-[8px] text-muted">{entry.no}</span>
                </div>
              ))}
            </div>
          </div>
        </Page>

        {/* 02 — Overview --------------------------------------------------- */}
        <Page page={2} takeaway="Money moves only when the deal does. The terms stay open until they are set.">
          <Title
            eyebrow="01 / Overview"
            title={en(ui.overview.principlesTitle)}
            lede={en(ui.overview.lede)}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                The gap
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed">
                A buyer paying in a DM has no neutral proof that the money is protected. A
                vendor shipping on trust has no neutral proof that the parcel arrived.
              </p>
            </div>
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-accent">
                The answer
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed">
                A protected hold at a CBK-licensed partner, a mandatory tracking reference
                and a human-reviewed dispute path — inside the same conversation.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {ui.overview.principles.map((principle, index) => {
              const Icon = [ShieldIcon, TruckIcon, UserIcon][index] ?? ShieldIcon;
              return (
                <div key={principle.title.en} className="rounded-xl border border-line p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2.5 text-[13px] font-semibold leading-snug">
                    {en(principle.title)}
                  </p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                    {en(principle.body)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-line p-4">
            <p className="text-[13px] font-semibold">{en(ui.overview.moneyTitle)}</p>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {ui.overview.moneySteps.map((step, index) => (
                <div key={step.en} className="rounded-lg bg-surface-2 px-3 py-2.5">
                  <span className="font-mono text-[9px] text-accent">0{index + 1}</span>
                  <p className="mt-1 text-[10.5px] font-medium leading-snug">{en(step)}</p>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[9px] leading-relaxed text-muted">
              {en(ui.overview.moneyNote)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-[12px] font-semibold">{en(ui.overview.termsTitle)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ui.overview.terms.map((term) => (
                  <span
                    key={term.en}
                    className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[9px] text-muted"
                  >
                    {en(term)} · {en(ui.common.tbd)}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-muted">
                {en(ui.overview.termsNote)}
              </p>
            </div>

            <div className="rounded-xl border border-line p-4">
              <p className="text-[12px] font-semibold">{en(ui.overview.notTitle)}</p>
              <ul className="mt-2 space-y-1.5">
                {ui.overview.notItems.map((item) => (
                  <li key={item.en} className="flex gap-2 text-[10px] leading-relaxed text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {en(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Page>

        {/* 03 — Deal flow -------------------------------------------------- */}
        <Page page={3} takeaway="Every edge has an actor and a precondition. The interface cannot skip either.">
          <Title
            eyebrow="02 / Deal flow"
            title={en(ui.dealFlow.title)}
            lede={en(ui.dealFlow.lede)}
          />

          <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {HAPPY_PATH.map((state, index) => (
                <Fragment key={state}>
                  <StateNode state={state} />
                  {index < HAPPY_PATH.length - 1 && (
                    <span className="text-[10px] text-muted">→</span>
                  )}
                </Fragment>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-line pt-2.5 text-[9px] leading-relaxed">
              <p>
                <span className="font-mono text-[8.5px]">
                  SHIPPED / IN_TRANSIT / DELIVERED
                </span>
                <span className="text-muted"> — OPEN_DISPUTE (buyer) → </span>
                <span className="font-mono text-[8.5px] text-accent">DISPUTED</span>
              </p>
              <p className="text-muted">
                <span className="text-ink">DISPUTED</span> — REVIEW_REFUND (reviewer) →{" "}
                <span className="text-ink">REFUNDED</span> · REVIEW_RELEASE (reviewer) →{" "}
                <span className="text-ink">RELEASED</span>
              </p>
            </div>
          </div>

          <table className="mt-4 w-full border-collapse text-left text-[10px]">
            <thead>
              <tr className="text-[8px] uppercase tracking-[0.12em] text-muted">
                <th className="pb-1.5 pr-2 font-medium">State</th>
                <th className="pb-1.5 pr-2 font-medium">Event</th>
                <th className="pb-1.5 pr-2 font-medium">To</th>
                <th className="pb-1.5 pr-2 font-medium">Actor</th>
                <th className="pb-1.5 font-medium">Precondition</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map(({ state, transition }) => (
                <tr key={`${state}-${transition.event}`} className="border-t border-line/80">
                  <td className="py-1.5 pr-2 font-mono text-[8.5px]">{state}</td>
                  <td className="py-1.5 pr-2 font-mono text-[8.5px]">{transition.event}</td>
                  <td className="py-1.5 pr-2 font-mono text-[8.5px] text-accent">
                    {transition.to}
                  </td>
                  <td className="py-1.5 pr-2">{actorLabel[transition.actor].en}</td>
                  <td className="py-1.5 text-muted">{transition.requires.en}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-[12px] font-semibold">What the UI records</p>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2 text-[10px] leading-relaxed">
                  <Bullet />
                  <span>
                    <span className="font-medium">Audit log.</span>{" "}
                    <span className="text-muted">
                      Every step names its actor — buyer, vendor, courier, partner, system or
                      reviewer.
                    </span>
                  </span>
                </li>
                <li className="flex gap-2 text-[10px] leading-relaxed">
                  <Bullet />
                  <span>
                    <span className="font-medium">Evidence.</span>{" "}
                    <span className="text-muted">
                      4/4 items collected on the platform path at delivery; 2/4 with the
                      vendor&apos;s own courier.
                    </span>
                  </span>
                </li>
                <li className="flex gap-2 text-[10px] leading-relaxed">
                  <Bullet />
                  <span>
                    <span className="font-medium">Ledger.</span>{" "}
                    <span className="text-muted">
                      Hold and release rows are hash-chained; the fee line stays TBD.
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold">Ledger snapshot</p>
                {ledgerCheck.ok && (
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[7px] font-medium text-accent">
                    Chain verified
                  </span>
                )}
              </div>
              <table className="mt-2 w-full border-collapse text-[9px]">
                <thead>
                  <tr className="text-[7px] uppercase tracking-wide text-muted">
                    <th className="pb-1 text-left font-medium">Seq</th>
                    <th className="pb-1 text-left font-medium">Entry</th>
                    <th className="pb-1 text-right font-medium">KES</th>
                    <th className="pb-1 text-right font-medium">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((entry) => (
                    <tr key={entry.seq} className="border-t border-line/70">
                      <td className="py-1 font-mono">{entry.seq}</td>
                      <td className="py-1">{entry.kind === "HOLD" ? "Hold" : "Release"}</td>
                      <td className="py-1 text-right font-mono">
                        {entry.amountKes > 0 ? "+" : "−"}
                        {Math.abs(entry.amountKes).toLocaleString("en-US")}
                      </td>
                      <td className="py-1 text-right font-mono text-[7.5px] text-muted">
                        {entry.hash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-1.5 border-t border-line pt-1.5 text-[8px] leading-relaxed text-muted">
                {en(ui.dealFlow.ledgerFee)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/25 bg-accent/5 p-3 text-[9.5px] leading-relaxed">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <p>
              <span className="font-semibold">AUTO_RELEASE is shown but blocked.</span> The
              window is TBD — set in the Terms, so the demo never invents a duration. Buyer
              confirmation remains the reachable release path on DELIVERED.
            </p>
          </div>
        </Page>

        {/* 04 — Delivery paths --------------------------------------------- */}
        <Page page={4} takeaway="Delivery proof is not payment proof — and a screenshot is neither.">
          <Title
            eyebrow="03 / Delivery paths"
            title={en(ui.delivery.title)}
            lede={en(ui.delivery.lede)}
          />

          <table className="mt-5 w-full border-collapse text-left text-[10.5px]">
            <thead>
              <tr>
                <th className="w-[27%] pb-2" />
                <th className="w-[36.5%] border-b border-accent/30 pb-2 pr-3 text-[11.5px] font-semibold">
                  {en(pathLabel.platform)}
                </th>
                <th className="w-[36.5%] border-b border-line pb-2 text-[11.5px] font-semibold">
                  {en(pathLabel.own)}
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryRows.map((row) => (
                <tr key={row.label.en} className="border-b border-line/70 align-top">
                  <th className="py-2.5 pr-3 text-left text-[9px] font-medium text-muted">
                    {en(row.label)}
                  </th>
                  <td className="py-2.5 pr-3 leading-relaxed">{en(row.platform)}</td>
                  <td className="py-2.5 leading-relaxed">{en(row.own)}</td>
                </tr>
              ))}
              <tr className="align-middle">
                <th className="py-3 pr-3 text-left text-[9px] font-medium text-muted">
                  {en(ui.dealFlow.evidence)}
                </th>
                <td className="py-3 pr-3">
                  <Bars
                    value={evidenceByPath.platform.score}
                    total={evidenceByPath.platform.total}
                  />
                  <span className="ml-2 text-[9px] font-medium text-accent">
                    {en(ui.dealFlow.evidenceStrong)} · {evidenceByPath.platform.score}/
                    {evidenceByPath.platform.total}
                  </span>
                </td>
                <td className="py-3">
                  <Bars value={evidenceByPath.own.score} total={evidenceByPath.own.total} />
                  <span className="ml-2 text-[9px] font-medium text-muted">
                    {en(ui.dealFlow.evidenceModerate)} · {evidenceByPath.own.score}/
                    {evidenceByPath.own.total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-[11.5px] font-semibold">
                {en(ui.dealFlow.evidence)} · {en(pathLabel.platform)}
              </p>
              <ul className="mt-2 space-y-1.5">
                {evidenceByPath.platform.items.map((item) => (
                  <li key={item.label.en} className="flex gap-2 text-[9.5px] text-muted">
                    <CheckIcon className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                    <span>
                      <span className="text-ink">{en(item.label)}</span> — {en(item.detail)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-[11.5px] font-semibold">
                {en(ui.dealFlow.evidence)} · {en(pathLabel.own)}
              </p>
              <ul className="mt-2 space-y-1.5">
                {evidenceByPath.own.items.map((item) => (
                  <li key={item.label.en} className="flex gap-2 text-[9.5px] text-muted">
                    <CheckIcon
                      className={cx(
                        "mt-0.5 h-3 w-3 shrink-0",
                        item.met ? "text-accent" : "text-line",
                      )}
                    />
                    <span>
                      <span className={item.met ? "text-ink" : "text-muted"}>
                        {en(item.label)}
                      </span>{" "}
                      — {en(item.detail)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-[12px] font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                <StoreIcon className="h-4 w-4" />
              </span>
              {en(ui.delivery.calloutTitle)}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              {en(ui.delivery.callout)}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {[
              {
                title: "Tracking before dispatch",
                body: "The SHIP edge has no path without a tracking reference.",
              },
              {
                title: "Liability for own couriers",
                body: "The same edge rejects an unsigned liability agreement.",
              },
              {
                title: "Release stays human",
                body: "A dispute blocks release until a reviewer decides.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-line px-3 py-2.5">
                <p className="text-[9.5px] font-semibold">{item.title}</p>
                <p className="mt-0.5 text-[8.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Page>

        {/* 05 — Disputes --------------------------------------------------- */}
        <Page page={5} takeaway="A dispute pauses the money, not the conversation.">
          <Title
            eyebrow="04 / Disputes"
            title={en(ui.disputes.title)}
            lede={en(ui.disputes.lede)}
          />

          <div className="mt-5 grid grid-cols-3 gap-3">
            {ui.disputes.outcomes.map((outcome, index) => (
              <div key={outcome.title.en} className="rounded-xl border border-line p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  {outcomeIcons[index] ?? outcomeIcons[0]}
                </span>
                <p className="mt-2.5 text-[12.5px] font-semibold">{en(outcome.title)}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  {en(outcome.body)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-[12px] font-semibold">{en(ui.disputes.seesTitle)}</p>
              <ul className="mt-2 space-y-2">
                {ui.disputes.sees.map((item) => (
                  <li key={item.en} className="flex gap-2 text-[10px] leading-relaxed">
                    <Bullet />
                    {en(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="flex items-center gap-2 text-[12px] font-semibold">
                {en(ui.disputes.aiTitle)}
                <span className="rounded-full border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[7.5px] font-medium uppercase tracking-wide text-accent">
                  <SparkIcon className="mr-0.5 inline h-2 w-2" />
                  AI
                </span>
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-muted">
                {en(ui.disputes.aiBody)}
              </p>
              <p className="mt-2.5 rounded-lg border border-dashed border-line px-2.5 py-2 text-[9px] text-muted">
                {en(ui.disputes.window)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold">{en(ui.disputes.caseTitle)}</p>
              <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[7.5px] uppercase tracking-wide text-muted">
                {en(ui.common.mock)}
              </span>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              {en(ui.disputes.caseBody)}
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {ui.disputes.caseSteps.map((step, index) => (
                <div key={step.en} className="rounded-lg bg-surface-2 px-3 py-2">
                  <span className="font-mono text-[8px] text-accent">0{index + 1}</span>
                  <p className="text-[9.5px] font-medium">{en(step)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-[1.1fr_0.9fr] gap-2.5">
              <div className="rounded-lg border border-accent/25 bg-accent/5 px-3 py-2.5">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-accent">
                  {en(ui.disputes.decision)}
                </p>
                <p className="mt-0.5 text-[10.5px] font-medium">
                  {en(ui.disputes.decisionValue)}
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-line px-3 py-2.5">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-muted">
                  {en(ui.disputes.advisory)}
                </p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
                  {en(ui.disputes.advisoryValue)}
                </p>
              </div>
            </div>
          </div>
        </Page>

        {/* 06 — Trust & safety --------------------------------------------- */}
        <Page page={6} takeaway="These are control paths in code, not promises in a support reply.">
          <Title
            eyebrow="05 / Trust & safety"
            title={en(ui.trust.title)}
            lede={en(ui.trust.lede)}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            {ui.trust.pillars.map((pillar, index) => (
              <Guarantee
                key={pillar.title.en}
                icon={guaranteeIcons[index] ?? guaranteeIcons[0]}
                title={en(pillar.title)}
                body={en(pillar.body)}
              />
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p className="flex items-center gap-2 text-[12px] font-semibold">
              <AlertIcon className="h-4 w-4 text-accent" />
              {en(ui.trust.limitsTitle)}
            </p>
            <ul className="mt-2.5 grid grid-cols-2 gap-2">
              {ui.trust.limits.map((limit) => (
                <li key={limit.en} className="flex items-center gap-2 text-[10px] font-medium">
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-accent/40">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                  </span>
                  {en(limit)}
                </li>
              ))}
            </ul>
            <p className="mt-2.5 border-t border-accent/20 pt-2.5 text-[9px] leading-relaxed text-muted">
              {en(ui.trust.limitsNote)}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-line p-4">
            <p className="text-[12px] font-semibold">Enforcement, not policy copy</p>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[
                {
                  title: "Tracking guard",
                  body: "SHIP is blocked when trackingRef is empty, for both paths.",
                },
                {
                  title: "Liability guard",
                  body: "Own courier also needs liabilitySigned before dispatch.",
                },
                {
                  title: "Auto-release guard",
                  body: "The window is TBD, so the edge stays closed in the demo.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-surface-2 px-3 py-2.5">
                  <p className="text-[9.5px] font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-[8.5px] leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg border border-line p-3 text-[9px] leading-relaxed text-muted">
            <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            CBK is the Central Bank of Kenya. In production, buyer funds would be held by a
            CBK-licensed partner — never by the platform. Payment state changes only on a
            verified partner callback; screenshots and SMS are never proof of payment.
          </div>
        </Page>

        {/* 07 — Roadmap ---------------------------------------------------- */}
        <Page page={7} takeaway="Sequenced by dependency, not by dates.">
          <Title
            eyebrow="06 / Roadmap"
            title={en(ui.roadmap.title)}
            lede={en(ui.roadmap.lede)}
          />

          <div className="mt-5 grid grid-cols-3 gap-3">
            {ui.roadmap.phases.map((phase, index) => (
              <div key={phase.title.en} className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={cx(
                      "rounded-full border px-2 py-0.5 font-mono text-[8px]",
                      index === 0
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-line text-muted",
                    )}
                  >
                    0{index + 1}
                  </span>
                  <span className="text-[8px] uppercase tracking-wide text-muted">
                    {en(ui.roadmap.timeline)}
                  </span>
                </div>
                <p className="mt-2.5 text-[12px] font-semibold">{en(phase.title)}</p>
                <ul className="mt-2 space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item.en} className="flex gap-2 text-[9.5px] leading-relaxed">
                      {index === 0 ? (
                        <CheckIcon className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                      ) : (
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      )}
                      {en(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="rounded-xl border border-line bg-surface-2 p-4">
              <p className="text-[12px] font-semibold">Run the interactive demo</p>
              <pre className="mt-2 rounded-lg bg-ink px-3 py-2.5 font-mono text-[9px] leading-relaxed text-bg">
{`npm install
npm run dev
# http://localhost:3000`}
              </pre>
              <p className="mt-2 text-[9px] leading-relaxed text-muted">
                English and Kiswahili, light and dark, keyboard navigation, and a URL hash
                for every section. Verified with 38 unit tests.
              </p>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-[12px] font-semibold">Built with</p>
              <ul className="mt-2 space-y-1.5 text-[9.5px] text-muted">
                <li>Next.js App Router + React 19</li>
                <li>TypeScript strict + Tailwind CSS v4</li>
                <li>Vitest: machine, ledger, content</li>
                <li>No backend, auth, database or images</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-accent/25 bg-accent/5 p-4">
            <p className="text-[13px] font-semibold">A showcase, not a product.</p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              The escrow fee, auto-release window and payout holds remain TBD until set in
              the Terms. In production, funds would be held by a CBK-licensed partner, never
              by this platform.
            </p>
            <p className="mt-3 border-t border-accent/20 pt-2.5 font-mono text-[9px] text-accent">
              github.com/AmanaLink/Demo
            </p>
          </div>
        </Page>
      </main>
    </div>
  );
}
