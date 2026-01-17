import { describe, it, expect } from 'vitest';
import {
  getRinseAidRecommendation,
  getRinseAidExplanation,
  getDryingTips,
  getRinseAidSettings,
  diagnoseSpotIssue,
} from './rinse-aid-guide';

describe('Rinse Aid Guide', () => {
  describe('getRinseAidRecommendation', () => {
    it('recommends maximum setting for hard water', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'hard',
        hasSpotIssues: true,
        hasDryingIssues: false,
      });
      expect(result.settingRecommendation).toBe('maximum');
      expect(result.reasoning).toContain('hard water');
    });

    it('recommends medium setting for moderate water without issues', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'moderate',
        hasSpotIssues: false,
        hasDryingIssues: false,
      });
      expect(result.settingRecommendation).toBe('medium');
    });

    it('recommends higher setting when spot issues are present', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'soft',
        hasSpotIssues: true,
        hasDryingIssues: false,
      });
      expect(result.settingRecommendation).toBe('medium');
      expect(result.reasoning).toContain('spot');
    });

    it('recommends higher setting for drying issues', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'soft',
        hasSpotIssues: false,
        hasDryingIssues: true,
      });
      expect(result.settingRecommendation).toBe('medium');
    });

    it('recommends low setting for soft water without issues', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'soft',
        hasSpotIssues: false,
        hasDryingIssues: false,
      });
      expect(result.settingRecommendation).toBe('low');
    });

    it('includes refill reminder for empty dispenser', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'moderate',
        hasSpotIssues: false,
        hasDryingIssues: false,
        dispenserEmpty: true,
      });
      expect(result.urgentActions).toContain('Refill rinse aid dispenser immediately');
    });

    it('provides usage tips', () => {
      const result = getRinseAidRecommendation({
        waterHardness: 'moderate',
        hasSpotIssues: false,
        hasDryingIssues: false,
      });
      expect(result.usageTips.length).toBeGreaterThan(0);
    });
  });

  describe('getRinseAidExplanation', () => {
    it('returns educational content about how rinse aid works', () => {
      const explanation = getRinseAidExplanation();
      expect(explanation.title).toContain('Rinse Aid');
      expect(explanation.howItWorks.length).toBeGreaterThan(0);
      expect(explanation.benefits.length).toBeGreaterThan(0);
    });

    it('explains the science of surface tension', () => {
      const explanation = getRinseAidExplanation();
      expect(explanation.howItWorks.join(' ')).toMatch(/surface tension|sheet/i);
    });

    it('addresses common misconceptions', () => {
      const explanation = getRinseAidExplanation();
      expect(explanation.commonMisconceptions.length).toBeGreaterThan(0);
    });
  });

  describe('getDryingTips', () => {
    it('returns tips for plastic items', () => {
      const tips = getDryingTips('plastic');
      expect(tips.length).toBeGreaterThan(0);
      expect(tips.join(' ')).toMatch(/plastic|top rack/i);
    });

    it('returns tips for glass items', () => {
      const tips = getDryingTips('glass');
      expect(tips.length).toBeGreaterThan(0);
    });

    it('returns tips for ceramic items', () => {
      const tips = getDryingTips('ceramic');
      expect(tips.length).toBeGreaterThan(0);
    });

    it('returns general tips for mixed items', () => {
      const tips = getDryingTips('mixed');
      expect(tips.length).toBeGreaterThan(0);
    });
  });

  describe('getRinseAidSettings', () => {
    it('returns all available settings', () => {
      const settings = getRinseAidSettings();
      expect(settings).toContain('low');
      expect(settings).toContain('medium');
      expect(settings).toContain('high');
      expect(settings).toContain('maximum');
    });
  });

  describe('diagnoseSpotIssue', () => {
    it('diagnoses rinse aid issue for water spots that wipe off', () => {
      const diagnosis = diagnoseSpotIssue({
        spotsWipeOff: true,
        waterHardness: 'moderate',
      });
      expect(diagnosis.likelyCause).toBe('insufficient_rinse_aid');
      expect(diagnosis.solutions.length).toBeGreaterThan(0);
    });

    it('diagnoses hard water deposits for spots that need vinegar', () => {
      const diagnosis = diagnoseSpotIssue({
        spotsWipeOff: false,
        needsVinegarToRemove: true,
        waterHardness: 'hard',
      });
      expect(diagnosis.likelyCause).toBe('hard_water_deposits');
    });

    it('diagnoses etching for permanent marks on glass', () => {
      const diagnosis = diagnoseSpotIssue({
        spotsWipeOff: false,
        needsVinegarToRemove: false,
        waterHardness: 'soft',
      });
      expect(diagnosis.likelyCause).toBe('etching');
      expect(diagnosis.isPermanent).toBe(true);
    });

    it('provides appropriate solutions for each diagnosis', () => {
      const rinseAidIssue = diagnoseSpotIssue({
        spotsWipeOff: true,
        waterHardness: 'moderate',
      });
      expect(rinseAidIssue.solutions.some(s => s.toLowerCase().includes('rinse aid'))).toBe(true);

      const hardWaterIssue = diagnoseSpotIssue({
        spotsWipeOff: false,
        needsVinegarToRemove: true,
        waterHardness: 'hard',
      });
      expect(hardWaterIssue.solutions.some(s => s.toLowerCase().includes('salt') || s.toLowerCase().includes('hardness'))).toBe(true);
    });
  });
});
