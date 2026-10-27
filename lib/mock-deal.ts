import type { Actor, DealState, DeliveryPath } from "./deal-machine";
import { L, type Localized } from "./i18n";
import { appendLedger, type LedgerEntry } from "./ledger";

export const DEFAULT_TRACKING_REF = "AMN-4K7Q";

export const ORDER = {
  ref: "ORD-2481",
  vendor: "Zuri Threads",
  buyer: L("Wanjiku", "Wanjiku"),
  item: L("Kitenge tote bag", "Begi la kitenge"),
  amountKes: 4500,
  currency: "KES",
  holdRef: "HL-7F2A",
  trackingRef: DEFAULT_TRACKING_REF,
} as const;

export type ChatSender = "buyer" | "vendor" | "courier" | "partner" | "reviewer" | "system";

export interface ChatMessage {
  readonly id: string;
  readonly from: ChatSender;
  readonly text: Localized;
  /** Rendered as a partner-verified callback, never as a screenshot. */
  readonly verified?: boolean;
}

export interface AuditEntry {
  readonly id: string;
  readonly actor: Actor;
  readonly action: Localized;
  readonly detail: Localized;
}

export interface EvidenceItem {
  readonly label: Localized;
  readonly detail: Localized;
  /** Counts toward the path's maximum evidence strength. */
  readonly met: boolean;
  /** State at which this evidence becomes available; null means never. */
  readonly readyAt: DealState | null;
}

export interface EvidenceProfile {
  readonly strength: "strong" | "moderate";
  readonly score: number;
  readonly total: number;
  readonly items: readonly EvidenceItem[];
  readonly note: Localized;
}

const message = (
  id: string,
  from: ChatSender,
  text: Localized,
  verified = false,
): ChatMessage => ({ id, from, text, verified });

/**
 * Messages that appear when entering a state. The UI concatenates them along the
 * visited trail, so the conversation builds up step by step.
 */
