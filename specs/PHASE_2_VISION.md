# Phase 2 Vision

Dishmate Phase 1 delivered a pure TypeScript decision-tree library with an interactive demo UI. Phase 2 hardens the application for real-world use: fix known bugs, add rigorous testing, make it work offline, enforce performance budgets, and expand the advice content.

---

## 1. Fix Undefined Object Issues

Several code paths in the demo and library can produce `undefined` values that surface as broken UI or silent failures.

**Goal:** Audit all functions and rendering code for cases where optional fields, missing map entries, or empty inputs produce `undefined` that surfaces as broken UI or silent failures.

**Scope:**
- Functions that can receive unexpected input (e.g. `processAnswer` with an unrecognised step ID, `getAustralianCityHardness` with an unlisted city)
- Rendering code in `demo/main.ts` that accesses `.innerHTML` on potentially null elements or reads properties from optional result fields
- Any `as any` casts in the demo that bypass type safety

---

## 2. Property-Based Testing

The current test suite uses example-based tests (specific inputs -> expected outputs). Phase 2 adds fast, property-based testing to exercise the decision trees with randomised inputs and catch edge cases that hand-written examples miss.

**Goal:** Ultra-fast property-based tests that run in milliseconds and can be executed on every save during development.

**Approach:**
- Use [fast-check](https://github.com/dubzzz/fast-check) with vitest
- Define arbitraries for all input types (`ItemType`, `SoilType`, `LoadQuantity`, `Urgency`, `WaterHardness`)
- Test invariants rather than specific outputs:
  - `getLoadRecommendation` always returns a valid `CycleType`
  - `calculateDosing` never returns negative or nonsensical dose strings
  - `processAnswer` never throws for any valid step ID + option value combination
  - `getLoadRecommendation` with `baby_items` always produces `sanitise` cycle (unless `delicate` overrides)
  - Dosing amounts increase monotonically with soil score (all else equal)
  - Hard water always produces >= the dose of moderate water (all else equal)
- Property tests live alongside existing tests in the same `*.test.ts` files
- Target: full property test suite completes in under 1 second

---

## 3. Offline Mode (Service Worker PWA)

Dishmate is a purely informational application with zero server dependencies. It should work offline after the first visit, keeping the experience of navigating to the website URL.

**Goal:** Users navigate to the Dishmate URL, the app loads, and from that point forward it works identically whether online or offline. Ultra simple — no sync, no accounts, no server state.

**Approach:**
- Add a service worker that precaches all built assets (HTML, JS, CSS) at install time
- Use a cache-first strategy — serve from cache, fall back to network
- Add a `manifest.json` for PWA install prompts (add to home screen)
- Vite has `vite-plugin-pwa` (or a manual service worker is fine given the small asset set)
- The service worker registration goes in `demo/index.html` or `demo/main.ts`
- On deploy, new versions are picked up next time the user visits while online (standard service worker update flow)

**Non-goals:**
- No background sync
- No push notifications
- No IndexedDB or local storage for user data (Phase 2 is still informational-only)

---

## 4. Build Performance Budgets and Bundle Analysis

Every build should report detailed feedback on bundle size and chunk delivery so regressions are caught immediately.

**Goal:** Automated, strict checks that run on every build and give clear feedback about what the user will download.

**Approach:**
- Configure Vite's `build.rollupOptions` to produce a chunk report
- Use `rollup-plugin-visualizer` or Vite's built-in `--report` for a treemap on demand
- Add a post-build script that:
  - Reports total bundle size (JS + CSS + HTML)
  - Reports individual chunk sizes
  - Reports gzipped and brotli-compressed sizes
  - **Fails the build** if any threshold is exceeded
- Suggested initial budgets (adjust after baseline measurement):
  - Total JS (gzipped): < 30 KB
  - Any single chunk (gzipped): < 20 KB
  - Total HTML + CSS: < 10 KB
- Add an `npm run build:demo:report` script that outputs the analysis
- CI (GitHub Actions) runs the budget check on every push

**Rationale:** Dishmate is a lightweight informational app. It should stay lightweight. With no runtime dependencies and pure decision-tree logic, the bundle should be tiny. Budgets enforce this.

---

## 5. New Content: Pods vs Powder Dosing Flexibility

Add guidance throughout the relevant advisors that explains a key advantage of powder over pods.

**Key point:** Pods come in a single fixed size — you get the same dose whether you're washing two glasses or a full load of greasy pots. With powder, you can adjust the quantity based on the load. A light load of glasses might need 1 tablespoon total, while a full heavy load might need 3+. Pods give you no control over this.

**Where to surface this:**
- Detergent advisor: in the powder vs pods comparison and in the `getWhyPowderBeatsPods` content
- Load advisor reasoning: when dosing calculations produce amounts significantly different from a standard pod size, mention that this adjustment isn't possible with pods
- Troubleshooter: in solutions that recommend switching from pods to powder, mention dosing flexibility as a reason

---

## 6. New Content: Run Hot Water Before Starting

Add a tip about running the kitchen hot tap until the water is hot before starting the dishwasher.

**Key point:** Running the tap until hot water arrives ensures the dishwasher fills with hot water from the start, rather than the cold water sitting in the pipes. This helps detergent dissolve properly in the first fill.

**Nuance to capture:**
- Most dishwashers don't strictly need this — they have internal heaters that will bring water up to temperature
- However, some machines benefit from it, particularly:
  - Machines with weaker heaters
  - Machines located far from the hot water tank (long pipe runs = more cold water to flush)
- **Australian context:** Australian dishwashers run on 240V AC, giving their internal heaters significantly more power than American machines on 120V. This means Australian machines generally heat water faster and are less dependent on starting with hot water. American machines with their lower-power heaters benefit more from pre-running the tap.
- It's a quick, free optimisation that never hurts — the worst case is the water was already hot

**Where to surface this:**
- Quick start guide: as an optional tip in the onboarding steps
- Load advisor: as an optional loading tip, especially for cycles that need hot water early (intensive, sanitise)
- Troubleshooter: in the "fundamental problem" solution where water temperature is checked
- Cycle explainer: in the temperature education section, as context for why hot water matters at the start

---

## Implementation Order

After this document is approved, implementation proceeds in this order:

1. **Undefined fixes** — foundational correctness
2. **Property-based testing** — catches more issues, validates the fixes
3. **New content (pods dosing + hot water tip)** — content changes, covered by new tests
4. **Bundle budgets** — establish baseline, set thresholds
5. **Offline mode** — final feature, builds on the optimised bundle
