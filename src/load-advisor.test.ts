import { describe, it, expect } from 'vitest';
import {
  calculateSoilScore,
  calculateGreaseFactor,
  selectCycle,
  calculateDosing,
  getPrerinseAdvice,
  getLoadingTips,
  generateReasoning,
  getLoadRecommendation,
} from './load-advisor';
import type { LoadInput, LoadCalculation, CycleType } from './types';

describe('Load Advisor', () => {
  describe('calculateSoilScore', () => {
    it('returns 1 for light soil', () => {
      expect(calculateSoilScore(['light'])).toBe(1);
    });

    it('returns 2 for everyday soil', () => {
      expect(calculateSoilScore(['everyday'])).toBe(2);
    });

    it('returns 3 for protein', () => {
      expect(calculateSoilScore(['protein'])).toBe(3);
    });

    it('returns 4 for greasy', () => {
      expect(calculateSoilScore(['greasy'])).toBe(4);
    });

    it('returns 5 for heavy', () => {
      expect(calculateSoilScore(['heavy'])).toBe(5);
    });

    it('returns max score when multiple soil types', () => {
      expect(calculateSoilScore(['light', 'everyday', 'heavy'])).toBe(5);
      expect(calculateSoilScore(['protein', 'greasy'])).toBe(4);
    });

    it('returns 1 for empty array (default)', () => {
      expect(calculateSoilScore([])).toBe(1);
    });
  });

  describe('calculateGreaseFactor', () => {
    it('returns high for greasy soil', () => {
      expect(calculateGreaseFactor(['greasy'])).toBe('high');
    });

    it('returns medium for protein soil', () => {
      expect(calculateGreaseFactor(['protein'])).toBe('medium');
    });

    it('returns low for other soils', () => {
      expect(calculateGreaseFactor(['light'])).toBe('low');
      expect(calculateGreaseFactor(['everyday'])).toBe('low');
      expect(calculateGreaseFactor(['starchy'])).toBe('low');
    });

    it('returns high when greasy is present with others', () => {
      expect(calculateGreaseFactor(['light', 'greasy'])).toBe('high');
    });
  });

  describe('selectCycle', () => {
    it('selects sanitise for baby items without delicate', () => {
      const calc: LoadCalculation = {
        needsSanitise: true,
        needsGentle: false,
        soilScore: 2,
        greaseFactor: 'low',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'no_rush')).toBe('sanitise');
    });

    it('selects delicate for delicate items', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: true,
        soilScore: 2,
        greaseFactor: 'low',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'no_rush')).toBe('delicate');
    });

    it('selects quick for need_fast with low soil', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: false,
        soilScore: 2,
        greaseFactor: 'low',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'need_fast')).toBe('quick');
    });

    it('selects normal for need_fast with high soil', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: false,
        soilScore: 4,
        greaseFactor: 'high',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'need_fast')).toBe('normal');
    });

    it('selects intensive for heavy soil', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: false,
        soilScore: 5,
        greaseFactor: 'high',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'no_rush')).toBe('intensive');
    });

    it('selects eco for no_rush with moderate soil', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: false,
        soilScore: 2,
        greaseFactor: 'low',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'no_rush')).toBe('eco');
    });

    it('selects normal for protein (needs enzyme time)', () => {
      const calc: LoadCalculation = {
        needsSanitise: false,
        needsGentle: false,
        soilScore: 3,
        greaseFactor: 'medium',
        hasAcidicRisk: false,
      };
      expect(selectCycle(calc, 'need_today')).toBe('normal');
    });
  });

  describe('calculateDosing', () => {
    it('calculates base doses for normal load', () => {
      const doses = calculateDosing(2, 'low', 'normal', 'normal', 'moderate');
      expect(doses.prewashDose).toBe('0.5 tablespoons in the door');
      expect(doses.mainDose).toBe('1.5 tablespoons in dispenser');
    });

    it('increases dose for high grease factor', () => {
      const doses = calculateDosing(4, 'high', 'normal', 'normal', 'moderate');
      expect(doses.prewashDose).toBe('1.5 tablespoons in the door');
    });

    it('no prewash dose for quick cycle', () => {
      const doses = calculateDosing(1, 'low', 'quick', 'normal', 'moderate');
      expect(doses.prewashDose).toBe('None needed');
    });

    it('reduces main dose for light quantity', () => {
      const doses = calculateDosing(2, 'low', 'normal', 'light', 'moderate');
      // 1.5 - 25% = 1.125, rounds down
      expect(doses.mainDose).toBe('1 tablespoon in dispenser');
    });

    it('increases main dose for full quantity', () => {
      const doses = calculateDosing(2, 'low', 'normal', 'full', 'moderate');
      // 1.5 + 25% = 1.875, rounds to 2
      expect(doses.mainDose).toBe('2 tablespoons in dispenser');
    });

    it('increases doses for hard water', () => {
      const doses = calculateDosing(2, 'low', 'normal', 'normal', 'hard');
      // 0.5 * 1.5 = 0.75 rounds to 1
      expect(doses.prewashDose).toBe('1 tablespoon in the door');
      // 1.5 * 1.5 = 2.25 rounds to 2.5
      expect(doses.mainDose).toBe('2.5 tablespoons in dispenser');
    });
  });

  describe('getPrerinseAdvice', () => {
    it('advises to scrape heavy soil', () => {
      const advice = getPrerinseAdvice(['heavy']);
      expect(advice).toContain('Scrape off large chunks');
    });

    it('advises not to rinse grease', () => {
      const advice = getPrerinseAdvice(['greasy']);
      expect(advice).toContain("Don't rinse");
    });

    it('gives protein advice for protein soil', () => {
      const advice = getPrerinseAdvice(['protein']);
      expect(advice).toContain('Light scrape only');
    });

    it('gives starch advice for starchy soil', () => {
      const advice = getPrerinseAdvice(['starchy']);
      expect(advice).toContain('No rinsing needed');
    });

    it('warns about acidic foods', () => {
      const advice = getPrerinseAdvice(['acidic']);
      expect(advice).toContain('Run soon');
    });

    it('gives default advice for light soil', () => {
      const advice = getPrerinseAdvice(['light']);
      expect(advice).toContain('Scrape large food pieces');
    });
  });

  describe('getLoadingTips', () => {
    it('includes glass tip for glasses', () => {
      const tips = getLoadingTips(['glasses'], 'normal');
      expect(tips.some(t => t.includes('glasses'))).toBe(true);
    });

    it('includes bowl tip for bowls', () => {
      const tips = getLoadingTips(['bowls'], 'normal');
      expect(tips.some(t => t.includes('bowls'))).toBe(true);
    });

    it('includes pot/pan tip for pots', () => {
      const tips = getLoadingTips(['pots'], 'normal');
      expect(tips.some(t => t.includes('bottom rack'))).toBe(true);
    });

    it('includes container tip for containers', () => {
      const tips = getLoadingTips(['containers'], 'normal');
      expect(tips.some(t => t.includes('Plastic') || t.includes('top rack'))).toBe(true);
    });

    it('includes spray arm tip for full loads', () => {
      const tips = getLoadingTips(['plates'], 'full');
      expect(tips.some(t => t.includes('spray arm'))).toBe(true);
    });
  });

  describe('generateReasoning', () => {
    it('generates reasoning for eco cycle', () => {
      const reasoning = generateReasoning('eco', 2, 'low');
      expect(reasoning).toContain('Eco');
      expect(reasoning).toContain('enzyme');
    });

    it('generates reasoning for intensive cycle', () => {
      const reasoning = generateReasoning('intensive', 5, 'high');
      expect(reasoning).toContain('Intensive');
    });

    it('generates reasoning for quick cycle', () => {
      const reasoning = generateReasoning('quick', 1, 'low');
      expect(reasoning).toContain('Quick');
    });
  });

  describe('getLoadRecommendation (integration)', () => {
    it('recommends eco for weeknight dinner (example 1)', () => {
      const input: LoadInput = {
        items: ['plates', 'bowls', 'glasses', 'utensils'],
        soilTypes: ['everyday', 'protein'],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('eco');
      expect(result.loadingTips.length).toBeGreaterThan(0);
    });

    it('recommends intensive for Sunday roast (example 2)', () => {
      const input: LoadInput = {
        items: ['plates', 'pots', 'pans', 'bakeware', 'utensils'],
        soilTypes: ['heavy', 'greasy', 'protein'],
        quantity: 'full',
        urgency: 'need_today',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('intensive');
      expect(result.prewashDose).toContain('1.5');
    });

    it('recommends quick for light glasses (example 3)', () => {
      const input: LoadInput = {
        items: ['glasses'],
        soilTypes: ['light'],
        quantity: 'light',
        urgency: 'need_fast',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('quick');
      expect(result.prewashDose).toBe('None needed');
    });

    it('recommends sanitise for baby items', () => {
      const input: LoadInput = {
        items: ['baby_items', 'bottles' as any],
        soilTypes: ['everyday'],
        quantity: 'normal',
        urgency: 'need_today',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('sanitise');
    });

    it('recommends delicate for delicate items', () => {
      const input: LoadInput = {
        items: ['delicate', 'glasses'],
        soilTypes: ['light'],
        quantity: 'light',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('delicate');
    });

    it('warns when quick cycle used with high soil', () => {
      const input: LoadInput = {
        items: ['pots', 'pans'],
        soilTypes: ['heavy', 'greasy'],
        quantity: 'normal',
        urgency: 'need_fast',
      };
      const result = getLoadRecommendation(input);
      // Should still recommend normal due to high soil
      expect(result.cycle).toBe('normal');
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.toLowerCase().includes('quick'))).toBe(true);
    });

    it('warns when delicate items have heavy soil', () => {
      const input: LoadInput = {
        items: ['delicate'],
        soilTypes: ['heavy'],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('delicate');
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some(w => w.toLowerCase().includes('hand wash'))).toBe(true);
    });
  });
});
