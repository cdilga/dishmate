import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  getLoadRecommendation,
  calculateSoilScore,
  calculateDosing,
  calculateGreaseFactor,
  processAnswer,
  getTroubleshootFlow,
} from './index';
import type {
  ItemType,
  SoilType,
  LoadQuantity,
  Urgency,
  WaterHardness,
  CycleType,
  GreaseFactor,
  TroubleshootCategory,
} from './types';

// ============================================
// ARBITRARIES
// ============================================

const itemTypeArb = fc.constantFrom<ItemType>(
  'plates', 'bowls', 'glasses', 'mugs', 'pots', 'pans',
  'bakeware', 'utensils', 'containers', 'baby_items', 'cutting_boards', 'delicate'
);

const soilTypeArb = fc.constantFrom<SoilType>(
  'light', 'everyday', 'heavy', 'greasy', 'protein', 'starchy', 'acidic'
);

const loadQuantityArb = fc.constantFrom<LoadQuantity>('light', 'normal', 'full');
const urgencyArb = fc.constantFrom<Urgency>('no_rush', 'need_today', 'need_fast');
const waterHardnessArb = fc.constantFrom<WaterHardness>('soft', 'moderate', 'hard', 'unknown');
const cycleTypeArb = fc.constantFrom<CycleType>('quick', 'eco', 'normal', 'intensive', 'delicate', 'sanitise');
const greaseFactorArb = fc.constantFrom<GreaseFactor>('low', 'medium', 'high');

const validCycles: CycleType[] = ['quick', 'eco', 'normal', 'intensive', 'delicate', 'sanitise'];

// ============================================
// PROPERTY TESTS
// ============================================

