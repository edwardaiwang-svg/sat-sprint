# Commercialization Brief — from prototype to marketable product

**Status: SAT Sprint v1.0.0 is a validated prototype, not yet a marketable product.**
This brief lays out what the market looks like (researched June 2026, sources cited), what's missing, and three productization paths. Companion to [PRODUCT_OVERVIEW.md](PRODUCT_OVERVIEW.md).

---

## 1. Market reality (researched 2026-06)

**Demand tailwind is real.**
- 2M+ students in the class of 2025 took the SAT (first 2M+ cohort since 2020); 97% tested digitally. *(College Board Newsroom)*
- Nearly every Ivy plus Stanford, MIT, Caltech, and Purdue reinstated test requirements for the 2025–26 cycle — reversing the test-optional era. *(CollegeVine / College Sage)*
- Families that pay for help spend heavily: tutoring averages $62–70/hr (range $25–$400+), and 20–30-hour packages run $1,500–$6,000+. *(Wiingy 2025 study; Private Prep)*

**But two structural headwinds:**
- 68% of test takers now enter via free school-day administration — lower individual purchase intent. *(College Board)*
- Khan Academy is the **free, official** College Board prep partner. Any paid product must clearly beat a high-quality free baseline.

**Competitor price umbrella (verified June 2026):**

| Product | Price | Bank size | Positioning |
|---|---|---|---|
| Khan Academy | Free | Official tests | Official partner — the baseline |
| Magoosh | $129/yr one-time | — | Budget self-paced, +100-pt guarantee |
| UWorld | $99–$449 term access | 1,650+ | Analytics-driven self-study |
| LearnQ.ai | $25–$75/mo | — | AI tutor chat, score-projection refund |
| Acely | $49–$149/mo | ~8–9,000 | AI tutor, 200-pt guarantee |
| Princeton Review / Kaplan | $199–$1,999+ | — | Live instruction brands |

A $19–$49/mo AI-native app undercuts a *single* tutoring hour — that's the wedge the AI-native entrants are exploiting.

**Monetization benchmarks (RevenueCat 2026, 115k+ apps):**
- Freemium converts terribly in education (~2–2.6% free→paid). **Trial-gated paywalls convert at a 37.7% median** (trial→paid) — the evidence-backed default.
- Education median price points: $9.99/mo, $44.99/yr. Year-1 LTV per paying user: ~$22.82.
- Retention is goal-bound: annual plans renew at ~24% (users churn after the test), weekly at 58% → **price in short cycles aligned to test-date cohorts** (Mar/May/Jun and Aug/Oct/Nov).
- Sobering base rate: new education apps take 58–109 days to reach $1k/mo; only 11–14% reach $10k/mo within two years.

**Marginal content cost is near zero.** At Claude Haiku 4.5 pricing ($1/$5 per MTok), one generated question + explanation ≈ **a third of a cent**; 10,000 questions < $35 (half that via the Batches API). The expensive part is human review, not generation — and this codebase already has the generation pipeline and a structural validation gate.

---

## 2. Legal constraints (must-do before any commercial launch)

1. **Rename the product.** College Board prohibits "SAT" in product names, taglines, domains, and meta tags, and its stated position is that commercial use of the mark requires written permission (4–6 week review). "SAT Sprint" as a name is out for commercial use. Pattern that works: a distinct brand name + nominative reference ("Brand — prep for the SAT®").
2. **Print the required disclaimer on every page:** "SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this product." (This is exactly what Princeton Review and UWorld do.)
3. **No brand-bidding:** College Board does not allow third parties to bid on its marks in search ads.
4. **Teen privacy:** COPPA only covers under-13s, but state law is the real constraint for a 13–18 audience: CCPA's under-16 opt-in, Maryland's under-18 targeted-ad/data-sale ban (Apr 2026), Connecticut's similar ban (Jul 2026). Simplest posture: **no targeted ads, no data sale, minimal collection** — which the current zero-analytics architecture already satisfies.
5. **If selling to schools:** FERPA school-official exception via contract + California SOPIPA apply. Phase-2 concern.
6. **Never ingest real College Board questions** (their $1M settlement with Karen Dillard's College Prep was over pirated questions). The bank is already 100% original — keep it that way and document provenance.

---

## 3. What's missing (gap to "marketable")

| Have (v1.0.0) | Missing |
|---|---|
| Teach-on-miss loop, error-log graduation, diagnostic→drill | Accounts, cross-device sync, payments (Stripe) |
| 52 original, audited questions | ~1,000+ reviewed items (generation is cheap; review is the bottleneck) |
| AI generation pipeline with structural validation | Server-side AI proxy (key can't ship in the browser) |
| Quality gates (typecheck/build/validate) + clean audit | Automated UI test suite, error monitoring |
| Zero-infra static deploy | Trademark-safe brand, privacy policy, ToS, disclaimer |
| — | Distribution: trial paywall, test-date cohort pricing, SEO/content, tutor channel |

Rough effort to a sellable v2: **6–8 focused weeks.**

---

## 4. Three products in priority order ("maximize products")

1. **B2C app (core).** Free diagnostic → 7-day trial → paywall. Price as a **"test-date pass"** (e.g., $39–$49 for the run-up to one SAT date, renewable per cycle) rather than annual — matches the 24%-annual vs 58%-weekly renewal evidence. Differentiator vs Khan/UWorld: the error-log graduation mechanic + unlimited AI-personalized drills on *your* error profile.
2. **Tutor edition (B2B2C) — likely the better wedge.** White-label dashboards + per-student licenses sold to independent tutors ($70/hr economics make a $10–15/student/mo tool trivial to justify; they assign it as homework between sessions). Comparables: EdisonOS white-label from ~$999/yr; Test Innovators bulk licenses. Tutors bring distribution — the hardest problem in B2C — for free.
3. **School/district licensing.** ~$3–5/student/yr comparables (Methodize, 1,000+ schools). Highest volume, longest sales cycle, FERPA/SOPIPA overhead. Phase 3, only after the tutor channel proves the content.

**Honest expectation-setting:** the realistic B2C trajectory for a new education app is a side-business ($1k/mo within ~2–4 months of launch if execution is good), not a rocket. The tutor channel is where a small team can find real margin without fighting Khan Academy's free baseline head-on.

---

## 5. Unit economics sketch (B2C path)

- COGS: static hosting ~$0 + AI inference pennies/user/mo + Stripe ~3%.
- At $44.99/yr-equivalent (category median) with trial-paywall conversion (37.7% of trials), gross margin ≈ 90%+.
- Content scaling: 1,000 AI-generated questions ≈ $3.50 to generate; budget the real money for expert review (~$2–5/item reviewed ≈ $2–5k for a 1,000-item bank).
- Break-even on a 6–8-week build at modest contractor rates ≈ low hundreds of paying users — plausible via 10–20 tutor accounts before any consumer marketing spend.

*Researched and written 2026-06-09. Market figures verified against sources cited inline; pricing checked on vendor sites where possible.*
