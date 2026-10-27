# Social Commerce Escrow & Delivery Platform: Plan & Proposal (Kenya)

> **Status:** Draft v0.3
> **Owner:** Founder
> **Note:** This document is a planning aid, not legal or financial advice. All legal, regulatory and licensing items must be confirmed with a Kenyan fintech lawyer before you act on them. Numbers marked *(placeholder)* must be replaced with real quotes and pilot data. Courier rates referenced are general market ranges from comparable Kenyan couriers, not confirmed Speedaf pricing (see Section 9A).
>
> **Where detail lives:** legal and regulatory detail is in [`../legal/`](../legal/README.md), technical detail in [`../architecture/`](../architecture/README.md), and individual decisions in [`../adr/`](../adr/README.md). This document summarizes and links to them.

---

## 1. Summary

An escrow service for small social media vendors who sell on WhatsApp and Instagram etc. A buyer pays into a protected hold. The vendor ships. The money is released when the buyer confirms delivery, when a timer expires, or after a dispute review.

**Why:** Social commerce in Kenya runs on trust, and scams are very common. Buyers fear paying first, and honest vendors lose sales because of it.

**How (core decisions):**
- We **do not hold customer funds ourselves**. A CBK-licensed partner holds them ([ADR-001](../adr/ADR-001-do-not-hold-customer-funds-use-a-licensed-partner.md)).
- The **interface is WhatsApp/Instagram first**, with light mobile web pages for onboarding, dashboards and admin ([ADR-003](../adr/ADR-003-whatsapp-first-interface-with-mobile-web-no-native-app-initially.md)).
- The application is a **Java / Spring Boot modular monolith** on PostgreSQL ([ADR-002](../adr/ADR-002-modular-monolith-with-spring-boot.md), [ADR-004](../adr/ADR-004-postgresql-with-append-only-double-entry-ledger.md)).
- **AI agents assist humans** with support and operations but never move money or make final decisions ([ADR-007](../adr/ADR-007-ai-agents-are-assistive-read-only-by-default-and-never-decide-money-or-account-outcomes.md)).
- **Tracked delivery is mandatory** on every deal, via our logistics partner(s) or the vendor's own courier under a signed liability agreement ([ADR-013](../adr/ADR-013-tracked-delivery-is-mandatory-via-platform-courier-or-vendor-s-own-courier-under-a-signed-liability-agreement.md)).
- Launch in **one niche in Kenya**, prove the economics, then expand region by region ([ADR-009](../adr/ADR-009-country-agnostic-core-with-pluggable-providers.md)).

**Evolution note:** This started as an escrow-only product. It has evolved into an **escrow + delivery** platform, because third-party delivery confirmation removes the weakest point in the trust model (self-reported "I shipped it" / "it never arrived" claims) and opens a second revenue line. Delivery is **Phase 4** in the roadmap, layered onto a validated escrow core and not built in parallel with it.

**Team:** Founder + one operations/dispute hire, with external lawyer, accountant and compliance advisor.

---

## 2. Problem and Opportunity

| Problem | Effect |
|---|---|
| Buyers pay strangers on social media with no protection | Fear of scams reduces purchases |
| Vendors have no credible way to prove trustworthiness | Lost sales, price pressure |
| Fake M-Pesa confirmation messages and screenshots | Direct vendor losses |
| Disputes are handled ad hoc in chats | Slow, unfair, no records |

**Opportunity:** a trust layer that makes both sides more willing to transact. Revenue comes from a small fee per protected deal.

**Assumptions to validate in Phase 0:**
1. Vendors will pay a fee for the trust badge and payment protection.
2. Buyers will accept a short extra step (pay via link, confirm delivery).
3. Vendors in one niche can be reached through existing seller communities.
4. Our partner will support conditional hold-and-release (or a compliant equivalent).

---

## 3. Scope

### 3.1 In scope (MVP)
- Deal creation by vendor in chat
- Buyer payment via M-Pesa (STK Push) through a licensed partner
- Vendor shipping proof upload
- Buyer confirmation, auto-release timer, and dispute flow
- Payout to vendor M-Pesa
- Tiered vendor KYC
- Admin dashboard: disputes, KYC review, flagged deals, payout failures
- Append-only ledger and audit log
- Notifications via WhatsApp templates

