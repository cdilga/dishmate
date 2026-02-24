/**
 * Barrel export tests — imports via ./index (the public API surface).
 *
 * These tests exist specifically to catch the class of bug where a function is
 * present in its source module but missing from a consumer's import list. The
 * Water Hardness tab was blank in production because getHardnessExplanation was
 * called in demo/main.ts but never imported. Tests that import directly from the
 * source module cannot catch this; tests that import via the barrel can.
 */
import { describe, it, expect } from 'vitest';

import {
  getWaterHardnessTest,
  interpretTestResult,
  getHardnessRecommendations,
  getAustralianCityHardness,
  getHardnessExplanation,
  getAllHardnessLevels,
  estimateHardnessFromSymptoms,
} from './index';

describe('Barrel exports — Water Hardness Helper', () => {
  it('exports getHardnessExplanation and returns a complete object', () => {
    expect(typeof getHardnessExplanation).toBe('function');
    const explanation = getHardnessExplanation();
    expect(explanation.whatIsIt).toBeDefined();
    expect(explanation.whyItMatters.length).toBeGreaterThan(0);
    expect(explanation.hardnessScale.soft).toBeDefined();
    expect(explanation.hardnessScale.moderate).toBeDefined();
    expect(explanation.hardnessScale.hard).toBeDefined();
    expect(explanation.hardnessScale.unknown).toBeDefined();
  });

  it('exports getWaterHardnessTest', () => {
    expect(typeof getWaterHardnessTest).toBe('function');
    const test = getWaterHardnessTest();
    expect(test.name).toBe('Soap Bottle Test');
    expect(test.steps.length).toBeGreaterThan(0);
  });

  it('exports interpretTestResult', () => {
    expect(typeof interpretTestResult).toBe('function');
    const result = interpretTestResult({ sudsAmount: 'few', waterClarity: 'milky' });
    expect(result.hardness).toBe('hard');
    expect(result.confidence).toBeDefined();
  });

  it('exports getHardnessRecommendations', () => {
    expect(typeof getHardnessRecommendations).toBe('function');
    const recs = getHardnessRecommendations('hard');
    expect(recs.useSalt).toBe(true);
    expect(recs.rinseAidSetting).toBe('maximum');
  });

  it('exports getAustralianCityHardness', () => {
    expect(typeof getAustralianCityHardness).toBe('function');
    const result = getAustralianCityHardness('Sydney');
    expect(result.hardness).toBe('soft');
    expect(result.city).toBe('Sydney');
  });

  it('exports getAllHardnessLevels', () => {
    expect(typeof getAllHardnessLevels).toBe('function');
    const levels = getAllHardnessLevels();
    expect(levels).toContain('soft');
    expect(levels).toContain('moderate');
    expect(levels).toContain('hard');
    expect(levels).toContain('unknown');
  });

  it('exports estimateHardnessFromSymptoms', () => {
    expect(typeof estimateHardnessFromSymptoms).toBe('function');
    const estimate = estimateHardnessFromSymptoms({
      whiteResidueOnDishes: true,
      scaleInKettle: true,
      cloudyGlasses: true,
    });
    expect(estimate.likelyHardness).toBe('hard');
    expect(estimate.confidence).toBe('high');
  });
});
