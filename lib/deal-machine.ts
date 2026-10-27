import type { Localized } from "./i18n";
import { L } from "./i18n";

/**
 * The deal state machine.
 *
 * This module is intentionally free of React, i18n state and mock data: it is the
 * single source of truth the UI is driven by. Every edge carries the actor that
 * may fire it and a precondition that is evaluated against the deal context.
 */

export const DEAL_STATES = [
  "CREATED",
  "FUNDED",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "RELEASED",
  "DISPUTED",
  "REFUNDED",
] as const;

export type DealState = (typeof DEAL_STATES)[number];

/** The linear part of the flow, used by the stepper. */
export const HAPPY_PATH = [
  "CREATED",
  "FUNDED",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "RELEASED",
] as const satisfies readonly DealState[];

export const DEAL_EVENTS = [
  "FUND",
  "SHIP",
  "IN_TRANSIT",
  "DELIVER",
  "BUYER_CONFIRM",
  "AUTO_RELEASE",
  "OPEN_DISPUTE",
  "REVIEW_REFUND",
  "REVIEW_RELEASE",
] as const;

export type DealEvent = (typeof DEAL_EVENTS)[number];

export const ACTORS = ["buyer", "vendor", "courier", "partner", "system", "reviewer"] as const;

export type Actor = (typeof ACTORS)[number];

export type DeliveryPath = "platform" | "own";

export interface DealContext {
  /** Platform courier produces stronger delivery evidence than a vendor's own courier. */
  readonly deliveryPath: DeliveryPath;
  /** Mandatory before dispatch, for either path. */
  readonly trackingRef: string | null;
  /** Required only for the vendor's own courier. */
  readonly liabilitySigned: boolean;
}

export type GuardCode =
  | "MISSING_TRACKING"
  | "UNSIGNED_LIABILITY"
  | "AUTO_RELEASE_WINDOW_TBD"
  | "EVENT_NOT_ALLOWED"
  | "TERMINAL_STATE";

export type GuardResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: GuardCode };

export type Guard = (context: DealContext) => GuardResult;

export interface Transition {
  readonly event: DealEvent;
  /** Short, human-readable precondition shown in the UI. */
  readonly requires: Localized;
  readonly to: DealState;
  readonly actor: Actor;
  readonly guard: Guard;
}

const allow: Guard = () => ({ ok: true });

const shipGuard: Guard = (context) => {
  if (!context.trackingRef || context.trackingRef.trim().length === 0) {
    return { ok: false, code: "MISSING_TRACKING" };
  }
  if (context.deliveryPath === "own" && !context.liabilitySigned) {
    return { ok: false, code: "UNSIGNED_LIABILITY" };
  }
  return { ok: true };
};

/**
 * The auto-release window is a commercial term that has not been set, so the demo
 * deliberately keeps this edge blocked instead of inventing a duration.
 */
const autoReleaseGuard: Guard = () => ({ ok: false, code: "AUTO_RELEASE_WINDOW_TBD" });

