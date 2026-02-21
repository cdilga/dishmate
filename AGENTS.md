# AGENTS.md

Shared project instructions for all AI coding agents (Claude Code, Gemini CLI, etc.). `CLAUDE.md` is a symlink to this file so every tool reads identical content.

## Commands

```bash
npm test              # Run all tests (vitest, single run)
npm run test:watch    # Run tests in watch mode
npx vitest run src/load-advisor.test.ts  # Run a single test file
npm run build         # TypeScript compile to dist/
npm run typecheck     # Type check without emitting
npm run dev           # Vite dev server for the demo UI
npm run build:demo    # Build demo for GitHub Pages (outputs to dist-demo/)
npm run check-bundle  # Check bundle sizes against budgets
```

## Architecture

Dishmate is a TypeScript library of **decision-tree engines** for dishwasher usage advice. It's a pure logic library with no runtime dependencies — all domain knowledge is encoded as functions and lookup tables.

### Core modules (all in `src/`)

Each module follows the same pattern: types + decision logic + exported public API.

- **`types.ts`** — All shared types. Union string literals for domain concepts (`ItemType`, `SoilType`, `CycleType`, etc.), input/output interfaces, and the generic `DecisionTree`/`DecisionNode` types.
- **`load-advisor.ts`** — Main recommendation engine. Takes a `LoadInput` (items, soil types, quantity, urgency) and returns a `Recommendation` (cycle, dosing, tips, reasoning). Implements a priority-rule cycle selection algorithm and dosing calculations with water hardness adjustments.
- **`troubleshooter.ts`** — Interactive diagnostic flow. Uses a step-based state machine (`DiagnosisStep` nodes with options leading to next steps or solutions). Steps are navigated via `processAnswer(stepId, answer)` which returns the next step or a `TroubleshootSolution`.
- **`prerinse-guide.ts`**, **`detergent-advisor.ts`**, **`maintenance-guide.ts`**, **`cycle-explainer.ts`**, **`rinse-aid-guide.ts`**, **`water-hardness-helper.ts`**, **`quick-start-guide.ts`** — Standalone advisory modules, each with their own input types and recommendation functions.
- **`index.ts`** — Barrel export of all public APIs and types.

### Demo app

`demo/` contains a Vite-served interactive UI that imports from the library. Vite config aliases `'dishmate'` to `src/` for development. Demo deploys to GitHub Pages via `.github/workflows/deploy.yml`. The demo is a PWA with offline support via a service worker.

### Specs

- `specs/MVP_IDEA.md` — original decision tree specifications with detailed flow diagrams
- `specs/PROJECT_GUARDRAILS.md` — things we tried that didn't work, to avoid repeating
- `specs/PHASE_2_VISION.md` — vision for Phase 2 features (offline PWA, property testing, bundle budgets, new content)

## Key patterns

- **No external dependencies** — all logic is self-contained TypeScript
- Tests use **vitest with globals enabled** — `describe`, `it`, `expect` are available without imports (though existing tests do import them explicitly)
- Tests live alongside source files as `*.test.ts`
- Property-based tests use **fast-check** in `src/property-tests.test.ts`
- Decision logic uses **priority-rule matching** (first match wins) rather than weighted scoring
- Dosing uses **tablespoon-based formatting** with rounding to nearest 0.5
- The troubleshooter uses a **step ID + answer → next step or solution** pattern via the `ANSWER_TO_SOLUTION` mapping

## Guardrails

- **Frontend work requires careful review** — whenever touching frontend code (HTML, CSS, UI rendering, `demo/main.ts`, `demo/index.html`), read the actual TypeScript types first to avoid accessing properties that don't exist. In Claude Code, invoke the `/frontend-designer` skill first. See `specs/PROJECT_GUARDRAILS.md`.
- **Bundle budgets** — total JS gzipped must stay under 30KB. Run `npm run check-bundle` after demo builds.
- **All tests must pass with no skips or warnings** before committing.

## ralph.sh

`ralph.sh` is a looping harness that runs Claude Code in print mode (`claude -p`) repeatedly with a prompt file until a done pattern is detected. Used for autonomous multi-iteration tasks.
