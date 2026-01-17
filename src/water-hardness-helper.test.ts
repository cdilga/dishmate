import { describe, it, expect } from 'vitest';
import {
  getWaterHardnessTest,
  interpretTestResult,
  getHardnessRecommendations,
  getAustralianCityHardness,
  getHardnessExplanation,
  getAllHardnessLevels,
  estimateHardnessFromSymptoms,
} from './water-hardness-helper';

describe('Water Hardness Helper', () => {
  describe('getWaterHardnessTest', () => {
    it('returns the soap bottle test instructions', () => {
      const test = getWaterHardnessTest();
      expect(test.name).toBe('Soap Bottle Test');
      expect(test.steps.length).toBeGreaterThan(0);
      expect(test.steps.join(' ').toLowerCase()).toContain('shake');
    });

    it('includes materials needed', () => {
      const test = getWaterHardnessTest();
      expect(test.materials.length).toBeGreaterThan(0);
      expect(test.materials.some(m => m.toLowerCase().includes('bottle'))).toBe(true);
    });

    it('includes interpretation guide', () => {
      const test = getWaterHardnessTest();
      expect(test.interpretationGuide).toBeDefined();
      expect(Object.keys(test.interpretationGuide).length).toBeGreaterThan(0);
    });
  });

  describe('interpretTestResult', () => {
    it('identifies hard water from low suds and milky appearance', () => {
      const result = interpretTestResult({
        sudsAmount: 'few',
        waterClarity: 'milky',
      });
      expect(result.hardness).toBe('hard');
    });

    it('identifies soft water from lots of suds and clear water', () => {
      const result = interpretTestResult({
        sudsAmount: 'lots',
        waterClarity: 'clear',
      });
      expect(result.hardness).toBe('soft');
    });

    it('identifies moderate water from moderate indicators', () => {
      const result = interpretTestResult({
        sudsAmount: 'some',
        waterClarity: 'slightly_cloudy',
      });
      expect(result.hardness).toBe('moderate');
    });

    it('provides confidence level', () => {
      const result = interpretTestResult({
        sudsAmount: 'lots',
        waterClarity: 'clear',
      });
      expect(result.confidence).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(result.confidence);
    });

    it('suggests professional test for ambiguous results', () => {
      const result = interpretTestResult({
        sudsAmount: 'some',
        waterClarity: 'milky',
      });
      expect(result.suggestProfessionalTest).toBe(true);
    });
  });

  describe('getHardnessRecommendations', () => {
    it('recommends more detergent for hard water', () => {
      const recs = getHardnessRecommendations('hard');
      expect(recs.detergentAdjustment).toContain('50');
      expect(recs.useSalt).toBe(true);
      expect(recs.rinseAidSetting).toBe('maximum');
    });

    it('recommends less detergent for soft water', () => {
      const recs = getHardnessRecommendations('soft');
      expect(recs.detergentAdjustment).toMatch(/less|reduce|half/i);
      expect(recs.useSalt).toBe(false);
    });

    it('provides moderate recommendations for moderate water', () => {
      const recs = getHardnessRecommendations('moderate');
      expect(recs.detergentAdjustment).toMatch(/standard|packet|normal/i);
    });

    it('handles unknown water hardness', () => {
      const recs = getHardnessRecommendations('unknown');
      expect(recs.firstStep).toContain('test');
    });

    it('includes all key recommendation fields', () => {
      const recs = getHardnessRecommendations('hard');
      expect(recs.detergentAdjustment).toBeDefined();
      expect(recs.useSalt).toBeDefined();
      expect(recs.rinseAidSetting).toBeDefined();
      expect(recs.maintenanceFrequency).toBeDefined();
    });
  });

  describe('getAustralianCityHardness', () => {
    it('returns hardness for Sydney', () => {
      const result = getAustralianCityHardness('Sydney');
      expect(result.hardness).toBe('soft');
      expect(result.city).toBe('Sydney');
    });

    it('returns hardness for Adelaide (known hard water)', () => {
      const result = getAustralianCityHardness('Adelaide');
      expect(result.hardness).toBe('hard');
    });

    it('returns hardness for Melbourne', () => {
      const result = getAustralianCityHardness('Melbourne');
      expect(['soft', 'moderate']).toContain(result.hardness);
    });

    it('returns hardness for Brisbane', () => {
      const result = getAustralianCityHardness('Brisbane');
      expect(result.hardness).toBeDefined();
    });

    it('returns hardness for Perth', () => {
      const result = getAustralianCityHardness('Perth');
      expect(result.hardness).toBeDefined();
    });

    it('handles unknown cities gracefully', () => {
      const result = getAustralianCityHardness('Unknown City');
      expect(result.hardness).toBe('unknown');
      expect(result.message).toContain('test');
    });

    it('is case insensitive', () => {
      const result1 = getAustralianCityHardness('sydney');
      const result2 = getAustralianCityHardness('SYDNEY');
      expect(result1.hardness).toBe(result2.hardness);
    });

    it('provides source information', () => {
      const result = getAustralianCityHardness('Sydney');
      expect(result.source).toBeDefined();
    });
  });

  describe('getHardnessExplanation', () => {
    it('explains what water hardness is', () => {
      const explanation = getHardnessExplanation();
      expect(explanation.whatIsIt).toBeDefined();
      expect(explanation.whatIsIt).toMatch(/mineral|calcium|magnesium/i);
    });

    it('explains why it matters for dishwashing', () => {
      const explanation = getHardnessExplanation();
      expect(explanation.whyItMatters).toBeDefined();
      expect(explanation.whyItMatters.length).toBeGreaterThan(0);
    });

    it('includes measurement units', () => {
      const explanation = getHardnessExplanation();
      expect(explanation.measurementUnits).toBeDefined();
      expect(explanation.measurementUnits.some(u => u.includes('ppm') || u.includes('mg/L'))).toBe(true);
    });

    it('includes hardness scale', () => {
      const explanation = getHardnessExplanation();
      expect(explanation.hardnessScale).toBeDefined();
      expect(explanation.hardnessScale.soft).toBeDefined();
      expect(explanation.hardnessScale.hard).toBeDefined();
    });
  });

  describe('getAllHardnessLevels', () => {
    it('returns all hardness levels', () => {
      const levels = getAllHardnessLevels();
      expect(levels).toContain('soft');
      expect(levels).toContain('moderate');
      expect(levels).toContain('hard');
      expect(levels).toContain('unknown');
    });
  });

  describe('estimateHardnessFromSymptoms', () => {
    it('estimates hard water from white residue', () => {
      const estimate = estimateHardnessFromSymptoms({
        whiteResidueOnDishes: true,
        cloudyGlasses: true,
        scaleInKettle: true,
      });
      expect(estimate.likelyHardness).toBe('hard');
      expect(estimate.confidence).toBe('high');
    });

    it('estimates soft water from no symptoms', () => {
      const estimate = estimateHardnessFromSymptoms({
        whiteResidueOnDishes: false,
        cloudyGlasses: false,
        scaleInKettle: false,
        soapLathersEasily: true,
      });
      expect(estimate.likelyHardness).toBe('soft');
    });

    it('provides low confidence for mixed symptoms', () => {
      const estimate = estimateHardnessFromSymptoms({
        whiteResidueOnDishes: true,
        cloudyGlasses: false,
        scaleInKettle: false,
      });
      expect(['low', 'medium']).toContain(estimate.confidence);
    });

    it('suggests testing when uncertain', () => {
      const estimate = estimateHardnessFromSymptoms({
        whiteResidueOnDishes: false,
        cloudyGlasses: true,
      });
      expect(estimate.recommendTest).toBe(true);
    });
  });
});