export function chatForStep(
  state: DealState,
  path: DeliveryPath,
  opts: { readonly fromDispute?: boolean } = {},
): readonly ChatMessage[] {
  switch (state) {
    case "CREATED":
      return [
        message("created-1", "buyer", L("Hi! Is the kitenge tote still available?", "Habari! Begi la kitenge bado linapatikana?")),
        message("created-2", "vendor", L("Yes 🌿 KES 4,500. I can ship today.", "Ndiyo 🌿 KES 4,500. Naweza kusafirisha leo.")),
        message(
          "created-3",
          "vendor",
          L(
            "Pay through the AmanaLink link — the money sits in a protected hold until you confirm.",
            "Lipa kupitia kiungo cha AmanaLink — fedha zinakaa kwenye ulinzi hadi uthibitishe.",
          ),
        ),
        message(
          "created-4",
          "partner",
          L(
            "Protected checkout · funds held by a CBK-licensed partner",
            "Malipo ya ulinzi · fedha zinahifadhiwa na mshirika aliyeidhinishwa na CBK",
          ),
          true,
        ),
      ];
    case "FUNDED":
      return [
        message(
          "funded-1",
          "partner",
          L(
            "Payment verified · KES 4,500 in the hold · ref HL-7F2A",
            "Malipo yamethibitishwa · KES 4,500 kwenye ulinzi · kumbukumbu HL-7F2A",
          ),
          true,
        ),
        message(
          "funded-2",
          "system",
          L(
            "Screenshots and SMS are not accepted as proof of payment.",
            "Picha za skrini na SMS hazikubaliki kama uthibitisho wa malipo.",
          ),
        ),
        message(
          "funded-3",
          "vendor",
          L("Packing now. Tracking reference AMN-4K7Q.", "Ninapakia sasa. Namba ya ufuatiliaji AMN-4K7Q."),
        ),
      ];
    case "SHIPPED":
      return [
        message(
          "shipped-1",
          "system",
          L("Shipment created · tracking AMN-4K7Q", "Usafirishaji umeundwa · ufuatiliaji AMN-4K7Q"),
        ),
        path === "platform"
          ? message(
              "shipped-2",
              "courier",
              L(
                "Handed to the platform courier. Pickup scan next.",
                "Imekabidhiwa kwa msafirishaji wa jukwaa. Ukaguzi wa kuchukua unafuata.",
              ),
            )
          : message(
              "shipped-2",
              "vendor",
              L(
                "Handed to my courier under the signed liability agreement.",
                "Imekabidhiwa kwa msafirishaji wangu chini ya makubaliano ya dhima yaliyotiwa saini.",
              ),
            ),
        message("shipped-3", "buyer", L("Thanks — I'll track it.", "Asante — nitaifuatilia.")),
      ];
    case "IN_TRANSIT":
      return [
        path === "platform"
          ? message(
              "transit-1",
              "courier",
              L("Pickup scan recorded. Moving to Westlands.", "Ukaguzi wa kuchukua umerekodiwa. Tunaelekea Westlands."),
            )
          : message(
              "transit-1",
              "vendor",
              L("Out for delivery — my rider has it.", "Iko njiani — mwendesha wangu anayo."),
            ),
        message("transit-2", "buyer", L("Great, I'm around.", "Sawa, nipo karibu.")),
      ];
    case "DELIVERED":
      return [
        path === "platform"
          ? message(
              "delivered-1",
              "courier",
              L(
                "Delivery recorded · signature and photo attached.",
                "Uwasilishaji umerekodiwa · sahihi na picha zimeambatishwa.",
              ),
            )
          : message(
              "delivered-1",
              "vendor",
              L("Delivered. Please confirm in the app.", "Imefikishwa. Tafadhali thibitisha kwenye app."),
            ),
        message(
          "delivered-2",
          "partner",
          L(
            "Funds release on your confirmation. Auto-release window: TBD — set in the Terms.",
            "Fedha hutolewa baada ya uthibitisho wako. Muda wa kutolewa kiotomatiki: TBD — imewekwa katika Masharti.",
          ),
          true,
        ),
        message("delivered-3", "buyer", L("Received — checking the bag now.", "Nimepokea — naangalia begi sasa.")),
      ];
    case "DISPUTED":
      return [
        message(
          "disputed-1",
          "buyer",
          L("The strap is torn. I'd like a refund.", "Kamba imepasuka. Ningependa kurejeshewa fedha."),
        ),
        message(
          "disputed-2",
          "system",
          L("Dispute opened. Funds stay in the hold.", "Mgogoro umefunguliwa. Fedha zinabaki kwenye ulinzi."),
        ),
        message(
          "disputed-3",
          "reviewer",
          L(
            "I'm reviewing the photos, tracking events and delivery record.",
            "Ninakagua picha, matukio ya ufuatiliaji na kumbukumbu ya uwasilishaji.",
          ),
        ),
      ];
    case "REFUNDED":
      return [
        message(
          "refunded-1",
          "reviewer",
          L("Review upheld. Refund approved for the buyer.", "Ukaguzi umekubali. Marejesho yameidhinishwa kwa mnunuzi."),
        ),
        message(
          "refunded-2",
          "partner",
          L("KES 4,500 refunded · hold closed", "KES 4,500 zimerejeshwa · ulinzi umefungwa"),
          true,
        ),
        message("refunded-3", "buyer", L("Thank you.", "Asante.")),
      ];
    case "RELEASED":
      return opts.fromDispute
        ? [
            message(
              "released-dispute-1",
              "reviewer",
              L("Delivery evidence was sufficient. Dispute dismissed.", "Ushahidi wa uwasilishaji ulitosha. Mgogoro umekataliwa."),
            ),
            message(
              "released-dispute-2",
              "partner",
              L("KES 4,500 released to the vendor · hold closed", "KES 4,500 zimetolewa kwa muuzaji · ulinzi umefungwa"),
              true,
            ),
            message(
              "released-dispute-3",
              "system",
              L("Human decision recorded. AI did not decide this outcome.", "Uamuzi wa mtu umerekodiwa. AI haikuamua jambo hili."),
            ),
          ]
        : [
            message(
              "released-1",
              "partner",
              L(
                "Buyer confirmed · KES 4,500 released to the vendor · ref AMN-4K7Q",
                "Mnunuzi amethibitisha · KES 4,500 zimetolewa kwa muuzaji · kumbukumbu AMN-4K7Q",
              ),
              true,
            ),
            message("released-2", "vendor", L("Asante! 🙏", "Asante! 🙏")),
          ];
    default:
      return [];
  }
}