### 3.2 Out of scope (for now)
- Holding funds in our own account
- Native mobile app, USSD
- Card payments (unless the partner provides them for free with the same integration)
- Cross-border payments
- Automated dispute rulings
- Lending, wallets, or any stored-value features

---

## 4. Users and Interfaces

| User | Main interface | Secondary |
|---|---|---|
| **Buyer** | WhatsApp buttons and pay link | No-login tracking page |
| **Vendor** | WhatsApp for actions | Mobile web dashboard (PWA) |
| **Admin / ops** | Web admin dashboard | Alerts via chat/email |

**UX principles**
- Tap-first (buttons, lists), minimal typing
- English and Swahili from day one
- Pages small and fast on weak networks
- Plain language ("Your money is safe until you confirm delivery")
- Always explain **who holds the money**
- Warn users: we never ask for an M-Pesa PIN or a screenshot as proof of payment
- Explain any payout hold clearly ("New vendor hold, releases in 48h")

---

## 5. Business Model

The product has evolved from escrow-only to **escrow + delivery infrastructure**. Revenue now has two solid legs instead of one.

**Revenue streams**

| Stream | Description | Priority |
|---|---|---|
| **Escrow fee** | % of deal value, charged to vendor at first ([ADR-008](../adr/ADR-008-vendor-pays-the-fee-at-launch.md)) | Primary, from launch |
| **Delivery markup** | Negotiated courier rate + margin, charged when we provide the courier | Primary, from Phase 4 |
| **Bundled "protected delivery" fee** | Single price combining escrow + delivery, priced above the sum of parts | Secondary, once both legs work |
| **Vendor subscription** | Lower fees, verified badge, statements, bulk deal creation, priority support | Secondary |
| **COD facilitation fee** | Bridge for cash-on-delivery into escrow (courier collects cash, confirms digitally, we release to vendor). Addresses that most Kenyan shoppers prefer COD | Later, high differentiation |
| **Delivery insurance add-on** | Optional premium for guaranteed replacement/refund on high-value items, on top of the base liability split in ADR-013 | Later |
| **Volume rebate spread** | Our negotiated courier rate at scale vs. what a small vendor pays alone; the core logistics value proposition | Grows with volume |
| **Analytics / data (later)** | Vendor performance scores, delivery success by area, premium reporting | Later, once data exists |

**Not planned:** float income on held funds, unless the lawyer and payment partner confirm it is allowed under the trust/licensing structure.

**Sequencing rule:** delivery revenue is layered on only after the escrow-only pilot validates vendor willingness to pay and the dispute/fraud rate is manageable. Don't launch both unproven at once.

**Unit economics to build once partner quotes arrive:**

```
Fee revenue per deal
- Payment collection cost
- Payout cost (M-Pesa charges)
- KYC cost (amortized per deal)
- WhatsApp message cost
- Expected fraud/dispute loss
- Support time
= Contribution margin per deal
```

**Rule:** do not fix the price until the cost lines above are real numbers. Use minimum fees so small deals are not loss-making.

---

## 6. Legal and Regulatory Plan (Kenya)

Full detail: [`../legal/README.md`](../legal/README.md).

- **Position:** payment services fall under CBK through the National Payment System Act 2011 and its regulations. The strategy is **partner first**, with own authorization considered later if volume justifies it.
- **Required actions:** a written legal opinion on whether the model needs its own CBK authorization; written confirmation from the payment partner that the escrow-style flow is permitted under their license; and confirmation of current rules with CBK and the lawyer.
- **Also required:** company setup, data protection compliance (Data Protection Act 2019), an AML/KYC policy, and a legal document set (Terms, escrow agreement, dispute policy, vendor agreement, fees and refund policy, acceptable use policy, privacy policy, partner agreements, and the Delivery Liability Agreement).
- **Golden rule:** the **code must match the contract** ([ADR-005](../adr/ADR-005-the-deal-state-machine-is-the-single-source-of-truth-and-mirrors-the-legal-terms.md)).

---

## 7. Company and Team

