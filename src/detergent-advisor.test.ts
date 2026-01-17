import { describe, it, expect } from 'vitest';
import {
  getDetergentRecommendation,
  getDetergentFormatInfo,
  getAllDetergentFormats,
  compareFormats,
  getWhyPowderBeatsPods,
  type DetergentInput,
  type DetergentFormat,
} from './detergent-advisor';

describe('Detergent Advisor', () => {
  describe('getDetergentRecommendation', () => {
    describe('greasy issues', () => {
      it('recommends powder when user has greasy dish issues', () => {
        const input: DetergentInput = {
          currentFormat: 'pods',
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday', 'greasy'],
          hasGreasyIssues: true,
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.reasoning.toLowerCase()).toContain('pre-wash');
      });

      it('warns pod users about pre-wash limitation', () => {
        const input: DetergentInput = {
          currentFormat: 'pods',
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['greasy'],
          hasGreasyIssues: true,
        };
        const result = getDetergentRecommendation(input);
        expect(result.warnings).toBeDefined();
        expect(result.warnings?.some(w => w.toLowerCase().includes('pre-wash'))).toBe(true);
      });
    });

    describe('residue issues', () => {
      it('recommends powder for hard water residue', () => {
        const input: DetergentInput = {
          currentFormat: 'pods',
          waterHardness: 'hard',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday'],
          hasResidueIssues: true,
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.reasoning.toLowerCase()).toContain('hard water');
      });

      it('recommends powder for pod residue in soft water', () => {
        const input: DetergentInput = {
          currentFormat: 'pods',
          waterHardness: 'soft',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday'],
          hasResidueIssues: true,
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.reasoning.toLowerCase()).toContain('dissolv');
      });
    });

    describe('convenience seekers', () => {
      it('allows pods for convenience with light soil and good water', () => {
        const input: DetergentInput = {
          waterHardness: 'soft',
          usagePattern: 'regular',
          mainConcern: 'convenience',
          typicalSoilTypes: ['light', 'everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('pods');
        expect(result.alternativeFormat).toBe('powder');
      });

      it('recommends powder for convenience with heavy soil', () => {
        const input: DetergentInput = {
          waterHardness: 'soft',
          usagePattern: 'regular',
          mainConcern: 'convenience',
          typicalSoilTypes: ['heavy', 'greasy'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
      });

      it('recommends powder for convenience with hard water', () => {
        const input: DetergentInput = {
          waterHardness: 'hard',
          usagePattern: 'regular',
          mainConcern: 'convenience',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
      });
    });

    describe('cost-conscious users', () => {
      it('recommends powder for cost savings', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'daily',
          mainConcern: 'cost',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.reasoning.toLowerCase()).toContain('cost');
        expect(result.costComparison).toBeDefined();
      });
    });

    describe('eco-conscious users', () => {
      it('recommends powder for eco concerns', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: 'eco',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.reasoning.toLowerCase()).toContain('environmental');
      });
    });

    describe('hard water users', () => {
      it('recommends powder for hard water', () => {
        const input: DetergentInput = {
          waterHardness: 'hard',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.recommendedFormat).toBe('powder');
        expect(result.warnings?.some(w => w.includes('50%'))).toBe(true);
      });
    });

    describe('usage instructions', () => {
      it('provides powder usage instructions', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.usageInstructions.length).toBeGreaterThan(0);
        expect(result.usageInstructions.some(i => i.includes('PRE-WASH'))).toBe(true);
        expect(result.usageInstructions.some(i => i.includes('MAIN WASH'))).toBe(true);
      });

      it('includes hard water instructions when applicable', () => {
        const input: DetergentInput = {
          waterHardness: 'hard',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.usageInstructions.some(i => i.includes('HARD WATER'))).toBe(true);
      });

      it('includes heavy soil instructions when applicable', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'regular',
          mainConcern: 'clean_dishes',
          typicalSoilTypes: ['heavy', 'greasy'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.usageInstructions.some(i => i.includes('HEAVY SOIL'))).toBe(true);
      });
    });

    describe('cost comparison', () => {
      it('calculates yearly cost for daily users', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'daily',
          mainConcern: 'cost',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.costComparison).toBeDefined();
        expect(result.costComparison).toContain('364'); // 7 * 52 loads
      });

      it('calculates yearly cost for occasional users', () => {
        const input: DetergentInput = {
          waterHardness: 'moderate',
          usagePattern: 'occasional',
          mainConcern: 'cost',
          typicalSoilTypes: ['everyday'],
        };
        const result = getDetergentRecommendation(input);
        expect(result.costComparison).toBeDefined();
        expect(result.costComparison).toContain('104'); // 2 * 52 loads
      });
    });
  });

  describe('getDetergentFormatInfo', () => {
    it('returns info for powder format', () => {
      const info = getDetergentFormatInfo('powder');
      expect(info.format).toBe('powder');
      expect(info.prewashCapable).toBe(true);
      expect(info.enzymeContent).toBe('high');
      expect(info.pros.length).toBeGreaterThan(0);
      expect(info.cons.length).toBeGreaterThan(0);
    });

    it('returns info for pods format', () => {
      const info = getDetergentFormatInfo('pods');
      expect(info.format).toBe('pods');
      expect(info.prewashCapable).toBe(false);
      expect(info.pros.some(p => p.toLowerCase().includes('convenient'))).toBe(true);
      expect(info.cons.some(c => c.toLowerCase().includes('pre-wash'))).toBe(true);
    });

    it('returns info for liquid format', () => {
      const info = getDetergentFormatInfo('liquid');
      expect(info.format).toBe('liquid');
      expect(info.enzymeContent).toBe('low');
    });

    it('returns info for tablets format', () => {
      const info = getDetergentFormatInfo('tablets');
      expect(info.format).toBe('tablets');
      expect(info.prewashCapable).toBe(false);
    });
  });

  describe('getAllDetergentFormats', () => {
    it('returns all four formats', () => {
      const formats = getAllDetergentFormats();
      expect(formats.length).toBe(4);
      const formatNames = formats.map(f => f.format);
      expect(formatNames).toContain('powder');
      expect(formatNames).toContain('pods');
      expect(formatNames).toContain('liquid');
      expect(formatNames).toContain('tablets');
    });

    it('each format has required properties', () => {
      const formats = getAllDetergentFormats();
      for (const format of formats) {
        expect(format.pros.length).toBeGreaterThan(0);
        expect(format.cons.length).toBeGreaterThan(0);
        expect(format.bestFor.length).toBeGreaterThan(0);
        expect(format.costPerWash).toMatch(/\$[\d.]+/);
        expect(typeof format.prewashCapable).toBe('boolean');
        expect(['high', 'medium', 'low', 'variable']).toContain(format.enzymeContent);
      }
    });
  });

  describe('compareFormats', () => {
    it('powder beats pods', () => {
      const comparison = compareFormats('powder', 'pods');
      expect(comparison.winner).toBe('powder');
      expect(comparison.whyWinner.toLowerCase()).toContain('pre-wash');
    });

    it('powder beats liquid', () => {
      const comparison = compareFormats('powder', 'liquid');
      expect(comparison.winner).toBe('powder');
      expect(comparison.whyWinner.toLowerCase()).toContain('enzyme');
    });

    it('powder beats tablets', () => {
      const comparison = compareFormats('tablets', 'powder');
      expect(comparison.winner).toBe('powder');
    });

    it('pods beat liquid', () => {
      const comparison = compareFormats('pods', 'liquid');
      expect(comparison.winner).toBe('pods');
      expect(comparison.whyWinner.toLowerCase()).toContain('enzyme');
    });

    it('returns both format info objects', () => {
      const comparison = compareFormats('powder', 'pods');
      expect(comparison.format1.format).toBe('powder');
      expect(comparison.format2.format).toBe('pods');
    });
  });

  describe('getWhyPowderBeatsPods', () => {
    it('returns educational content', () => {
      const content = getWhyPowderBeatsPods();
      expect(content.headline).toBeDefined();
      expect(content.summary).toBeDefined();
      expect(content.keyPoints.length).toBeGreaterThan(0);
      expect(content.conclusion).toBeDefined();
    });

    it('explains the pre-wash problem', () => {
      const content = getWhyPowderBeatsPods();
      const hasPrewashExplanation = content.keyPoints.some(
        p => p.title.toLowerCase().includes('pre-wash')
      );
      expect(hasPrewashExplanation).toBe(true);
    });

    it('explains adjustable dosing', () => {
      const content = getWhyPowderBeatsPods();
      const hasDosing = content.keyPoints.some(
        p => p.title.toLowerCase().includes('dosing') || p.explanation.toLowerCase().includes('adjust')
      );
      expect(hasDosing).toBe(true);
    });

    it('mentions cost savings', () => {
      const content = getWhyPowderBeatsPods();
      const hasCost = content.keyPoints.some(
        p => p.title.toLowerCase().includes('cost') || p.explanation.toLowerCase().includes('$')
      );
      expect(hasCost).toBe(true);
    });

    it('has compelling conclusion', () => {
      const content = getWhyPowderBeatsPods();
      expect(content.conclusion.length).toBeGreaterThan(50);
    });
  });
});
