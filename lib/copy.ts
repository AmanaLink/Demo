import type { Actor, DealState, DeliveryPath, GuardCode } from "./deal-machine";
import { L, type Localized } from "./i18n";
import type { LedgerKind } from "./ledger";

/** Labels for machine values. Kept separate from the machine so it stays pure. */
export const stateLabel: Record<DealState, Localized> = {
  CREATED: L("Created", "Imeundwa"),
  FUNDED: L("Funded", "Fedha zimehifadhiwa"),
  SHIPPED: L("Shipped", "Imesafirishwa"),
  IN_TRANSIT: L("In transit", "Njiani"),
  DELIVERED: L("Delivered", "Imefikishwa"),
  RELEASED: L("Released", "Imetolewa"),
  DISPUTED: L("Disputed", "Mgogoro"),
  REFUNDED: L("Refunded", "Imerejeshwa"),
};

export const actorLabel: Record<Actor, Localized> = {
  buyer: L("Buyer", "Mnunuzi"),
  vendor: L("Vendor", "Muuzaji"),
  courier: L("Courier", "Msafirishaji"),
  partner: L("Escrow partner", "Mshirika wa escrow"),
  system: L("System", "Mfumo"),
  reviewer: L("Human reviewer", "Mkaguzi (mtu)"),
};

export const pathLabel: Record<DeliveryPath, Localized> = {
  platform: L("Platform courier", "Msafirishaji wa jukwaa"),
  own: L("Vendor's own courier", "Msafirishaji wa muuzaji"),
};

export const ledgerKindLabel: Record<LedgerKind, Localized> = {
  HOLD: L("Hold", "Ulinzi"),
  RELEASE: L("Release", "Kutolewa"),
  REFUND: L("Refund", "Marejesho"),
};

export const guardCopy: Record<GuardCode, Localized> = {
  MISSING_TRACKING: L(
    "Add a tracking reference before dispatch.",
    "Weka namba ya ufuatiliaji kabla ya kusafirisha.",
  ),
  UNSIGNED_LIABILITY: L(
    "Sign the liability agreement to dispatch with the vendor's own courier.",
    "Tia saini makubaliano ya dhima ili kusafirisha kwa msafirishaji wa muuzaji.",
  ),
  AUTO_RELEASE_WINDOW_TBD: L(
    "Auto-release window is TBD — set in the Terms.",
    "Muda wa kutolewa kiotomatiki ni TBD — imewekwa katika Masharti.",
  ),
  EVENT_NOT_ALLOWED: L(
    "Not available from this state.",
    "Haipatikani kutoka hali hii.",
  ),
  TERMINAL_STATE: L(
    "This deal is closed. Reset to run it again.",
    "Muamala umefungwa. Anzisha upya ili kuuendesha tena.",
  ),
};