### 7.1 Structure (now)
```
Company (Kenyan Ltd)
├── Founder: CEO, product, engineering
├── Hire #1: ops & dispute lead
├── External advisors: fintech lawyer, accountant, compliance/data protection advisor
└── Partners: payment partner, KYC provider, Meta, cloud host
```

### 7.2 Hiring order
1. Ops and dispute lead
2. Second developer
3. Compliance officer (before any own-license application)
4. Support agents as volume grows

### 7.3 Resources checklist
- **People:** listed above
- **Money:** legal fees, partner setup, cloud, KYC and messaging costs, 12 months runway with zero revenue *(amounts: placeholder)*, fraud reserve
- **Accounts:** Meta Business (verified), payment partner, Safaricom Daraja (if direct), KYC provider, cloud, monitoring, email/domain

---

## 8. Money and Delivery Flow

Full detail: [`../architecture/deal-state-machine.md`](../architecture/deal-state-machine.md).

In short: the vendor creates a deal and picks a delivery path (platform courier or own courier, tracking reference required either way). The buyer pays by M-Pesa STK Push through the payment partner, and a verified callback marks the deal **FUNDED**. The deal then moves through **SHIPPED**, **IN_TRANSIT** and **DELIVERED**. Funds are **RELEASED** on buyer confirmation or when the auto-release timer expires, or the deal goes to **DISPUTED** for human review, ending in **REFUNDED** or **RELEASED**. Courier-confirmed delivery is stronger evidence than vendor self-reporting.

---

## 9. Technical Architecture

Full detail: [`../architecture/overview.md`](../architecture/overview.md).

In short: Java 21 and Spring Boot as a modular monolith, PostgreSQL with an append-only double-entry ledger, Redis for rate limits and sessions, and a transactional outbox instead of a message broker. Key requirements are idempotent processing, verified webhooks, PII encryption, role-based access, a full audit log, and a third-party penetration test before public launch.

### 9A. Logistics / Courier Options

Tracked delivery is mandatory on every deal (ADR-013), via a platform-provided courier or the vendor's own courier under a signed liability agreement. No single courier should be hardcoded (the ADR-009 pattern extended to logistics).

**Courier options evaluated**

| Courier | Why it fits | Notes |
|---|---|---|
| **Sendy** | API-first fulfillment infrastructure built for e-commerce and consumer brands, commission-based pricing | Closest match to our needs; built for platforms, not one-off senders |
| **G4S Courier** | Kenya's largest courier by e-commerce volume; domestic logistics partnership with UPS | Strong nationwide network, proven marketplace integrations (OLX, Kilimall, Melimu) |
| **Fargo Courier** (Wells Fargo Ltd, a Kenyan logistics firm, unrelated to the US bank) | 100+ location nationwide network; existing e-commerce delivery partnership with Kilimall | Proven local e-commerce integration track record |
| **Pickup Mtaani** | Started as e-commerce logistics startup; agent-to-agent collection point model; already uses M-Pesa for secure payment flows between businesses and customers | Cheapest tier, good fallback where doorstep isn't required |
| **Posta Kenya (EMS)** | Strong rural/upcountry reach; supports API integration for order management and tracking | No open developer portal: API credentials requested directly from their IT department, or via an aggregator |
| **Speedaf** | E-commerce-focused courier, competitive positioning similar to the above | No public rate card found; pricing is quote-based per merchant account. Contact their business/partnerships team directly (see Appendix C) |
| **Multi-carrier aggregator (e.g. ClickPost)** | One API surface across many couriers | Worth evaluating instead of building a separate adapter per courier as the courier list grows |

**Recommended starting stack:** one primary API-native courier (Sendy or G4S) for the platform-provided path, Pickup Mtaani as a cheap fallback tier, Posta/Fargo for upcountry reach. Revisit an aggregator once more than 2-3 couriers are integrated.

**Cost note:** no courier in this market publishes reliable nationwide flat rates. Real cost depends on volume, zone mix, weight profile, and negotiated account pricing. General market ranges for comparable couriers (not confirmed quotes):
- Within Nairobi: ~KSh 100-450 per parcel
- Nairobi to major towns: ~KSh 200-600
- Upcountry standard: ~KSh 250-600
- Heavier parcels (over 5kg): ~KSh 500-1,500
- Doorstep delivery: +KSh 150-300

