import { describe, expect, it } from "vitest";
import {
  GENESIS_HASH,
  appendLedger,
  hashEntry,
  verifyLedger,
  type LedgerEntry,
} from "./ledger";

const hold = appendLedger([], {
  kind: "HOLD",
  amountKes: 4500,
  memo: "HL-7F2A",
});

const chain = appendLedger(hold, {
  kind: "RELEASE",
  amountKes: -4500,
  memo: "AMN-4K7Q",
});

describe("append-only ledger", () => {
  it("starts a chain from genesis", () => {
    expect(hold).toHaveLength(1);
    expect(hold[0]).toMatchObject({ seq: 1, prevHash: GENESIS_HASH });
    expect(verifyLedger(hold)).toEqual({ ok: true, brokenAt: null });
  });

  it("links each entry to the previous hash", () => {
    expect(chain).toHaveLength(2);
    expect(chain[1].prevHash).toBe(chain[0].hash);
    expect(verifyLedger(chain)).toEqual({ ok: true, brokenAt: null });
  });

  it("does not mutate the chain it is given", () => {
    expect(hold).toHaveLength(1);
    expect(chain).not.toBe(hold);
  });

  it("accepts an empty chain", () => {
    expect(verifyLedger([])).toEqual({ ok: true, brokenAt: null });
  });

  it("produces an 8-character hex hash", () => {
    expect(chain[0].hash).toMatch(/^[0-9a-f]{8}$/);
    expect(hashEntry(chain[0])).toBe(chain[0].hash);
  });

  it("detects a tampered amount", () => {
    const tampered: LedgerEntry[] = [{ ...chain[0], amountKes: 1 }, chain[1]];
    expect(verifyLedger(tampered)).toEqual({ ok: false, brokenAt: 1 });
  });

  it("detects a rewritten memo", () => {
    const tampered: LedgerEntry[] = [{ ...chain[0], memo: "HL-0000" }, chain[1]];
    expect(verifyLedger(tampered)).toEqual({ ok: false, brokenAt: 1 });
  });

  it("detects a broken link between entries", () => {
    const tampered: LedgerEntry[] = [chain[0], { ...chain[1], prevHash: "deadbeef" }];
    expect(verifyLedger(tampered)).toEqual({ ok: false, brokenAt: 2 });
  });

  it("detects a rewritten hash", () => {
    const tampered: LedgerEntry[] = [chain[0], { ...chain[1], hash: "00000000" }];
    expect(verifyLedger(tampered)).toEqual({ ok: false, brokenAt: 2 });
  });

  it("detects missing entries", () => {
    expect(verifyLedger([chain[1]])).toEqual({ ok: false, brokenAt: 2 });
  });
});