describe('Property-based tests', () => {
  describe('getLoadRecommendation', () => {
    it('always returns a valid CycleType for any valid input', () => {
      fc.assert(
        fc.property(
          fc.array(itemTypeArb, { minLength: 1, maxLength: 5 }),
          fc.array(soilTypeArb, { minLength: 1, maxLength: 4 }),
          loadQuantityArb,
          urgencyArb,
          waterHardnessArb,
          (items, soilTypes, quantity, urgency, waterHardness) => {
            const result = getLoadRecommendation({ items, soilTypes, quantity, urgency, waterHardness });
            expect(validCycles).toContain(result.cycle);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('always returns non-empty prewashDose and mainDose strings', () => {
      fc.assert(
        fc.property(
          fc.array(itemTypeArb, { minLength: 1, maxLength: 5 }),
          fc.array(soilTypeArb, { minLength: 1, maxLength: 4 }),
          loadQuantityArb,
          urgencyArb,
          waterHardnessArb,
          (items, soilTypes, quantity, urgency, waterHardness) => {
            const result = getLoadRecommendation({ items, soilTypes, quantity, urgency, waterHardness });
            expect(result.prewashDose.length).toBeGreaterThan(0);
            expect(result.mainDose.length).toBeGreaterThan(0);
            expect(result.reasoning.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('recommends sanitise for baby_items unless delicate is also present', () => {
      fc.assert(
        fc.property(
          fc.array(soilTypeArb, { minLength: 1, maxLength: 3 }),
          loadQuantityArb,
          urgencyArb,
          waterHardnessArb,
          (soilTypes, quantity, urgency, waterHardness) => {
            const result = getLoadRecommendation({
              items: ['baby_items'],
              soilTypes,
              quantity,
              urgency,
              waterHardness,
            });
            expect(result.cycle).toBe('sanitise');
          }
        ),
        { numRuns: 50 }
      );
    });

    it('recommends delicate when delicate items present (overrides sanitise)', () => {
      fc.assert(
        fc.property(
          fc.array(soilTypeArb, { minLength: 1, maxLength: 3 }),
          loadQuantityArb,
          urgencyArb,
          waterHardnessArb,
          (soilTypes, quantity, urgency, waterHardness) => {
            const result = getLoadRecommendation({
              items: ['baby_items', 'delicate'],
              soilTypes,
              quantity,
              urgency,
              waterHardness,
            });
            expect(result.cycle).toBe('delicate');
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('calculateSoilScore', () => {
    it('returns a value between 1 and 5 for any SoilType[]', () => {
      fc.assert(
        fc.property(
          fc.array(soilTypeArb, { minLength: 0, maxLength: 7 }),
          (soilTypes) => {
            const score = calculateSoilScore(soilTypes);
            expect(score).toBeGreaterThanOrEqual(1);
            expect(score).toBeLessThanOrEqual(5);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('returns 1 for empty array', () => {
      expect(calculateSoilScore([])).toBe(1);
    });

    it('is monotonic: adding heavier soil types never decreases the score', () => {
      fc.assert(
        fc.property(
          fc.array(soilTypeArb, { minLength: 1, maxLength: 3 }),
          (soilTypes) => {
            const base = calculateSoilScore(soilTypes);
            const withHeavy = calculateSoilScore([...soilTypes, 'heavy']);
            expect(withHeavy).toBeGreaterThanOrEqual(base);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('calculateDosing', () => {
    it('never returns negative doses or NaN in the formatted strings', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          greaseFactorArb,
          cycleTypeArb,
          loadQuantityArb,
          waterHardnessArb,
          (soilScore, greaseFactor, cycle, quantity, waterHardness) => {
            const result = calculateDosing(soilScore, greaseFactor, cycle, quantity, waterHardness);
            // Dose strings should not contain "NaN" or negative numbers
            expect(result.prewashDose).not.toContain('NaN');
            expect(result.mainDose).not.toContain('NaN');
            expect(result.prewashDose).not.toMatch(/-\d/);
            expect(result.mainDose).not.toMatch(/-\d/);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('hard water doses are >= moderate water doses (main dose, non-quick cycles)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          greaseFactorArb,
          fc.constantFrom<CycleType>('eco', 'normal', 'intensive', 'delicate', 'sanitise'),
          loadQuantityArb,
          (soilScore, greaseFactor, cycle, quantity) => {
            const moderate = calculateDosing(soilScore, greaseFactor, cycle, quantity, 'moderate');
            const hard = calculateDosing(soilScore, greaseFactor, cycle, quantity, 'hard');

            // Extract numeric values from dose strings (e.g., "1.5 tablespoons" -> 1.5)
            const extractNumber = (s: string) => {
              const match = s.match(/[\d.]+/);
              return match ? parseFloat(match[0]) : 0;
            };

            expect(extractNumber(hard.mainDose)).toBeGreaterThanOrEqual(extractNumber(moderate.mainDose));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('higher soil score never decreases main dose (all else equal)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          greaseFactorArb,
          fc.constantFrom<CycleType>('eco', 'normal', 'intensive', 'delicate', 'sanitise'),
          loadQuantityArb,
          waterHardnessArb,
          (soilScore, greaseFactor, cycle, quantity, waterHardness) => {
            const lower = calculateDosing(soilScore, greaseFactor, cycle, quantity, waterHardness);
            const higher = calculateDosing(soilScore + 1, greaseFactor, cycle, quantity, waterHardness);

            const extractNumber = (s: string) => {
              const match = s.match(/[\d.]+/);
              return match ? parseFloat(match[0]) : 0;
            };

            expect(extractNumber(higher.mainDose)).toBeGreaterThanOrEqual(extractNumber(lower.mainDose));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('processAnswer', () => {
    const categories: TroubleshootCategory[] = [
      'white_residue', 'cloudy_glasses', 'food_stuck', 'greasy_feeling',
      'spots', 'bad_smell', 'not_drying', 'other',
    ];

    it('never throws for any valid category start step and its options', () => {
      for (const category of categories) {
        const step = getTroubleshootFlow(category);
        expect(step).toBeDefined();
        expect(step.id).toBeDefined();

        if (step.options) {
          for (const option of step.options) {
            const nextStep = processAnswer(step.id, option.value);
            expect(nextStep).toBeDefined();
            expect(nextStep.id).toBeDefined();
          }
        }
      }
    });

    it('returns a step with id for any unknown step ID', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (stepId, answer) => {
            const result = processAnswer(stepId, answer);
            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
