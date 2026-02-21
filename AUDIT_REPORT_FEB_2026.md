# Dishmate Codebase Audit Report - February 2026

This report summarizes the findings of a "fresh eyes" methodical review of the Dishmate library. It categorizes identified bugs, logical inconsistencies, and recommended improvements to be implemented by subsequent agents.

## 🚩 Critical Logic & UX Bugs

### 1. Troubleshooter: Dead-End "Other" Branch
**Location:** `src/troubleshooter.ts`
- **Issue:** The `other_start` step lists several diagnostic options (`noises`, `too_long`, `wont_start`, `leaking`), but these lack a `nextStep` or an entry in the `ANSWER_TO_SOLUTION` mapping.
- **Impact:** Users selecting "Something else" receive generic advice rather than a specific solution, making the tool feel broken for these common issues.
- **Requirement:** Add specific `TroubleshootSolution` objects for these cases and map them in `ANSWER_TO_SOLUTION`.

### 2. Load Advisor: Missing Soft Water Dosing Logic
**Location:** `src/load-advisor.ts`
- **Issue:** The `calculateDosing` function only has adjustments for `hard` water (+50%). It lacks logic for `soft` water, despite it being a core type in `types.ts`.
- **Impact:** Users in soft water areas (e.g., Sydney, Melbourne) are given doses that are too high, leading to over-sudsing and the risk of permanent glass etching.
- **Requirement:** Implement a 25-50% dose reduction when `waterHardness === 'soft'`.

### 3. Load Advisor: Under-dosing Heavy Soil Pre-wash
**Location:** `src/load-advisor.ts`
- **Issue:** `calculateGreaseFactor` only flags `greasy` or `protein`. If a user selects only `heavy` (baked-on/burnt), the grease factor defaults to `low`.
- **Impact:** This leads to a minimum pre-wash dose (0.5 tbsp) even in `intensive` cycles, which is insufficient for carbonised food and baked-on fats.
- **Requirement:** Include `heavy` in the `medium` grease factor calculation.

---

## ⚠️ Logical Inconsistencies

### 4. Sanitise vs. Intensive Priority Conflict
**Location:** `src/load-advisor.ts`
- **Issue:** For `baby_items` with `heavy` soil, the engine recommends `sanitise` (Rule 1) without a warning. 
- **Conflict:** `cycle-explainer.ts` notes that `sanitise` is "not suitable for heavy soil" because high heat can bake on protein further.
- **Requirement:** Add a warning when `sanitise` is selected for `heavy` or `greasy` loads, suggesting an `intensive` wash first or manual pre-cleaning.

### 5. Dosing Advice Discrepancy (Eco Cycle)
**Location:** `src/cycle-explainer.ts` vs `src/load-advisor.ts`
- **Issue:** `cycle-explainer.ts` hardcodes a recommendation of **1.0 tbsp** pre-wash for Eco. `load-advisor.ts` calculates **0.5 tbsp** for standard loads.
- **Requirement:** Align educational strings with the engine's logic to ensure consistent UX.

---

## 📝 Content & Mapping Gaps

### 6. Missing Loading Tips for Core Types
**Location:** `src/load-advisor.ts`
- **Issue:** `ITEM_TIPS` is missing entries for `plates` and `delicate`.
- **Requirement:** Add "Face plates toward the centre" and "Ensure delicate items aren't touching" to the tips record.

### 7. Detergent Advisor: Incomplete Usage Instructions
**Location:** `src/detergent-advisor.ts`
- **Issue:** `getUsageInstructions` has a specific block for `hard` water but nothing for `soft` water, even though the reasoning text mentions it.
- **Requirement:** Add a "SOFT WATER" instruction block suggesting a 25% dose reduction.

### 8. Pre-rinse Guide: Over-broad Regex
**Location:** `src/prerinse-guide.ts`
- **Issue:** The `large.*piece` regex in `SCRAPE_PATTERNS` captures "large piece of cheese," preventing the "protein/enzyme" logic from firing.
- **Requirement:** Refine regex or priority logic so specific food advice isn't shadowed by generic chunk advice.

---

## 🛠 Technical Debt & Architecture

### 9. Troubleshooter Mapping Brittle
**Location:** `src/troubleshooter.ts`
- **Issue:** `ANSWER_TO_SOLUTION` uses string-concatenated keys (`id:value`). 
- **Recommendation:** Refactor to a nested record structure or use the `DecisionTree` interface for better type safety.

### 10. Under-utilised DecisionTree Interface
**Location:** `src/types.ts`
- **Observation:** The `DecisionTree` and `DecisionNode` types are defined but ignored by all current implementations.
- **Recommendation:** Evaluate if the project should commit to this architecture or remove the types to avoid confusion.

---
**Audit Performed By:** Gemini CLI Agent
**Date:** Saturday 21 February 2026