export const evidenceByPath: Record<DeliveryPath, EvidenceProfile> = {
  platform: {
    strength: "strong",
    score: 4,
    total: 4,
    items: [
      {
        label: L("Verified partner callback", "Uthibitisho wa mshirika"),
        detail: L("Funds confirmed by the partner, not a screenshot", "Fedha zimethibitishwa na mshirika, si picha ya skrini"),
        met: true,
        readyAt: "FUNDED",
      },
      {
        label: L("Tracking reference", "Namba ya ufuatiliaji"),
        detail: L("AMN-4K7Q recorded before dispatch", "AMN-4K7Q imerekodiwa kabla ya kusafirisha"),
        met: true,
        readyAt: "SHIPPED",
      },
      {
        label: L("Courier pickup scan", "Ukaguzi wa kuchukua"),
        detail: L("Platform courier event at handover", "Tukio la msafirishaji wa jukwaa wakati wa kukabidhi"),
        met: true,
        readyAt: "IN_TRANSIT",
      },
      {
        label: L("Proof of delivery", "Uthibitisho wa uwasilishaji"),
        detail: L("Signature and photo attached", "Sahihi na picha zimeambatishwa"),
        met: true,
        readyAt: "DELIVERED",
      },
    ],
    note: L(
      "Partner callback, courier scans and proof of delivery.",
      "Uthibitisho wa mshirika, ukaguzi wa msafirishaji na uthibitisho wa uwasilishaji.",
    ),
  },
  own: {
    strength: "moderate",
    score: 2,
    total: 4,
    items: [
      {
        label: L("Signed liability agreement", "Makubaliano ya dhima yaliyotiwa saini"),
        detail: L("Vendor accepts liability for the parcel", "Muuzaji anakubali dhima ya kifurushi"),
        met: true,
        readyAt: "SHIPPED",
      },
      {
        label: L("Tracking reference", "Namba ya ufuatiliaji"),
        detail: L("AMN-4K7Q recorded before dispatch", "AMN-4K7Q imerekodiwa kabla ya kusafirisha"),
        met: true,
        readyAt: "SHIPPED",
      },
      {
        label: L("Vendor delivery note", "Hati ya uwasilishaji ya muuzaji"),
        detail: L("Self-reported handover", "Kukabidhi kunakoripotiwa na muuzaji"),
        met: false,
        readyAt: "DELIVERED",
      },
      {
        label: L("Independent delivery event", "Tukio huru la uwasilishaji"),
        detail: L("Not available without a platform courier", "Haipatikani bila msafirishaji wa jukwaa"),
        met: false,
        readyAt: null,
      },
    ],
    note: L(
      "Vendor tracking plus a signed liability agreement. Weaker than a platform courier.",
      "Ufuatiliaji wa muuzaji pamoja na makubaliano ya dhima yaliyotiwa saini. Ni hafifu kuliko msafirishaji wa jukwaa.",
    ),
  },
};