export const ui = {
  brand: "AmanaLink",
  brandTagline: L("Escrow & delivery showcase", "Onyesho la escrow na uwasilishaji"),
  banner: L(
    "Prototype, mock data — no real payments or accounts.",
    "Mfano, data ya majaribio — hakuna malipo halisi au akaunti.",
  ),
  bannerTag: L("Prototype, mock data", "Mfano, data ya majaribio"),
  bannerRest: L("No real payments or accounts.", "Hakuna malipo halisi au akaunti."),
  skip: L("Skip to content", "Ruka hadi maudhui"),
  language: L("Language", "Lugha"),
  themeDark: L("Switch to dark mode", "Badilisha kwenda hali ya giza"),
  themeLight: L("Switch to light mode", "Badilisha kwenda hali ya mwanga"),

  nav: {
    overview: L("Overview", "Muhtasari"),
    dealFlow: L("Deal flow", "Mtiririko"),
    disputes: L("Disputes", "Migogoro"),
    delivery: L("Delivery paths", "Njia za uwasilishaji"),
    trust: L("Trust & safety", "Uaminifu na usalama"),
    roadmap: L("Roadmap", "Ramani"),
  },

  common: {
    tbd: L("TBD", "TBD"),
    mock: L("Mock", "Mfano"),
    readRules: L("Read the rules", "Soma kanuni"),
    walkFlow: L("Walk the deal flow", "Pitia mtiririko wa muamala"),
    seeInFlow: L("See it in the deal flow", "Ione kwenye mtiririko"),
    verified: L("Verified", "Imethibitishwa"),
    all: L("All", "Zote"),
  },

  overview: {
    eyebrow: L(
      "Escrow + delivery for social commerce",
      "Escrow na uwasilishaji kwa biashara ya mtandao",
    ),
    title: L("Trust, built into the chat.", "Uaminifu, ndani ya mazungumzo."),
    lede: L(
      "Buyers pay into a protected hold. Vendors ship with a tracking reference. Money moves only when the deal does.",
      "Wanunuzi wanalipa kwenye akaunti ya ulinzi. Wauzaji wanasafirisha kwa namba ya ufuatiliaji. Fedha husonga tu pale muamala unaposonga.",
    ),
    principlesTitle: L(
      "Three rules the product cannot break",
      "Kanuni tatu ambazo bidhaa haiwezi kuvunja",
    ),
    principles: [
      {
        title: L("Funds sit with a CBK-licensed partner", "Fedha zinahifadhiwa na mshirika aliyeidhinishwa na CBK"),
        body: L(
          "We never hold buyer money. Release instructions come from the partner, on a verified callback.",
          "Sisi hatushikilii fedha za mnunuzi. Maelekezo ya kutolewa yanatoka kwa mshirika, kwa uthibitisho.",
        ),
      },
      {
        title: L("Delivery is proven, not assumed", "Uwasilishaji unathibitishwa, haudhaniwi"),
        body: L(
          "A tracking reference is mandatory before dispatch. The delivery path decides how strong the evidence is.",
          "Namba ya ufuatiliaji ni lazima kabla ya kusafirisha. Njia ya uwasilishaji huamua nguvu ya ushahidi.",
        ),
      },
      {
        title: L("Humans decide money outcomes", "Watu huamua masuala ya fedha"),
        body: L(
          "AI can summarise and flag. It never releases funds, closes accounts or rules on a dispute.",
          "AI inaweza kufupisha na kuonya. Haiwezi kutoa fedha, kufunga akaunti au kuamua mgogoro.",
        ),
      },
    ],
    moneyTitle: L("How the money moves", "Fedha zinavyosonga"),
    moneySteps: [
      L("Buyer pays", "Mnunuzi analipa"),
      L("Partner holds funds", "Mshirika anahifadhi fedha"),
      L("Vendor ships with tracking", "Muuzaji anasafirisha kwa ufuatiliaji"),
      L("Release or dispute", "Kutolewa au mgogoro"),
    ],
    moneyNote: L(
      "The platform is the product layer. The partner is the licensed holder.",
      "Jukwaa ni tabaka la bidhaa. Mshirika ndiye anayeshikilia fedha kwa leseni.",
    ),
    termsTitle: L("Terms still open", "Masharti ambayo bado hayajawekwa"),
    termsNote: L(
      "This prototype does not invent commercial terms. These stay as placeholders until they are set in the Terms.",
      "Demo hii haiweki masharti ya kibiashara. Haya yanabaki kama nafasi hadi yawekwe katika Masharti.",
    ),
    terms: [
      L("Escrow fee", "Ada ya escrow"),
      L("Auto-release window", "Muda wa kutolewa kiotomatiki"),
      L("Payout holds", "Kushikilia malipo"),
    ],
    notTitle: L("What this demo is not", "Demo hii si nini"),
    notItems: [
      L("No backend, auth or database.", "Hakuna backend, uthibitisho wa akaunti au hifadhidata."),
      L("No real payments or partner callbacks.", "Hakuna malipo halisi au uthibitisho wa mshirika."),
      L(
        "No screenshots or SMS as proof of payment.",
        "Hakuna picha za skrini au SMS kama uthibitisho wa malipo.",
      ),
    ],
  },

  dealFlow: {
    title: L("Deal flow", "Mtiririko wa muamala"),
    lede: L(
      "One order, from hold to release. Every step is a typed transition with an actor and a precondition.",
      "Muamala mmoja, kutoka kuhifadhi hadi kutolewa. Kila hatua ni mpito ulioainishwa na mhusika na sharti.",
    ),
    path: L("Delivery path", "Njia ya uwasilishaji"),
    pathReset: L("Changing the path restarts the demo.", "Kubadilisha njia huanzisha demo upya."),
    state: L("State", "Hali"),
    next: L("Next", "Ifuatayo"),
    back: L("Back", "Rudi"),
    reset: L("Reset", "Anzisha upya"),
    reportIssue: L("Report issue", "Ripoti tatizo"),
    reportHint: L(
      "Available once the parcel is dispatched.",
      "Inapatikana baada ya kifurushi kusafirishwa.",
    ),
    autoRelease: L("Auto-release", "Kutolewa kiotomatiki"),
    autoReleaseTbd: L("TBD — set in the Terms", "TBD — imewekwa katika Masharti"),
    currentStep: L("Current state", "Hali ya sasa"),
    order: L("Order", "Agizo"),
    buyer: L("Buyer", "Mnunuzi"),
    vendor: L("Vendor", "Muuzaji"),
    item: L("Item", "Bidhaa"),
    orderValue: L("Order value (mock)", "Thamani ya agizo (mfano)"),
    holdRef: L("Hold ref", "Kumbukumbu ya ulinzi"),
    trackingRef: L("Tracking reference", "Namba ya ufuatiliaji"),
    trackingPlaceholder: L("e.g. AMN-4K7Q", "mf. AMN-4K7Q"),
    trackingUnset: L("Not set", "Haijawekwa"),
    liability: L("Liability agreement", "Makubaliano ya dhima"),
    signed: L("Signed", "Imetiwa saini"),
    notSigned: L("Not signed", "Hayajatiwa saini"),
    liabilityHint: L(
      "Required for the vendor's own courier.",
      "Inahitajika kwa msafirishaji wa muuzaji.",
    ),
    evidence: L("Evidence strength", "Nguvu ya ushahidi"),
    evidenceStrong: L("Strong", "Imara"),
    evidenceModerate: L("Moderate", "Wastani"),
    evidenceNotePlatform: L(
      "Partner callback, courier scans and proof of delivery.",
      "Uthibitisho wa mshirika, ukaguzi wa msafirishaji na uthibitisho wa uwasilishaji.",
    ),
    evidenceNoteOwn: L(
      "Vendor tracking plus a signed liability agreement. Weaker than a platform courier.",
      "Ufuatiliaji wa muuzaji pamoja na makubaliano ya dhima yaliyotiwa saini. Ni hafifu kuliko msafirishaji wa jukwaa.",
    ),
    audit: L("Audit log", "Kumbukumbu za ukaguzi"),
    auditEmpty: L("No entries yet.", "Hakuna kumbukumbu bado."),
    ledger: L("Ledger", "Leja"),
    ledgerAppendOnly: L("Append-only · hash-chained", "Inaongezwa tu · imefungwa kwa hash"),
    ledgerVerified: L("Chain verified", "Mnyororo umethibitishwa"),
    ledgerEmpty: L(
      "No entries yet. The hold is posted when funding is confirmed.",
      "Hakuna kumbukumbu bado. Ulinzi huwekwa fedha zinapothibitishwa.",
    ),
    ledgerFee: L(
      "Escrow fee: TBD — not posted until set in the Terms.",
      "Ada ya escrow: TBD — haijawekwa hadi itakapowekwa katika Masharti.",
    ),
    amount: L("Amount", "Kiasi"),
    hash: L("Hash", "Hash"),
    seq: L("Seq", "Mfuatano"),
    disputeBranch: L("Dispute branch", "Tawi la mgogoro"),
    humanOnly: L("Human decision required", "Uamuzi wa mtu unatakiwa"),
    uphold: L("Uphold buyer → refund", "Kubali mnunuzi → rejesha"),
    dismiss: L("Dismiss → release", "Kataa → toa fedha"),
    disputeHint: L(
      "A human reviewer decides. Funds stay in the hold until then.",
      "Mkaguzi (mtu) anaamua. Fedha zinabaki kwenye ulinzi hadi wakati huo.",
    ),
    closed: L(
      "This deal is closed. Reset to run it again.",
      "Muamala umefungwa. Anzisha upya ili kuuendesha tena.",
    ),
    blocked: L("Blocked", "Imezuiwa"),
    allowed: L("Allowed", "Inaruhusiwa"),
    nextActor: L("Next actor", "Mhusika anayefuata"),
    requires: L("Precondition", "Sharti"),
    stepLabel: L("Step", "Hatua"),
  },

  phone: {
    businessName: "Zuri Threads",
    verifiedBusiness: L("Verified business", "Biashara iliyothibitishwa"),
    today: L("Order · KES 4,500 (mock)", "Agizo · KES 4,500 (mfano)"),
    placeholder: L("Prototype chat — not connected", "Gumzo la mfano — halijaunganishwa"),
    partnerCallback: L("Verified partner callback", "Uthibitisho wa mshirika"),
    system: L("System", "Mfumo"),
    secureBanner: L(
      "Funds are held by a CBK-licensed partner. Never by us.",
      "Fedha zinahifadhiwa na mshirika aliyeidhinishwa na CBK. Sio sisi.",
    ),
  },

  disputes: {
    title: L("Disputes", "Migogoro"),
    lede: L(
      "A dispute pauses the release. Funds stay in the hold until a human reviewer decides, using evidence both sides can see.",
      "Mgogoro husimamisha utoaji. Fedha zinabaki kwenye ulinzi hadi mkaguzi (mtu) atakapoamua, kwa kutumia ushahidi ambao pande zote zinaweza kuona.",
    ),
    outcomesTitle: L("Three ways a review ends", "Njia tatu ambazo ukaguzi huisha"),
    outcomes: [
      {
        title: L("Uphold → refund", "Kubali → rejesha"),
        body: L(
          "Buyer evidence is sufficient. The partner returns the held funds.",
          "Ushahidi wa mnunuzi unatosha. Mshirika anarejesha fedha zilizohifadhiwa.",
        ),
      },
      {
        title: L("Dismiss → release", "Kataa → toa"),
        body: L(
          "Delivery evidence is sufficient. The partner releases funds to the vendor.",
          "Ushahidi wa uwasilishaji unatosha. Mshirika anatoa fedha kwa muuzaji.",
        ),
      },
      {
        title: L("Request more evidence", "Omba ushahidi zaidi"),
        body: L(
          "The reviewer asks both sides for specific records. The hold stays put.",
          "Mkaguzi anaomba pande zote kumbukumbu maalum. Ulinzi unabaki palepale.",
        ),
      },
    ],
    seesTitle: L("What the reviewer sees", "Mkaguzi anaona nini"),
    sees: [
      L("Tracking events from the courier", "Matukio ya ufuatiliaji kutoka kwa msafirishaji"),
      L("Delivery record and handover evidence", "Kumbukumbu ya uwasilishaji na ushahidi wa kukabidhi"),
      L("Order details and the chat thread", "Maelezo ya agizo na mazungumzo"),
      L(
        "Item photos as evidence of condition — never as proof of payment",
        "Picha za bidhaa kama ushahidi wa hali — sio uthibitisho wa malipo",
      ),
    ],
    aiTitle: L("AI, advisory only", "AI, ushauri tu"),
    aiBody: L(
      "AI may summarise the conversation and surface missing evidence. A person makes the call, and the ledger records who decided.",
      "AI inaweza kufupisha mazungumzo na kuonyesha ushahidi unaokosekana. Mtu hufanya uamuzi, na leja hurekodi nani aliamua.",
    ),
    caseTitle: L("Mock case · torn strap", "Kesi ya mfano · kamba iliyopasuka"),
    caseBody: L(
      "A kitenge tote arrives with a torn strap. The buyer opens a dispute before confirming. The hold does not move.",
      "Begi la kitenge linafika na kamba iliyopasuka. Mnunuzi anafungua mgogoro kabla ya kuthibitisha. Ulinzi hausongi.",
    ),
    caseSteps: [
      L("Dispute opened", "Mgogoro umefunguliwa"),
      L("Evidence reviewed", "Ushahidi umekaguliwa"),
      L("Decision recorded", "Uamuzi umerekodiwa"),
    ],
    decision: L("Decision", "Uamuzi"),
    decisionValue: L("Refund upheld by a human reviewer", "Marejesho yamekubaliwa na mkaguzi (mtu)"),
    advisory: L("AI note — advisory only", "Dokezo la AI — ushauri tu"),
    advisoryValue: L(
      "Photos match the reported damage. Delivery scan is present. Recommendation for a human: refund.",
      "Picha zinaendana na uharibifu ulioripotiwa. Ukaguzi wa uwasilishaji upo. Pendekezo kwa mtu: rejesha.",
    ),
    window: L("Review window: TBD — set in the Terms.", "Muda wa ukaguzi: TBD — imewekwa katika Masharti."),
  },

  delivery: {
    title: L("Delivery paths", "Njia za uwasilishaji"),
    lede: L(
      "Two ways to move a parcel. Both require a tracking reference. Only the platform courier produces independent delivery evidence.",
      "Njia mbili za kusafirisha kifurushi. Zote zinahitaji namba ya ufuatiliaji. Ni msafirishaji wa jukwaa pekee anayetoa ushahidi huru wa uwasilishaji.",
    ),
    rows: {
      whoCarries: L("Who carries", "Nani anasafirisha"),
      liability: L("Liability", "Dhima"),
      tracking: L("Tracking reference", "Namba ya ufuatiliaji"),
      proof: L("Delivery proof", "Uthibitisho wa uwasilishaji"),
      evidence: L("Evidence strength", "Nguvu ya ushahidi"),
      release: L("Release support", "Msaada wa kutolewa"),
      bestFor: L("Best for", "Inafaa kwa"),
    },
    platformValues: {
      whoCarries: L("Platform courier", "Msafirishaji wa jukwaa"),
      liability: L("Signed platform courier agreement", "Makubaliano ya msafirishaji wa jukwaa yaliyotiwa saini"),
      tracking: L("Required before dispatch", "Inahitajika kabla ya kusafirisha"),
      proof: L("Pickup scan, signature, photo", "Ukaguzi wa kuchukua, sahihi, picha"),
      evidence: L("Strong", "Imara"),
      release: L("Independent courier events", "Matukio huru ya msafirishaji"),
      bestFor: L("Higher-value orders", "Maagizo ya thamani kubwa"),
    },
    ownValues: {
      whoCarries: L("Vendor's courier", "Msafirishaji wa muuzaji"),
      liability: L("Signed liability agreement (vendor)", "Makubaliano ya dhima yaliyotiwa saini (muuzaji)"),
      tracking: L("Required before dispatch", "Inahitajika kabla ya kusafirisha"),
      proof: L("Vendor delivery note + buyer confirmation", "Hati ya muuzaji + uthibitisho wa mnunuzi"),
      evidence: L("Moderate", "Wastani"),
      release: L("Vendor records, backed by the agreement", "Kumbukumbu za muuzaji, zikisaidiwa na makubaliano"),
      bestFor: L("Local, low-volume routes", "Njia za ndani, zenye maagizo machache"),
    },
    calloutTitle: L("Why the agreement matters", "Kwa nini makubaliano ni muhimu"),
    callout: L(
      "With a vendor's own courier, the delivery record is self-reported. The signed liability agreement is what makes a release defensible, and it is why the evidence meter stops at moderate.",
      "Kwa msafirishaji wa muuzaji, kumbukumbu ya uwasilishaji inatolewa na muuzaji mwenyewe. Makubaliano ya dhima yaliyotiwa saini ndiyo yanayofanya utoaji uwe na msingi, na ndiyo sababu kipimo cha ushahidi kinasimama kwa wastani.",
    ),
  },

  trust: {
    title: L("Trust & safety", "Uaminifu na usalama"),
    lede: L(
      "The guarantees are structural, not promises in a support reply.",
      "Dhamana ni za kimuundo, si ahadi kwenye jibu la msaada.",
    ),
    pillars: [
      {
        title: L("Funds with a CBK-licensed partner", "Fedha kwa mshirika aliyeidhinishwa na CBK"),
        body: L(
          "The platform never touches buyer money. CBK is the Central Bank of Kenya.",
          "Jukwaa haligusi fedha za mnunuzi. CBK ni Benki Kuu ya Kenya.",
        ),
      },
      {
        title: L("Verified callbacks, not screenshots", "Uthibitisho, si picha za skrini"),
        body: L(
          "Payment state changes only on a verified partner callback. Screenshots and SMS are never proof of payment.",
          "Hali ya malipo hubadilika tu kwa uthibitisho wa mshirika. Picha za skrini na SMS si uthibitisho wa malipo kamwe.",
        ),
      },
      {
        title: L("Tracking before dispatch", "Ufuatiliaji kabla ya kusafirisha"),
        body: L(
          "A vendor cannot mark a parcel shipped without a tracking reference.",
          "Muuzaji hawezi kuweka kifurushi kimesafirishwa bila namba ya ufuatiliaji.",
        ),
      },
      {
        title: L("Human-reviewed disputes", "Migogoro inakaguliwa na watu"),
        body: L(
          "Money outcomes are decided by a person, never by a model.",
          "Maamuzi ya fedha hufanywa na mtu, si kwa modeli.",
        ),
      },
      {
        title: L("Append-only records", "Kumbukumbu zinazoongezwa tu"),
        body: L(
          "Audit entries and ledger rows are hash-chained and cannot be edited in place.",
          "Kumbukumbu za ukaguzi na leja zimefungwa kwa hash na haziwezi kuhaririwa.",
        ),
      },
      {
        title: L("Minimum data", "Data ya kutosha tu"),
        body: L(
          "Phone number, order and delivery events. The demo stores no identity documents.",
          "Namba ya simu, agizo na matukio ya uwasilishaji. Demo haihifadhi hati za utambulisho.",
        ),
      },
    ],
    limitsTitle: L("Hard limits for AI", "Mipaka migumu kwa AI"),
    limits: [
      L("Cannot release or refund funds", "Haiwezi kutoa au kurejesha fedha"),
      L("Cannot suspend or close an account", "Haiwezi kusimamisha au kufunga akaunti"),
      L("Cannot decide a dispute", "Haiwezi kuamua mgogoro"),
      L("Cannot mark a payment as received", "Haiwezi kuweka malipo kama yamepokelewa"),
    ],
    limitsNote: L(
      "AI may summarise, translate, flag missing evidence and route cases. Those are advisories, not decisions.",
      "AI inaweza kufupisha, kutafsiri, kuonyesha ushahidi unaokosekana na kuelekeza kesi. Hizo ni ushauri, si maamuzi.",
    ),
  },

  roadmap: {
    title: L("Roadmap", "Ramani ya maendeleo"),
    lede: L(
      "Sequenced by dependency, not by date. Timelines are TBD.",
      "Imepangwa kwa utegemezi, si kwa tarehe. Muda ni TBD.",
    ),
    timeline: L("Timeline: TBD", "Muda: TBD"),
    phases: [
      {
        title: L("Now — prototype", "Sasa — mfano"),
        items: [
          L("Typed deal state machine", "Mashine ya hali ya muamala"),
          L("WhatsApp-style deal flow", "Mtiririko wa muamala kama WhatsApp"),
          L("Audit log and hash-chained ledger", "Kumbukumbu za ukaguzi na leja ya hash"),
          L("English and Swahili UI", "Kiolesura cha Kiingereza na Kiswahili"),
        ],
      },
      {
        title: L("Next — partner integration", "Ifuatayo — muunganisho wa mshirika"),
        items: [
          L("CBK partner sandbox callbacks", "Uthibitisho wa sandbox ya mshirika wa CBK"),
          L("Courier scan webhooks", "Webhook za ukaguzi wa msafirishaji"),
          L("Reviewer console with evidence viewer", "Konsoli ya mkaguzi na kiona ushahidi"),
          L("Settlement and reconciliation", "Malipo na upatanisho"),
        ],
      },
      {
        title: L("Later — scale", "Baadaye — upanuzi"),
        items: [
          L("Multi-courier network", "Mtandao wa wasafirishaji wengi"),
          L("Vendor risk scoring (advisory)", "Tathmini ya hatari ya muuzaji (ushauri)"),
          L("Buyer protection education", "Elimu ya ulinzi wa mnunuzi"),
          L("Swahili-first support", "Msaada kwa Kiswahili kwanza"),
        ],
      },
    ],
  },

  footer: {
    note: L(
      "Prototype — mock data. Not a financial service. In production, funds would be held by a CBK-licensed partner.",
      "Mfano — data ya majaribio. Si huduma ya kifedha. Katika uzalishaji, fedha zingehifadhiwa na mshirika aliyeidhinishwa na CBK.",
    ),
    repo: L("Repository", "Hifadhi ya msimbo"),
    built: L("One accent, no external images, no backend.", "Rangi moja, hakuna picha za nje, hakuna backend."),
  },
} as const;