export const TRANSITIONS: Readonly<Record<DealState, readonly Transition[]>> = {
  CREATED: [
    {
      event: "FUND",
      to: "FUNDED",
      actor: "partner",
      requires: L(
        "Verified partner callback confirms the hold",
        "Uthibitisho wa mshirika unathibitisha fedha zimehifadhiwa",
      ),
      guard: allow,
    },
  ],
  FUNDED: [
    {
      event: "SHIP",
      to: "SHIPPED",
      actor: "vendor",
      requires: L(
        "Tracking reference recorded before dispatch",
        "Namba ya ufuatiliaji imerekodiwa kabla ya kusafirisha",
      ),
      guard: shipGuard,
    },
  ],
  SHIPPED: [
    {
      event: "IN_TRANSIT",
      to: "IN_TRANSIT",
      actor: "courier",
      requires: L("Pickup or handover recorded", "Kuchukuliwa au kukabidhiwa kumerekodiwa"),
      guard: allow,
    },
    {
      event: "OPEN_DISPUTE",
      to: "DISPUTED",
      actor: "buyer",
      requires: L("Buyer reports an issue", "Mnunuzi anaripoti tatizo"),
      guard: allow,
    },
  ],
  IN_TRANSIT: [
    {
      event: "DELIVER",
      to: "DELIVERED",
      actor: "courier",
      requires: L("Delivery evidence attached", "Ushahidi wa uwasilishaji umeambatishwa"),
      guard: allow,
    },
    {
      event: "OPEN_DISPUTE",
      to: "DISPUTED",
      actor: "buyer",
      requires: L("Buyer reports an issue", "Mnunuzi anaripoti tatizo"),
      guard: allow,
    },
  ],
  DELIVERED: [
    {
      event: "BUYER_CONFIRM",
      to: "RELEASED",
      actor: "buyer",
      requires: L("Buyer confirms receipt", "Mnunuzi anathibitisha amepokea"),
      guard: allow,
    },
    {
      event: "AUTO_RELEASE",
      to: "RELEASED",
      actor: "system",
      requires: L(
        "Auto-release window elapsed (TBD — set in the Terms)",
        "Muda wa kutolewa kiotomatiki umepita (TBD — imewekwa katika Masharti)",
      ),
      guard: autoReleaseGuard,
    },
    {
      event: "OPEN_DISPUTE",
      to: "DISPUTED",
      actor: "buyer",
      requires: L("Buyer reports an issue", "Mnunuzi anaripoti tatizo"),
      guard: allow,
    },
  ],
  DISPUTED: [
    {
      event: "REVIEW_REFUND",
      to: "REFUNDED",
      actor: "reviewer",
      requires: L("Human reviewer upholds the dispute", "Mkaguzi (mtu) anakubali mgogoro"),
      guard: allow,
    },
    {
      event: "REVIEW_RELEASE",
      to: "RELEASED",
      actor: "reviewer",
      requires: L("Human reviewer dismisses the dispute", "Mkaguzi (mtu) anakataa mgogoro"),
      guard: allow,
    },
  ],
  RELEASED: [],
  REFUNDED: [],
};

export interface EvaluatedTransition {
  readonly transition: Transition;
  readonly guard: GuardResult;
}

export type ApplyResult =
  | { readonly ok: true; readonly state: DealState; readonly transition: Transition }
  | {
      readonly ok: false;
      readonly code: GuardCode;
      readonly transition: Transition | null;
    };

export function isDealState(value: unknown): value is DealState {
  return typeof value === "string" && (DEAL_STATES as readonly string[]).includes(value);
}

export function transitionsFrom(state: DealState): readonly Transition[] {
  return TRANSITIONS[state];
}

export function findTransition(state: DealState, event: DealEvent): Transition | null {
  return transitionsFrom(state).find((transition) => transition.event === event) ?? null;
}

export function isTerminal(state: DealState): boolean {
  return transitionsFrom(state).length === 0;
}

export function evaluateTransition(
  state: DealState,
  event: DealEvent,
  context: DealContext,
): EvaluatedTransition | null {
  const transition = findTransition(state, event);
  if (!transition) return null;
  return { transition, guard: transition.guard(context) };
}

/** Every edge leaving a state, annotated with whether its precondition holds. */
export function allowedTransitions(state: DealState, context: DealContext): EvaluatedTransition[] {
  return transitionsFrom(state).map((transition) => ({
    transition,
    guard: transition.guard(context),
  }));
}

/** The edge a "Next" button should follow: the first allowed one, else the first one. */
export function primaryTransition(
  state: DealState,
  context: DealContext,
): EvaluatedTransition | null {
  const evaluated = allowedTransitions(state, context);
  return evaluated.find((entry) => entry.guard.ok) ?? evaluated[0] ?? null;
}

/** Pure, total transition function. It never throws; callers inspect the result. */
export function applyEvent(
  state: DealState,
  event: DealEvent,
  context: DealContext,
): ApplyResult {
  const evaluated = evaluateTransition(state, event, context);
  if (!evaluated) {
    return {
      ok: false,
      code: isTerminal(state) ? "TERMINAL_STATE" : "EVENT_NOT_ALLOWED",
      transition: null,
    };
  }
  if (!evaluated.guard.ok) {
    return { ok: false, code: evaluated.guard.code, transition: evaluated.transition };
  }
  return { ok: true, state: evaluated.transition.to, transition: evaluated.transition };
}
