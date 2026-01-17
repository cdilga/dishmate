import { describe, it, expect } from 'vitest';
import { getLoadRecommendation, calculateSoilScore, calculateGreaseFactor } from './load-advisor';
import { getDetergentRecommendation, type DetergentInput } from './detergent-advisor';
import { generateMaintenanceSchedule, quickMaintenanceCheck } from './maintenance-guide';
import { getCycleForSoilType, getCycleForItemType } from './cycle-explainer';
import { shouldScrapeItem, shouldLeaveItem } from './prerinse-guide';
import type { LoadInput, SoilType, ItemType, WaterHardness, Urgency, LoadQuantity } from './types';

/**
 * Property-based and edge case tests to ensure robustness
 */
describe('Edge Cases and Property Tests', () => {
  describe('Load Advisor Edge Cases', () => {
    it('handles empty items array', () => {
      const input: LoadInput = {
        items: [],
        soilTypes: ['everyday'],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBeDefined();
      expect(result.loadingTips).toEqual([]); // No items = no tips
    });

    it('handles empty soil types array', () => {
      const input: LoadInput = {
        items: ['plates'],
        soilTypes: [],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBeDefined();
      expect(calculateSoilScore([])).toBe(1); // Default to light
    });

    it('handles all soil types at once', () => {
      const allSoilTypes: SoilType[] = ['light', 'everyday', 'heavy', 'greasy', 'protein', 'starchy', 'acidic'];
      const input: LoadInput = {
        items: ['plates'],
        soilTypes: allSoilTypes,
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('intensive'); // Heavy is max score
      expect(result.warnings?.some(w => w.includes('acidic'))).toBe(true);
    });

    it('handles all item types at once', () => {
      const allItems: ItemType[] = ['plates', 'bowls', 'glasses', 'mugs', 'pots', 'pans', 'bakeware', 'utensils', 'containers', 'baby_items', 'cutting_boards', 'delicate'];
      const input: LoadInput = {
        items: allItems,
        soilTypes: ['everyday'],
        quantity: 'full',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      // Should prioritize delicate over baby_items when both present (delicate has damage risk)
      expect(result.cycle).toBe('delicate');
      expect(result.loadingTips.length).toBeGreaterThan(0);
    });

    it('baby items without delicate items gets sanitise', () => {
      const input: LoadInput = {
        items: ['baby_items', 'bottles' as ItemType],
        soilTypes: ['everyday'],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const result = getLoadRecommendation(input);
      expect(result.cycle).toBe('sanitise');
    });

    it('conflicting urgency and soil - urgency wins but with warning', () => {
      const input: LoadInput = {
        items: ['pots', 'pans'],
        soilTypes: ['heavy', 'greasy'],
        quantity: 'full',
        urgency: 'need_fast',
      };
      const result = getLoadRecommendation(input);
      // Can't use quick with high soil, so falls back to normal
      expect(result.cycle).toBe('normal');
      expect(result.warnings).toBeDefined();
    });

    it('property: soil score is always between 1-5', () => {
      const allCombinations: SoilType[][] = [
        [], ['light'], ['heavy'], ['light', 'heavy'],
        ['greasy', 'protein'], ['everyday', 'starchy', 'acidic'],
      ];
      for (const soils of allCombinations) {
        const score = calculateSoilScore(soils);
        expect(score).toBeGreaterThanOrEqual(1);
        expect(score).toBeLessThanOrEqual(5);
      }
    });

    it('property: grease factor is always valid', () => {
      const allCombinations: SoilType[][] = [
        [], ['light'], ['greasy'], ['protein'],
        ['light', 'greasy'], ['protein', 'greasy'],
      ];
      for (const soils of allCombinations) {
        const factor = calculateGreaseFactor(soils);
        expect(['low', 'medium', 'high']).toContain(factor);
      }
    });

    it('water hardness variations all produce valid results', () => {
      const hardnessLevels: WaterHardness[] = ['soft', 'moderate', 'hard', 'unknown'];
      for (const hardness of hardnessLevels) {
        const input: LoadInput = {
          items: ['plates'],
          soilTypes: ['everyday'],
          quantity: 'normal',
          urgency: 'no_rush',
          waterHardness: hardness,
        };
        const result = getLoadRecommendation(input);
        expect(result.cycle).toBeDefined();
        expect(result.prewashDose).toBeDefined();
        expect(result.mainDose).toBeDefined();
      }
    });

    it('all urgency levels produce valid results', () => {
      const urgencies: Urgency[] = ['no_rush', 'need_today', 'need_fast'];
      for (const urgency of urgencies) {
        const input: LoadInput = {
          items: ['plates'],
          soilTypes: ['everyday'],
          quantity: 'normal',
          urgency,
        };
        const result = getLoadRecommendation(input);
        expect(result.cycle).toBeDefined();
      }
    });

    it('all quantity levels produce valid results', () => {
      const quantities: LoadQuantity[] = ['light', 'normal', 'full'];
      for (const quantity of quantities) {
        const input: LoadInput = {
          items: ['plates'],
          soilTypes: ['everyday'],
          quantity,
          urgency: 'no_rush',
        };
        const result = getLoadRecommendation(input);
        expect(result.cycle).toBeDefined();
      }
    });
  });

  describe('Detergent Advisor Edge Cases', () => {
    it('handles unknown water hardness', () => {
      const input: DetergentInput = {
        waterHardness: 'unknown',
        usagePattern: 'regular',
        mainConcern: 'clean_dishes',
        typicalSoilTypes: ['everyday'],
      };
      const result = getDetergentRecommendation(input);
      expect(result.recommendedFormat).toBeDefined();
    });

    it('handles no current format', () => {
      const input: DetergentInput = {
        waterHardness: 'moderate',
        usagePattern: 'regular',
        mainConcern: 'clean_dishes',
        typicalSoilTypes: ['everyday'],
      };
      const result = getDetergentRecommendation(input);
      expect(result.recommendedFormat).toBeDefined();
    });

    it('handles empty soil types', () => {
      const input: DetergentInput = {
        waterHardness: 'moderate',
        usagePattern: 'regular',
        mainConcern: 'clean_dishes',
        typicalSoilTypes: [],
      };
      const result = getDetergentRecommendation(input);
      expect(result.recommendedFormat).toBeDefined();
    });

    it('all main concerns produce valid recommendations', () => {
      const concerns: DetergentInput['mainConcern'][] = ['clean_dishes', 'convenience', 'cost', 'eco', 'specific_problem'];
      for (const concern of concerns) {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: concern,
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBeDefined();
        expect(result.usageInstructions.length).toBeGreaterThan(0);
      }
    });

    it('conflicting issues - greasy + residue', () => {
      const input: DetergentInput = {
        currentFormat: 'pods',
        waterHardness: 'hard',
        usagePattern: 'daily',
        mainConcern: 'clean_dishes',
        typicalSoilTypes: ['greasy', 'heavy'],
        hasGreasyIssues: true,
        hasResidueIssues: true,
      };
      const result = getDetergentRecommendation(input);
      // Greasy issues take priority - powder is the only fix
      expect(result.recommendedFormat).toBe('powder');
    });
  });

  describe('Maintenance Guide Edge Cases', () => {
    it('handles zero loads per week', () => {
      const schedule = generateMaintenanceSchedule({
        waterHardness: 'moderate',
        loadsPerWeek: 0,
      });
      expect(schedule.usageLevel).toBe('light');
      expect(schedule.tasks.length).toBeGreaterThan(0);
    });

    it('handles very high loads per week', () => {
      const schedule = generateMaintenanceSchedule({
        waterHardness: 'moderate',
        loadsPerWeek: 100,
      });
      expect(schedule.usageLevel).toBe('heavy');
    });

    it('handles future dates gracefully', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const schedule = generateMaintenanceSchedule({
        waterHardness: 'moderate',
        loadsPerWeek: 5,
        lastFilterClean: futureDate,
      });
      // Should not warn about filter since it's "cleaned in the future"
      expect(schedule.nextActions.every(a => !a.includes('days since'))).toBe(true);
    });

    it('all water hardness levels work', () => {
      const hardnessLevels: WaterHardness[] = ['soft', 'moderate', 'hard', 'unknown'];
      for (const hardness of hardnessLevels) {
        const schedule = generateMaintenanceSchedule({
          waterHardness: hardness,
          loadsPerWeek: 5,
        });
        expect(schedule.tasks.length).toBeGreaterThan(0);
      }
    });

    it('quickMaintenanceCheck handles all combinations', () => {
      // Test all true
      const allGood = quickMaintenanceCheck({
        filterCleanedWithin30Days: true,
        deepCleanWithin60Days: true,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });
      expect(allGood.score).toBe(100);
      expect(allGood.status).toBe('good');

      // Test all false
      const allBad = quickMaintenanceCheck({
        filterCleanedWithin30Days: false,
        deepCleanWithin60Days: false,
        rinseAidFull: false,
        noSmellIssues: false,
        noResidueIssues: false,
        noDirtyDishIssues: false,
      });
      expect(allBad.score).toBeLessThan(50);
      expect(allBad.status).toBe('urgent');
    });
  });

  describe('Cycle Explainer Edge Cases', () => {
    it('all soil types map to valid cycles', () => {
      const soilTypes: SoilType[] = ['light', 'everyday', 'heavy', 'greasy', 'protein', 'starchy', 'acidic'];
      for (const soil of soilTypes) {
        const result = getCycleForSoilType(soil);
        expect(['quick', 'eco', 'normal', 'intensive', 'delicate', 'sanitise']).toContain(result.cycle);
        expect(result.reason).toBeTruthy();
      }
    });

    it('all item types map to valid cycles', () => {
      const itemTypes: ItemType[] = ['plates', 'bowls', 'glasses', 'mugs', 'pots', 'pans', 'bakeware', 'utensils', 'containers', 'baby_items', 'cutting_boards', 'delicate'];
      for (const item of itemTypes) {
        const result = getCycleForItemType(item);
        expect(['quick', 'eco', 'normal', 'intensive', 'delicate', 'sanitise']).toContain(result.cycle);
        expect(result.reason).toBeTruthy();
      }
    });
  });

  describe('Pre-Rinse Guide Edge Cases', () => {
    it('handles empty string', () => {
      expect(shouldScrapeItem('')).toBe(false);
      expect(shouldLeaveItem('')).toBe(false);
    });

    it('handles case insensitivity', () => {
      expect(shouldScrapeItem('BONES')).toBe(true);
      expect(shouldScrapeItem('Bones')).toBe(true);
      expect(shouldScrapeItem('bones')).toBe(true);
    });

    it('handles combined terms', () => {
      expect(shouldScrapeItem('large food chunks with bones')).toBe(true);
      expect(shouldLeaveItem('dried tomato sauce residue')).toBe(true);
    });

    it('scrape takes priority over leave', () => {
      // Something that matches both patterns - scrape should win
      expect(shouldLeaveItem('large dried chunks')).toBe(false);
    });

    it('handles special characters', () => {
      expect(shouldScrapeItem('bones!!!')).toBe(true);
      expect(shouldLeaveItem('grease...')).toBe(true);
    });

    it('handles whitespace', () => {
      expect(shouldScrapeItem('  bones  ')).toBe(true);
      expect(shouldLeaveItem('  grease  ')).toBe(true);
    });
  });

  describe('Cross-Module Consistency', () => {
    it('load advisor cycle matches cycle explainer info', () => {
      const input: LoadInput = {
        items: ['plates'],
        soilTypes: ['protein'],
        quantity: 'normal',
        urgency: 'no_rush',
      };
      const loadResult = getLoadRecommendation(input);
      const cycleResult = getCycleForSoilType('protein');

      // Both should recommend eco for protein
      expect(loadResult.cycle).toBe('eco');
      expect(cycleResult.cycle).toBe('eco');
    });

    it('detergent advisor aligns with pre-rinse guide philosophy', () => {
      // Both should emphasize not rinsing grease
      const detergentResult = getDetergentRecommendation({
        waterHardness: 'moderate',
        usagePattern: 'regular',
        mainConcern: 'clean_dishes',
        typicalSoilTypes: ['greasy'],
        hasGreasyIssues: true,
      });

      // Detergent advisor recommends powder which aligns with pre-rinse guide
      // (don't rinse, let detergent handle it)
      expect(detergentResult.recommendedFormat).toBe('powder');
      expect(detergentResult.reasoning.toLowerCase()).toContain('pre-wash');
    });

    it('maintenance recommendations align with troubleshooter solutions', () => {
      const maintenance = generateMaintenanceSchedule({
        waterHardness: 'hard',
        loadsPerWeek: 5,
        hasSmellIssues: true,
      });

      // Should recommend filter cleaning for smell issues
      expect(maintenance.nextActions.some(a => a.toLowerCase().includes('filter'))).toBe(true);
    });
  });
});
