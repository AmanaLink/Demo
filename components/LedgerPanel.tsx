"use client";

import { ledgerKindLabel, ui } from "@/lib/copy";
import { verifyLedger, type LedgerEntry } from "@/lib/ledger";
import { useLang } from "./LangProvider";
import { CheckIcon, Chip, Panel, cx } from "./ui";

const formatAmount = (amount: number): string => {
  const absolute = Math.abs(amount).toLocaleString("en-US");
  return `${amount > 0 ? "+" : "−"}${absolute}`;
};

export function LedgerPanel({ chain }: { chain: readonly LedgerEntry[] }) {
  const { tr } = useLang();
  const check = verifyLedger(chain);

  return (
    <Panel
      title={tr(ui.dealFlow.ledger)}
      meta={tr(ui.dealFlow.ledgerAppendOnly)}
      action={
        chain.length > 0 && check.ok ? (
          <Chip tone="accent">
            <CheckIcon className="h-3 w-3" />
            {tr(ui.dealFlow.ledgerVerified)}
          </Chip>
        ) : undefined
      }
    >
      {chain.length === 0 ? (
        <p className="text-xs leading-relaxed text-muted">{tr(ui.dealFlow.ledgerEmpty)}</p>
      ) : (
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[25rem] border-collapse text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-muted">
                <th className="px-1 py-1 font-medium">{tr(ui.dealFlow.seq)}</th>
                <th className="px-1 py-1 font-medium">{tr(ui.dealFlow.ledger)}</th>
                <th className="px-1 py-1 text-right font-medium">
                  {tr(ui.dealFlow.amount)} · KES
                </th>
                <th className="px-1 py-1 text-right font-medium">{tr(ui.dealFlow.hash)}</th>
              </tr>
            </thead>
            <tbody>
              {chain.map((entry) => (
                <tr key={entry.seq} className="animate-fade-up border-t border-line/70">
                  <td className="px-1 py-2 font-mono text-muted">{entry.seq}</td>
                  <td className="px-1 py-2">
                    <Chip tone={entry.kind === "HOLD" ? "accent" : "muted"}>
                      {tr(ledgerKindLabel[entry.kind])}
                    </Chip>
                  </td>
                  <td
                    className={cx(
                      "px-1 py-2 text-right font-mono tabular-nums",
                      entry.amountKes > 0 ? "text-ink" : "text-muted",
                    )}
                  >
                    {formatAmount(entry.amountKes)}
                  </td>
                  <td
                    className="px-1 py-2 text-right font-mono text-[10px] text-muted"
                    title={`prev ${entry.prevHash}`}
                  >
                    {entry.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
        {tr(ui.dealFlow.ledgerFee)}
      </p>
    </Panel>
  );
}
