import { describe, expect, it } from "vitest";
import {
  DEAL_STATES,
  HAPPY_PATH,
  allowedTransitions,
  applyEvent,
  isTerminal,
  primaryTransition,
  transitionsFrom,
  type DealContext,
  type DealState,
} from "./deal-machine";

const context = (overrides: Partial<DealContext> = {}): DealContext => ({
  deliveryPath: "platform",
  trackingRef: "AMN-4K7Q",
  liabilitySigned: true,
  ...overrides,
});

const walk = (events: readonly Parameters<typeof applyEvent>[1][]) => {
  let state: DealState = "CREATED";
  const actors: string[] = [];
  for (const event of events) {
    const result = applyEvent(state, event, context());
    if (!result.ok) throw new Error(`unexpected block: ${result.code}`);
    actors.push(result.transition.actor);
    state = result.state;
  }
  return { state, actors };
};

describe("deal state machine — happy path", () => {
  it("walks CREATED → RELEASED with the documented actors", () => {
    const { state, actors } = walk([
      "FUND",
      "SHIP",
      "IN_TRANSIT",
      "DELIVER",
      "BUYER_CONFIRM",
    ]);
    expect(state).toBe("RELEASED");
    expect(actors).toEqual(["partner", "vendor", "courier", "courier", "buyer"]);
  });

  it("marks the documented happy path", () => {
    expect(HAPPY_PATH).toEqual([
      "CREATED",
      "FUNDED",
      "SHIPPED",
      "IN_TRANSIT",
      "DELIVERED",
      "RELEASED",
    ]);
  });

  it("offers exactly one usable next step at each point on the happy path", () => {
    const steps: Array<[DealState, string]> = [
      ["CREATED", "FUND"],
      ["FUNDED", "SHIP"],
      ["SHIPPED", "IN_TRANSIT"],
      ["IN_TRANSIT", "DELIVER"],
      ["DELIVERED", "BUYER_CONFIRM"],
    ];
    for (const [state, event] of steps) {
      const primary = primaryTransition(state, context());
      expect(primary?.transition.event).toBe(event);
      expect(primary?.guard.ok).toBe(true);
    }
  });
});

describe("deal state machine — preconditions", () => {
  it("blocks dispatch when the tracking reference is missing", () => {
    for (const trackingRef of [null, "", "   "]) {
      const result = applyEvent("FUNDED", "SHIP", context({ trackingRef }));
      expect(result).toMatchObject({ ok: false, code: "MISSING_TRACKING" });
      expect(result.transition?.event).toBe("SHIP");
    }
  });

  it("requires a signed liability agreement only for a vendor's own courier", () => {
    expect(
      applyEvent("FUNDED", "SHIP", context({ deliveryPath: "own", liabilitySigned: false })),
    ).toMatchObject({ ok: false, code: "UNSIGNED_LIABILITY" });

    expect(
      applyEvent("FUNDED", "SHIP", context({ deliveryPath: "own", liabilitySigned: true })),
    ).toMatchObject({ ok: true, state: "SHIPPED" });

    expect(
      applyEvent("FUNDED", "SHIP", context({ liabilitySigned: false })),
    ).toMatchObject({ ok: true, state: "SHIPPED" });
  });

  it("keeps auto-release blocked because the window is not set in the Terms", () => {
    expect(applyEvent("DELIVERED", "AUTO_RELEASE", context())).toMatchObject({
      ok: false,
      code: "AUTO_RELEASE_WINDOW_TBD",
    });

    // The reachable release edge on DELIVERED is buyer confirmation.
    expect(primaryTransition("DELIVERED", context())?.transition.event).toBe("BUYER_CONFIRM");
  });

  it("annotates every outgoing edge with its guard result", () => {
    const edges = allowedTransitions("FUNDED", context({ trackingRef: "" }));
    expect(edges).toHaveLength(1);
    expect(edges[0].guard).toEqual({ ok: false, code: "MISSING_TRACKING" });
  });
});

describe("deal state machine — dispute branch", () => {
  it.each(["SHIPPED", "IN_TRANSIT", "DELIVERED"] as const)(
    "opens a dispute from %s",
    (state) => {
      expect(applyEvent(state, "OPEN_DISPUTE", context())).toMatchObject({
        ok: true,
        state: "DISPUTED",
      });
    },
  );

  it("cannot open a dispute before dispatch or after closing", () => {
    for (const state of ["CREATED", "FUNDED", "RELEASED", "REFUNDED"] as const) {
      expect(applyEvent(state, "OPEN_DISPUTE", context())).toMatchObject({ ok: false });
    }
  });

  it("resolves a dispute only through a human reviewer", () => {
    const refund = applyEvent("DISPUTED", "REVIEW_REFUND", context());
    expect(refund).toMatchObject({ ok: true, state: "REFUNDED" });
    if (refund.ok) expect(refund.transition.actor).toBe("reviewer");

    const release = applyEvent("DISPUTED", "REVIEW_RELEASE", context());
    expect(release).toMatchObject({ ok: true, state: "RELEASED" });
    if (release.ok) expect(release.transition.actor).toBe("reviewer");

    const actors = allowedTransitions("DISPUTED", context()).map(
      (edge) => edge.transition.actor,
    );
    expect(new Set(actors)).toEqual(new Set(["reviewer"]));
  });

  it("keeps no state that resolves a dispute automatically", () => {
    for (const state of DEAL_STATES) {
      for (const transition of transitionsFrom(state)) {
        if (state === "DISPUTED") {
          expect(transition.actor).toBe("reviewer");
        }
      }
    }
  });
});

describe("deal state machine — guards and boundaries", () => {
  it("rejects events that are not on the current state", () => {
    expect(applyEvent("CREATED", "SHIP", context())).toMatchObject({
      ok: false,
      code: "EVENT_NOT_ALLOWED",
      transition: null,
    });
  });

  it("treats RELEASED and REFUNDED as terminal", () => {
    for (const state of ["RELEASED", "REFUNDED"] as const) {
      expect(isTerminal(state)).toBe(true);
      expect(transitionsFrom(state)).toHaveLength(0);
      expect(applyEvent(state, "BUYER_CONFIRM", context())).toMatchObject({
        ok: false,
        code: "TERMINAL_STATE",
      });
    }
  });

  it("only targets known states and never repeats an event in a state", () => {
    for (const state of DEAL_STATES) {
      const seen = new Set<string>();
      for (const transition of transitionsFrom(state)) {
        expect(DEAL_STATES).toContain(transition.to);
        expect(seen.has(transition.event)).toBe(false);
        seen.add(transition.event);
      }
    }
  });

  it("gives every non-terminal state at least one exit", () => {
    for (const state of DEAL_STATES) {
      if (!isTerminal(state)) {
        expect(transitionsFrom(state).length).toBeGreaterThan(0);
      }
    }
  });
});
