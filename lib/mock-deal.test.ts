import { describe, expect, it } from "vitest";
import { DEAL_STATES, type DealState } from "./deal-machine";
import { verifyLedger } from "./ledger";
import {
  auditForStep,
  chatForStep,
  evidenceByPath,
  ledgerForTrail,
} from "./mock-deal";

const trail = (...states: DealState[]): DealState[] => ["CREATED", ...states];

describe("mock deal content", () => {
  it("has chat and audit content for every state", () => {
    for (const state of DEAL_STATES) {
      expect(chatForStep(state, "platform").length).toBeGreaterThan(0);
      expect(auditForStep(state, "platform").length).toBeGreaterThan(0);
    }
  });

  it("fills both languages for every message and audit entry", () => {
    for (const state of DEAL_STATES) {
      for (const message of chatForStep(state, "own")) {
        expect(message.text.en.length).toBeGreaterThan(0);
        expect(message.text.sw.length).toBeGreaterThan(0);
      }
      for (const entry of auditForStep(state, "own")) {
        expect(entry.action.en.length).toBeGreaterThan(0);
        expect(entry.action.sw.length).toBeGreaterThan(0);
        expect(entry.detail.en.length).toBeGreaterThan(0);
        expect(entry.detail.sw.length).toBeGreaterThan(0);
      }
    }
  });

  it("states the proof-of-payment policy instead of showing a screenshot", () => {
    const funded = chatForStep("FUNDED", "platform")
      .map((message) => message.text.en)
      .join(" ");
    expect(funded).toContain("Screenshots and SMS are not accepted as proof of payment.");
  });

  it("marks the payment confirmation as a verified partner callback", () => {
    const verified = chatForStep("FUNDED", "platform").filter((message) => message.verified);
    expect(verified).toHaveLength(1);
    expect(verified[0].from).toBe("partner");
  });

  it("uses different courier messages and delivery evidence per path", () => {
    const platform = chatForStep("SHIPPED", "platform").map((message) => message.from);
    const own = chatForStep("SHIPPED", "own").map((message) => message.from);
    expect(platform).toContain("courier");
    expect(own).not.toContain("courier");
  });

  it("tells a different story when a dispute is dismissed rather than confirmed", () => {
    const confirmed = chatForStep("RELEASED", "platform");
    const dismissed = chatForStep("RELEASED", "platform", { fromDispute: true });
    expect(dismissed.map((message) => message.id)).not.toEqual(
      confirmed.map((message) => message.id),
    );
    expect(dismissed[0].from).toBe("reviewer");
  });

  it("keeps the platform path stronger than the vendor's own courier", () => {
    const met = (path: "platform" | "own") =>
      evidenceByPath[path].items.filter((item) => item.met).length;
    expect(met("platform")).toBeGreaterThan(met("own"));
    expect(evidenceByPath.platform.items.some((item) => item.readyAt === null)).toBe(false);
    expect(evidenceByPath.own.items.some((item) => item.readyAt === null)).toBe(true);
  });
});

describe("mock ledger", () => {
  it("posts the hold only once funding is reached", () => {
    expect(ledgerForTrail(trail())).toHaveLength(0);
    expect(ledgerForTrail(trail("FUNDED"))).toHaveLength(1);
  });

  it("posts exactly one release on the happy path", () => {
    const chain = ledgerForTrail(
      trail("FUNDED", "SHIPPED", "IN_TRANSIT", "DELIVERED", "RELEASED"),
    );
    expect(chain.map((entry) => entry.kind)).toEqual(["HOLD", "RELEASE"]);
    expect(verifyLedger(chain).ok).toBe(true);
  });

  it("posts exactly one refund after a dispute", () => {
    const chain = ledgerForTrail(trail("FUNDED", "SHIPPED", "DISPUTED", "REFUNDED"));
    expect(chain.map((entry) => entry.kind)).toEqual(["HOLD", "REFUND"]);
    expect(verifyLedger(chain).ok).toBe(true);
  });

  it("adds no ledger entry for shipping and stays valid when stepping back", () => {
    const funded = ledgerForTrail(trail("FUNDED"));
    const shipped = ledgerForTrail(trail("FUNDED", "SHIPPED"));
    expect(shipped).toEqual(funded);
    expect(verifyLedger(shipped).ok).toBe(true);
  });
});