export function auditForStep(
  state: DealState,
  path: DeliveryPath,
  opts: { readonly fromDispute?: boolean } = {},
): readonly AuditEntry[] {
  switch (state) {
    case "CREATED":
      return [
        {
          id: "audit-created-1",
          actor: "vendor",
          action: L("Deal created", "Muamala umeundwa"),
          detail: L("Order, buyer and delivery path recorded", "Agizo, mnunuzi na njia ya uwasilishaji zimerekodiwa"),
        },
        {
          id: "audit-created-2",
          actor: "buyer",
          action: L("Terms presented", "Masharti yamewasilishwa"),
          detail: L(
            "Escrow fee, auto-release window and payout holds: TBD",
            "Ada ya escrow, muda wa kutolewa kiotomatiki na kushikilia malipo: TBD",
          ),
        },
      ];
    case "FUNDED":
      return [
        {
          id: "audit-funded-1",
          actor: "partner",
          action: L("Hold funded", "Ulinzi umewekwa fedha"),
          detail: L("Verified partner callback · hold ref HL-7F2A", "Uthibitisho wa mshirika · kumbukumbu HL-7F2A"),
        },
        {
          id: "audit-funded-2",
          actor: "system",
          action: L("Proof-of-payment policy", "Kanuni ya uthibitisho wa malipo"),
          detail: L("Screenshots and SMS rejected as evidence", "Picha za skrini na SMS zimekataliwa kama ushahidi"),
        },
      ];
    case "SHIPPED":
      return [
        {
          id: "audit-shipped-1",
          actor: "vendor",
          action: L("Shipment created", "Usafirishaji umeundwa"),
          detail: L("Tracking ref AMN-4K7Q", "Namba ya ufuatiliaji AMN-4K7Q"),
        },
        path === "own"
          ? {
              id: "audit-shipped-2",
              actor: "vendor",
              action: L("Liability agreement signed", "Makubaliano ya dhima yametiwa saini"),
              detail: L("Vendor courier covered by a signed agreement", "Msafirishaji wa muuzaji amefunikwa na makubaliano yaliyotiwa saini"),
            }
          : {
              id: "audit-shipped-2",
              actor: "system",
              action: L("Platform courier assigned", "Msafirishaji wa jukwaa amepangwa"),
              detail: L("Courier events will be independent of the vendor", "Matukio ya msafirishaji yatakuwa huru kutoka kwa muuzaji"),
            },
      ];
    case "IN_TRANSIT":
      return [
        {
          id: "audit-transit-1",
          actor: "courier",
          action: L("Pickup recorded", "Kuchukuliwa kumerekodiwa"),
          detail:
            path === "platform"
              ? L("Platform scan at pickup", "Ukaguzi wa jukwaa wakati wa kuchukua")
              : L("Vendor courier handover logged", "Kukabidhi kwa msafirishaji wa muuzaji kumerekodiwa"),
        },
      ];
    case "DELIVERED":
      return [
        {
          id: "audit-delivered-1",
          actor: "courier",
          action: L("Delivery recorded", "Uwasilishaji umerekodiwa"),
          detail:
            path === "platform"
              ? L("Signature and photo attached", "Sahihi na picha zimeambatishwa")
              : L("Vendor delivery note attached", "Hati ya uwasilishaji ya muuzaji imeambatishwa"),
        },
        {
          id: "audit-delivered-2",
          actor: "system",
          action: L("Release options", "Njia za kutolewa"),
          detail: L("Buyer confirmation, or auto-release (TBD)", "Uthibitisho wa mnunuzi, au kutolewa kiotomatiki (TBD)"),
        },
      ];
    case "DISPUTED":
      return [
        {
          id: "audit-disputed-1",
          actor: "buyer",
          action: L("Dispute opened", "Mgogoro umefunguliwa"),
          detail: L("Reason: damaged item · funds remain in the hold", "Sababu: bidhaa imeharibika · fedha zinabaki kwenye ulinzi"),
        },
        {
          id: "audit-disputed-2",
          actor: "reviewer",
          action: L("Assigned to human review", "Imepewa ukaguzi wa mtu"),
          detail: L("AI summary attached as advisory only", "Muhtasari wa AI umeambatishwa kama ushauri tu"),
        },
      ];
    case "REFUNDED":
      return [
        {
          id: "audit-refunded-1",
          actor: "reviewer",
          action: L("Dispute upheld", "Mgogoro umekubaliwa"),
          detail: L("Buyer evidence reviewed by a person", "Ushahidi wa mnunuzi umekaguliwa na mtu"),
        },
        {
          id: "audit-refunded-2",
          actor: "partner",
          action: L("Funds refunded", "Fedha zimerejeshwa"),
          detail: L("KES 4,500 returned to the buyer", "KES 4,500 zimerudishwa kwa mnunuzi"),
        },
      ];
    case "RELEASED":
      return opts.fromDispute
        ? [
            {
              id: "audit-released-d-1",
              actor: "reviewer",
              action: L("Dispute dismissed", "Mgogoro umekataliwa"),
              detail: L("Delivery evidence reviewed by a person", "Ushahidi wa uwasilishaji umekaguliwa na mtu"),
            },
            {
              id: "audit-released-d-2",
              actor: "partner",
              action: L("Funds released", "Fedha zimetolewa"),
              detail: L("KES 4,500 to the vendor · hold closed", "KES 4,500 kwa muuzaji · ulinzi umefungwa"),
            },
          ]
        : [
            {
              id: "audit-released-1",
              actor: "buyer",
              action: L("Buyer confirmed", "Mnunuzi amethibitisha"),
              detail: L("Release instruction sent to the partner", "Maelekezo ya kutolewa yametumwa kwa mshirika"),
            },
            {
              id: "audit-released-2",
              actor: "partner",
              action: L("Funds released", "Fedha zimetolewa"),
              detail: L("KES 4,500 to the vendor · ref AMN-4K7Q", "KES 4,500 kwa muuzaji · kumbukumbu AMN-4K7Q"),
            },
          ];
    default:
      return [];
  }
}

/** Ledger entries implied by the states visited so far. Always rebuilt, never mutated. */
export function ledgerForTrail(trail: readonly DealState[]): LedgerEntry[] {
  let chain: LedgerEntry[] = [];
  if (trail.includes("FUNDED")) {
    chain = appendLedger(chain, {
      kind: "HOLD",
      amountKes: ORDER.amountKes,
      memo: ORDER.holdRef,
    });
  }
  if (trail.includes("RELEASED")) {
    chain = appendLedger(chain, {
      kind: "RELEASE",
      amountKes: -ORDER.amountKes,
      memo: ORDER.trackingRef,
    });
  }
  if (trail.includes("REFUNDED")) {
    chain = appendLedger(chain, {
      kind: "REFUND",
      amountKes: -ORDER.amountKes,
      memo: ORDER.holdRef,
    });
  }
  return chain;
}
