/**
 * A tiny append-only ledger.
 *
 * Entries are chained with a deterministic hash, so mutating any earlier entry
 * invalidates every hash after it. The demo never posts an escrow fee because the
 * fee is a commercial term that has not been set.
 */

export type LedgerKind = "HOLD" | "RELEASE" | "REFUND";

export interface LedgerEntry {
  readonly seq: number;
  readonly kind: LedgerKind;
  /** Signed amount in KES; the sign shows direction. */
  readonly amountKes: number;
  /** Short reference, e.g. the hold or tracking reference. */
  readonly memo: string;
  readonly prevHash: string;
  readonly hash: string;
}

export type LedgerHashInput = Omit<LedgerEntry, "hash">;

export interface LedgerInput {
  readonly kind: LedgerKind;
  readonly amountKes: number;
  readonly memo: string;
}

export const GENESIS_HASH = "00000000";

/** FNV-1a, 32-bit, rendered as 8 hex characters. Deterministic across runtimes. */
export function hashEntry(entry: LedgerHashInput): string {
  const payload = `${entry.seq}|${entry.kind}|${entry.amountKes}|${entry.memo}|${entry.prevHash}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function appendLedger(
  chain: readonly LedgerEntry[],
  input: LedgerInput,
): LedgerEntry[] {
  const prevHash = chain.length > 0 ? chain[chain.length - 1].hash : GENESIS_HASH;
  const draft: LedgerHashInput = {
    seq: chain.length + 1,
    kind: input.kind,
    amountKes: input.amountKes,
    memo: input.memo,
    prevHash,
  };
  return [...chain, { ...draft, hash: hashEntry(draft) }];
}

export interface LedgerCheck {
  readonly ok: boolean;
  /** Sequence number of the first invalid entry, or null when the chain is sound. */
  readonly brokenAt: number | null;
}

export function verifyLedger(chain: readonly LedgerEntry[]): LedgerCheck {
  let prevHash = GENESIS_HASH;
  for (let index = 0; index < chain.length; index += 1) {
    const entry = chain[index];
    if (entry.seq !== index + 1 || entry.prevHash !== prevHash) {
      return { ok: false, brokenAt: entry.seq };
    }
    if (entry.hash !== hashEntry(entry)) {
      return { ok: false, brokenAt: entry.seq };
    }
    prevHash = entry.hash;
  }
  return { ok: true, brokenAt: null };
}
