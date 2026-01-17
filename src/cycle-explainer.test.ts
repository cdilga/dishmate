import { describe, it, expect } from 'vitest';
import {
  getCycleInfo,
  getAllCycles,
  compareCycles,
  getCycleForSoilType,
  getCycleForItemType,
  getEnzymeExplanation,
  getPrewashExplanation,
  getTemperatureExplanation,
  getAllEducationalContent,
  type CycleInfo,
} from './cycle-explainer';
import type { CycleType, SoilType, ItemType } from './types';

describe('Cycle Explainer', () => {
  describe('getCycleInfo', () => {
    const allCycles: CycleType[] = ['quick', 'eco', 'normal', 'intensive', 'delicate', 'sanitise'];

    it.each(allCycles)('returns info for %s cycle', (cycle) => {
      const info = getCycleInfo(cycle);
      expect(info.cycle).toBe(cycle);
      expect(info.name).toBeTruthy();
      expect(info.duration).toBeTruthy();
      expect(info.temperature).toBeTruthy();
      expect(info.description).toBeTruthy();
      expect(info.howItWorks.length).toBeGreaterThan(0);
      expect(info.bestFor.length).toBeGreaterThan(0);
      expect(info.notSuitableFor.length).toBeGreaterThan(0);
    });

    it('quick cycle is not enzyme-friendly', () => {
      const info = getCycleInfo('quick');
      expect(info.enzymeFriendly).toBe(false);
    });

    it('eco cycle is enzyme-friendly', () => {
      const info = getCycleInfo('eco');
      expect(info.enzymeFriendly).toBe(true);
    });

    it('intensive cycle has high energy usage', () => {
      const info = getCycleInfo('intensive');
      expect(info.energyUsage).toBe('high');
    });

    it('eco cycle has low energy usage', () => {
      const info = getCycleInfo('eco');
      expect(info.energyUsage).toBe('low');
    });

    it('sanitise cycle has high temperature info', () => {
      const info = getCycleInfo('sanitise');
      expect(info.temperature).toContain('70');
    });

    it('delicate cycle has low temperature info', () => {
      const info = getCycleInfo('delicate');
      expect(info.temperature).toContain('40');
    });

    it('each cycle has detergent notes', () => {
      for (const cycle of allCycles) {
        const info = getCycleInfo(cycle);
        expect(info.detergentNotes).toBeTruthy();
        expect(info.detergentNotes.length).toBeGreaterThan(20);
      }
    });
  });

  describe('getAllCycles', () => {
    it('returns all 6 cycles', () => {
      const cycles = getAllCycles();
      expect(cycles.length).toBe(6);
    });

    it('includes all cycle types', () => {
      const cycles = getAllCycles();
      const cycleTypes = cycles.map(c => c.cycle);
      expect(cycleTypes).toContain('quick');
      expect(cycleTypes).toContain('eco');
      expect(cycleTypes).toContain('normal');
      expect(cycleTypes).toContain('intensive');
      expect(cycleTypes).toContain('delicate');
      expect(cycleTypes).toContain('sanitise');
    });
  });

  describe('compareCycles', () => {
    it('recommends eco over quick', () => {
      const comparison = compareCycles('quick', 'eco');
      expect(comparison.recommendation).toBe('eco');
      expect(comparison.reason.toLowerCase()).toContain('enzyme');
    });

    it('recommends normal over quick', () => {
      const comparison = compareCycles('quick', 'normal');
      expect(comparison.recommendation).toBe('normal');
    });

    it('recommends eco over normal for everyday use', () => {
      const comparison = compareCycles('eco', 'normal');
      expect(comparison.recommendation).toBe('eco');
      expect(comparison.reason.toLowerCase()).toContain('energy');
    });

    it('recommends normal over intensive for general use', () => {
      const comparison = compareCycles('normal', 'intensive');
      expect(comparison.recommendation).toBe('normal');
      expect(comparison.reason.toLowerCase()).toContain('energy');
    });

    it('recommends normal over delicate for general use', () => {
      const comparison = compareCycles('delicate', 'normal');
      expect(comparison.recommendation).toBe('normal');
    });

    it('returns both cycle info objects', () => {
      const comparison = compareCycles('quick', 'eco');
      expect(comparison.cycle1.cycle).toBe('quick');
      expect(comparison.cycle2.cycle).toBe('eco');
    });

    it('handles reversed cycle order', () => {
      const comparison1 = compareCycles('quick', 'eco');
      const comparison2 = compareCycles('eco', 'quick');
      expect(comparison1.recommendation).toBe(comparison2.recommendation);
    });
  });

  describe('getCycleForSoilType', () => {
    it('recommends quick for light soil', () => {
      const result = getCycleForSoilType('light');
      expect(result.cycle).toBe('quick');
    });

    it('recommends eco for everyday soil', () => {
      const result = getCycleForSoilType('everyday');
      expect(result.cycle).toBe('eco');
    });

    it('recommends eco for protein soil', () => {
      const result = getCycleForSoilType('protein');
      expect(result.cycle).toBe('eco');
      expect(result.reason.toLowerCase()).toContain('enzyme');
    });

    it('recommends eco for starchy soil', () => {
      const result = getCycleForSoilType('starchy');
      expect(result.cycle).toBe('eco');
    });

    it('recommends normal for greasy soil', () => {
      const result = getCycleForSoilType('greasy');
      expect(result.cycle).toBe('normal');
      expect(result.reason.toLowerCase()).toContain('heat');
    });

    it('recommends intensive for heavy soil', () => {
      const result = getCycleForSoilType('heavy');
      expect(result.cycle).toBe('intensive');
    });

    it('recommends normal for acidic soil (quick processing)', () => {
      const result = getCycleForSoilType('acidic');
      expect(result.cycle).toBe('normal');
      expect(result.reason.toLowerCase()).toContain('stain');
    });

    it('provides a reason for each soil type', () => {
      const soilTypes: SoilType[] = ['light', 'everyday', 'heavy', 'greasy', 'protein', 'starchy', 'acidic'];
      for (const soil of soilTypes) {
        const result = getCycleForSoilType(soil);
        expect(result.reason).toBeTruthy();
        expect(result.reason.length).toBeGreaterThan(20);
      }
    });
  });

  describe('getCycleForItemType', () => {
    it('recommends delicate for delicate items', () => {
      const result = getCycleForItemType('delicate');
      expect(result.cycle).toBe('delicate');
    });

    it('recommends sanitise for baby items', () => {
      const result = getCycleForItemType('baby_items');
      expect(result.cycle).toBe('sanitise');
      expect(result.reason.toLowerCase()).toContain('germ');
    });

    it('recommends normal for containers (avoid warping)', () => {
      const result = getCycleForItemType('containers');
      expect(result.cycle).toBe('normal');
      expect(result.reason.toLowerCase()).toContain('warp');
    });

    it('recommends intensive for pots', () => {
      const result = getCycleForItemType('pots');
      expect(result.cycle).toBe('intensive');
    });

    it('recommends intensive for pans', () => {
      const result = getCycleForItemType('pans');
      expect(result.cycle).toBe('intensive');
    });

    it('recommends intensive for bakeware', () => {
      const result = getCycleForItemType('bakeware');
      expect(result.cycle).toBe('intensive');
    });

    it('recommends normal for regular glasses', () => {
      const result = getCycleForItemType('glasses');
      expect(result.cycle).toBe('normal');
    });

    it('recommends normal for plates (default)', () => {
      const result = getCycleForItemType('plates');
      expect(result.cycle).toBe('normal');
    });

    it('provides a reason for each item type', () => {
      const itemTypes: ItemType[] = ['plates', 'bowls', 'glasses', 'mugs', 'pots', 'pans', 'bakeware', 'utensils', 'containers', 'baby_items', 'cutting_boards', 'delicate'];
      for (const item of itemTypes) {
        const result = getCycleForItemType(item);
        expect(result.reason).toBeTruthy();
        expect(result.reason.length).toBeGreaterThan(10);
      }
    });
  });

  describe('getEnzymeExplanation', () => {
    it('returns educational content about enzymes', () => {
      const content = getEnzymeExplanation();
      expect(content.title).toBeTruthy();
      expect(content.content).toBeTruthy();
      expect(content.keyTakeaway).toBeTruthy();
    });

    it('mentions proteases, amylases, and lipases', () => {
      const content = getEnzymeExplanation();
      expect(content.content.toUpperCase()).toContain('PROTEASE');
      expect(content.content.toUpperCase()).toContain('AMYLASE');
      expect(content.content.toUpperCase()).toContain('LIPASE');
    });

    it('explains why eco cycle is good for enzymes', () => {
      const content = getEnzymeExplanation();
      expect(content.content.toLowerCase()).toContain('eco');
      expect(content.content.toLowerCase()).toContain('time');
    });
  });

  describe('getPrewashExplanation', () => {
    it('returns educational content about pre-wash', () => {
      const content = getPrewashExplanation();
      expect(content.title).toBeTruthy();
      expect(content.content).toBeTruthy();
      expect(content.keyTakeaway).toBeTruthy();
    });

    it('explains the pod problem', () => {
      const content = getPrewashExplanation();
      expect(content.content.toLowerCase()).toContain('pod');
      expect(content.content.toLowerCase()).toContain('dispenser');
    });

    it('recommends powder for pre-wash', () => {
      const content = getPrewashExplanation();
      expect(content.content.toLowerCase()).toContain('powder');
    });

    it('explains where to put pre-wash detergent', () => {
      const content = getPrewashExplanation();
      expect(content.keyTakeaway.toLowerCase()).toContain('door');
    });
  });

  describe('getTemperatureExplanation', () => {
    it('returns educational content about temperatures', () => {
      const content = getTemperatureExplanation();
      expect(content.title).toBeTruthy();
      expect(content.content).toBeTruthy();
      expect(content.keyTakeaway).toBeTruthy();
    });

    it('mentions temperature ranges', () => {
      const content = getTemperatureExplanation();
      expect(content.content).toContain('40');
      expect(content.content).toContain('50');
      expect(content.content).toContain('65');
      expect(content.content).toContain('75');
    });

    it('explains when to use different temperatures', () => {
      const content = getTemperatureExplanation();
      expect(content.content.toLowerCase()).toContain('enzyme');
      expect(content.content.toLowerCase()).toContain('baked');
    });
  });

  describe('getAllEducationalContent', () => {
    it('returns all 3 educational pieces', () => {
      const content = getAllEducationalContent();
      expect(content.length).toBe(3);
    });

    it('each piece has title, content, and keyTakeaway', () => {
      const content = getAllEducationalContent();
      for (const piece of content) {
        expect(piece.title).toBeTruthy();
        expect(piece.content).toBeTruthy();
        expect(piece.keyTakeaway).toBeTruthy();
      }
    });

    it('includes enzyme, pre-wash, and temperature explanations', () => {
      const content = getAllEducationalContent();
      const titles = content.map(c => c.title.toLowerCase());
      expect(titles.some(t => t.includes('enzyme'))).toBe(true);
      expect(titles.some(t => t.includes('pre-wash'))).toBe(true);
      expect(titles.some(t => t.includes('temperature'))).toBe(true);
    });
  });
});