Do not price the product against these ranges. Get real merchant-tier quotes from at least two couriers before setting the delivery markup.

---

## 10. AI Agents

### 10.1 Principles
- Agents **assist humans**. They never release, refund, or hold funds, ban vendors, or give final KYC/dispute/AML decisions ([ADR-007](../adr/ADR-007-ai-agents-are-assistive-read-only-by-default-and-never-decide-money-or-account-outcomes.md))
- Read-only by default, drafting allowed
- Grounded in approved policy documents, with handoff when unsure
- All agent outputs logged
- Users are told when they are talking to an AI
- Chat content and uploaded files are treated as untrusted (prompt injection risk)

### 10.2 Management agents (run the company)

| Agent | Jobs |
|---|---|
| Chief of staff | Weekly plans, meeting notes, decision log, drafting, memory |
| Compliance tracker | Deadline calendar, document checklist, policy change summaries |
| Finance helper | Expense categorization, runway, reconciliation summaries, monthly reports |
| Growth helper | Vendor research, interview synthesis, pilot metrics, outreach drafts |
| Process helper | SOPs, onboarding docs, hiring drafts |
| Engineering helper | Code review, tests, docs, code-vs-Terms checks |

### 10.3 Product agents (customer-facing, later)
Support agent, onboarding agent, dispute intake agent, fraud triage agent, all read-only with human handoff.

### 10.4 Rollout
1. Chief of staff and compliance tracker (solo stage)
2. Finance helper (when money moves)
3. Support and dispute intake agents (after pilot, with human approval of replies)
4. Fraud triage (when there is enough data)

---

## 11. Operations

- **Vendor onboarding:** tiered KYC (phone → national ID → business proof), limits rise with tier ([ADR-011](../adr/ADR-011-tiered-kyc-with-limits-tied-to-verification-level.md))
- **New vendor payout hold:** 24-72 hours *(placeholder, tune in pilot)*
- **Dispute SLA:** target resolution within 48 hours *(placeholder)* ([ADR-012](../adr/ADR-012-humans-make-dispute-decisions-with-documented-criteria-and-appeal.md))
- **Fraud controls:** velocity limits, blocklists, unusual pattern flags
- **Support:** inside WhatsApp, English and Swahili, extended hours for evenings and weekends
- **Reconciliation:** daily against partner report; mismatches investigated same day
- **Two-person rule:** once the team has two people, money-affecting admin actions need a second approver

Runbooks and SOPs will live in [`../runbooks/`](../runbooks) and [`../sops/`](../sops).

---

## 12. Roadmap

### Phase 0: Validate (weeks 1-4)
- 20+ vendor and buyer interviews
- Manual pilot: WhatsApp group + partner payment link, founder as operator
- Two payment partners contacted for written answers on escrow-style flows
- **Exit criteria:** vendors say they would pay, at least a handful of real deals completed

### Phase 1: Company and legal foundation (months 1-3)
- Company registration, bank account, tax setup
- Fintech lawyer engaged, legal opinion on licensing
- Meta Business verification started
- ODPC registration, first drafts of Terms, escrow agreement, privacy policy
- Partner agreement negotiated
- **Exit criteria:** partner signed and written confirmation of the model, core legal documents drafted

### Phase 2: MVP build (months 2-5)
- State machine, ledger, payment integration, messaging gateway
- Vendor onboarding and basic KYC
- Minimal admin dashboard
- Security review and penetration test
- **Exit criteria:** end-to-end deal works in a staging environment, reconciliation passes, tests green

### Phase 3: Closed pilot (months 5-9)
- 10-30 vendors in one niche
- Collect real cost per deal, dispute rate, time to release, fraud losses
- Weekly review of every dispute
- **Exit criteria:** dispute rate and fraud loss within targets, positive or clearly improving margin per deal

### Phase 4: Controlled growth (months 9-18)
- Vendor dashboard, subscriptions, referral loops via seller communities
- Second hire (developer), support process, AI support agent with human approval
- Reassess the own-license question with the lawyer
- **Logistics integration:** sign platform courier partner(s) (ADR-013, Section 9A), build `logistics/` module, draft and roll out the Delivery Liability Agreement for the vendor's-own-courier path
- **Exit criteria:** repeat usage, stable operations, runway extended, first courier-tracked deals live

