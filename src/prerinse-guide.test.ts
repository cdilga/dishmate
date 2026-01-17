import { describe, it, expect } from 'vitest';
import {
  getPreRinseGuide,
  getWhatToLeave,
  getWhatToScrape,
  getCommonMyths,
  shouldScrapeItem,
  shouldLeaveItem,
} from './prerinse-guide';

describe('Pre-Rinse Guide', () => {
  describe('getWhatToLeave', () => {
    it('returns items that should be left on dishes', () => {
      const items = getWhatToLeave();
      expect(items.length).toBeGreaterThan(0);

      // Check for expected items
      const itemNames = items.map(i => i.item.toLowerCase());
      expect(itemNames).toContain('grease and oil');
      expect(itemNames).toContain('dried sauce and food residue');
      expect(itemNames).toContain('dried egg, cheese, dairy');
    });

    it('each item has a reason', () => {
      const items = getWhatToLeave();
      for (const item of items) {
        expect(item.item).toBeTruthy();
        expect(item.reason).toBeTruthy();
        expect(item.reason.length).toBeGreaterThan(10);
      }
    });

    it('reasons explain enzyme/surfactant science', () => {
      const items = getWhatToLeave();
      const allReasons = items.map(i => i.reason.toLowerCase()).join(' ');
      expect(allReasons).toMatch(/enzyme|surfactant|dissolve|emulsify|break down/);
    });
  });

  describe('getWhatToScrape', () => {
    it('returns items that should be scraped off', () => {
      const items = getWhatToScrape();
      expect(items.length).toBeGreaterThan(0);

      // Check for expected items
      const itemNames = items.map(i => i.item.toLowerCase());
      expect(itemNames).toContain('large food chunks');
      expect(itemNames).toContain('seeds, pips, toothpicks, labels');
    });

    it('each item has a reason', () => {
      const items = getWhatToScrape();
      for (const item of items) {
        expect(item.item).toBeTruthy();
        expect(item.reason).toBeTruthy();
        expect(item.reason.length).toBeGreaterThan(10);
      }
    });

    it('mentions filter clogging risk', () => {
      const items = getWhatToScrape();
      const allReasons = items.map(i => i.reason.toLowerCase()).join(' ');
      expect(allReasons).toMatch(/clog|filter|block|drain/);
    });
  });

  describe('getCommonMyths', () => {
    it('returns common pre-rinse myths', () => {
      const myths = getCommonMyths();
      expect(myths.length).toBeGreaterThan(0);
    });

    it('each myth has a reality explanation', () => {
      const myths = getCommonMyths();
      for (const myth of myths) {
        expect(myth.myth).toBeTruthy();
        expect(myth.reality).toBeTruthy();
        expect(myth.reality.length).toBeGreaterThan(20);
      }
    });

    it('addresses the "mum always rinsed" myth', () => {
      const myths = getCommonMyths();
      const mythTexts = myths.map(m => m.myth.toLowerCase());
      expect(mythTexts.some(m => m.includes('mum') || m.includes('always') || m.includes('rinse'))).toBe(true);
    });

    it('addresses food drying concern', () => {
      const myths = getCommonMyths();
      const mythTexts = myths.map(m => m.myth.toLowerCase());
      expect(mythTexts.some(m => m.includes('dry') || m.includes('hard'))).toBe(true);
    });
  });

  describe('shouldScrapeItem', () => {
    it('returns true for bones', () => {
      expect(shouldScrapeItem('bones')).toBe(true);
      expect(shouldScrapeItem('chicken bones')).toBe(true);
    });

    it('returns true for seeds and pips', () => {
      expect(shouldScrapeItem('seeds')).toBe(true);
      expect(shouldScrapeItem('olive pips')).toBe(true);
    });

    it('returns true for paper/labels', () => {
      expect(shouldScrapeItem('napkin')).toBe(true);
      expect(shouldScrapeItem('paper')).toBe(true);
      expect(shouldScrapeItem('label')).toBe(true);
    });

    it('returns true for coffee grounds', () => {
      expect(shouldScrapeItem('coffee grounds')).toBe(true);
      expect(shouldScrapeItem('tea leaves')).toBe(true);
    });

    it('returns true for large chunks', () => {
      expect(shouldScrapeItem('large food pieces')).toBe(true);
      expect(shouldScrapeItem('big chunks')).toBe(true);
    });

    it('returns false for normal residue', () => {
      expect(shouldScrapeItem('sauce')).toBe(false);
      expect(shouldScrapeItem('grease')).toBe(false);
      expect(shouldScrapeItem('dried food')).toBe(false);
    });
  });

  describe('shouldLeaveItem', () => {
    it('returns true for grease', () => {
      expect(shouldLeaveItem('grease')).toBe(true);
      expect(shouldLeaveItem('oil')).toBe(true);
      expect(shouldLeaveItem('butter')).toBe(true);
    });

    it('returns true for dried sauce', () => {
      expect(shouldLeaveItem('dried sauce')).toBe(true);
      expect(shouldLeaveItem('tomato sauce')).toBe(true);
    });

    it('returns true for protein residue', () => {
      expect(shouldLeaveItem('egg')).toBe(true);
      expect(shouldLeaveItem('cheese')).toBe(true);
      expect(shouldLeaveItem('dried milk')).toBe(true);
    });

    it('returns true for starch', () => {
      expect(shouldLeaveItem('pasta residue')).toBe(true);
      expect(shouldLeaveItem('rice')).toBe(true);
      expect(shouldLeaveItem('potato')).toBe(true);
    });

    it('returns false for items that should be scraped', () => {
      expect(shouldLeaveItem('bones')).toBe(false);
      expect(shouldLeaveItem('paper')).toBe(false);
      expect(shouldLeaveItem('coffee grounds')).toBe(false);
    });
  });

  describe('getPreRinseGuide', () => {
    it('returns a complete guide', () => {
      const guide = getPreRinseGuide();
      expect(guide).toHaveProperty('whatToLeave');
      expect(guide).toHaveProperty('whatToScrape');
      expect(guide).toHaveProperty('commonMyths');
    });

    it('guide summary is provided', () => {
      const guide = getPreRinseGuide();
      expect(guide.summary).toBeDefined();
      expect(guide.summary.toLowerCase()).toContain('scrape');
      expect(guide.summary.toLowerCase()).toContain("don't rinse");
    });

    it('guide has the key takeaway', () => {
      const guide = getPreRinseGuide();
      expect(guide.keyTakeaway).toBeDefined();
      expect(guide.keyTakeaway.length).toBeGreaterThan(20);
    });
  });
});