### Phase 5: Scale and expansion (year 2+)
- Additional niches in Kenya
- One neighboring market (for example Uganda or Tanzania) after Kenya is stable
- Country-specific legal work, local partner, local payment rails
- **Rule:** expand only when Kenya operations run without the founder resolving every case

---

## 13. KPIs

| Area | Metric |
|---|---|
| Growth | Active vendors, deals per week, gross transaction value |
| Revenue | Take rate, contribution margin per deal |
| Trust | Dispute rate, fraud loss rate, average time to release |
| Operations | Dispute resolution time, KYC turnaround, payout failure rate |
| Retention | Repeat vendors, repeat buyers |
| Compliance | Open policy gaps, missed deadlines (target zero) |

Set targets from pilot data rather than guessing now.

---

## 14. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Regulatory classification changes | Partner-first model, lawyer opinion, early CBK conversation |
| Partner refuses or restricts escrow flows | Talk to multiple partners early, get written confirmation |
| Fraud and fake payment proof | API callbacks only, payout holds for new vendors, KYC tiers |
| Disputes overwhelm team | Written SOPs, AI summaries for reviewers, dispute caps for new vendors |
| Meta policy or API changes | Official APIs only, web fallback pages, monitor policy updates |
| Court challenges to fund release | Clear release triggers, neutral-intermediary terms, documented fair process |
| Thin margins | Minimum fees, niche with higher order values, real cost tracking |
| Founder overload | Automate reporting, hire ops early, use management agents |
| Data breach | Encryption, access control, breach plan, minimal data retention |
| Running out of runway | 12 months cost cover, lean spending, milestone-based hiring |

---

## 15. Open Questions

1. Which niche first (phones, fashion, beauty, electronics)?
2. Which payment partner, and will they confirm escrow-style holds in writing?
3. Does the model need our own CBK authorization, and at what volume?
4. Who pays the fee in the pilot: vendor, buyer, or split?
5. What auto-release period is fair for each category?
6. Can we hold and release via the partner's wallet/settlement features, or do we need a different flow?
7. Which KYC provider and what does each check cost?
8. What is the runway target and funding plan?
9. **Tracking requirement vs. rollout phase.** ADR-013 requires a tracking reference on every deal with no exceptions, but delivery integration launches in Phase 4 and the MVP scope (Section 3.1) uses vendor shipping proof. What applies to deals during Phases 2-3?
10. Exact mechanics and timing of the refund-first / recover-from-vendor process (ADR-013), to be settled with the lawyer.

*Questions 9 and 10 were added in v0.3 after review.*

---

## Appendix A: Architecture Decision Records

The ADRs are no longer duplicated here. See the index at [`../adr/README.md`](../adr/README.md) (13 records, ADR-001 to ADR-013).

---

## Appendix B: Immediate Next Steps (first 30 days)

1. Run the manual pilot with about 10 vendors.
2. Book a consult with a Kenyan fintech lawyer and bring the licensing question.
3. Register the company; start the ODPC and Meta verification processes.
4. Get written answers from two payment partners on escrow-style flows and pricing.
5. Draft the state machine spec and the escrow agreement side by side.
6. Set up the chief-of-staff agent and a compliance deadline calendar.
7. Start the Spring Boot project skeleton only after steps 2 and 4 give clarity.

---

## Appendix C: Courier Outreach Checklist (for Phase 4)

Before committing to any courier partner, request in writing:
1. Merchant/API rate card (not consumer pricing): per-parcel cost by zone and weight tier
2. Volume discount tiers and minimum commitment, if any
3. API/webhook availability for tracking status and proof of delivery (signature/OTP/photo), not just a public tracking page
4. Coverage map: confirm reach into areas your pilot vendors actually sell to
5. Account/integration setup fee, if any
6. Failed delivery and return-to-sender cost and process
7. Liability terms for loss/damage on their side (relevant to ADR-013's platform-courier path)
8. SLA for delivery times by zone

**Target list for quotes:** Sendy, G4S, Fargo Courier, Pickup Mtaani, Speedaf, and optionally one aggregator (e.g. ClickPost) covering Posta Kenya and others. Get at least two quotes before negotiating.
