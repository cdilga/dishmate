import { describe, it, expect } from 'vitest';
import {
  getTroubleshootFlow,
  getInitialQuestion,
  processAnswer,
  getSolution,
  TROUBLESHOOT_CATEGORIES,
} from './troubleshooter';
import type { TroubleshootCategory } from './types';

describe('Troubleshooter', () => {
  describe('TROUBLESHOOT_CATEGORIES', () => {
    it('has all required categories', () => {
      const expectedCategories: TroubleshootCategory[] = [
        'white_residue',
        'cloudy_glasses',
        'food_stuck',
        'greasy_feeling',
        'spots',
        'bad_smell',
        'not_drying',
        'other',
      ];
      expect(Object.keys(TROUBLESHOOT_CATEGORIES)).toEqual(expect.arrayContaining(expectedCategories));
    });

    it('each category has a label and description', () => {
      for (const [key, value] of Object.entries(TROUBLESHOOT_CATEGORIES)) {
        expect(value).toHaveProperty('label');
        expect(value).toHaveProperty('description');
        expect(typeof value.label).toBe('string');
        expect(typeof value.description).toBe('string');
      }
    });
  });

  describe('getInitialQuestion', () => {
    it('returns the initial question for the troubleshooter', () => {
      const question = getInitialQuestion();
      expect(question.id).toBe('start');
      expect(question.question).toContain('problem');
      expect(question.options).toBeDefined();
      expect(question.options?.length).toBeGreaterThan(0);
    });
  });

  describe('getTroubleshootFlow', () => {
    it('returns flow for white_residue category', () => {
      const flow = getTroubleshootFlow('white_residue');
      expect(flow).toBeDefined();
      expect(flow.id).toBe('white_residue_start');
      expect(flow.question).toContain('residue');
    });

    it('returns flow for food_stuck category', () => {
      const flow = getTroubleshootFlow('food_stuck');
      expect(flow).toBeDefined();
      expect(flow.id).toBe('food_stuck_start');
      expect(flow.question).toContain('food');
    });

    it('returns flow for bad_smell category', () => {
      const flow = getTroubleshootFlow('bad_smell');
      expect(flow).toBeDefined();
      expect(flow.id).toBe('bad_smell_start');
      expect(flow.question).toContain('filter');
    });
  });

  describe('processAnswer', () => {
    it('navigates to next step based on answer', () => {
      const flow = getTroubleshootFlow('white_residue');
      const nextStep = processAnswer(flow.id, 'powdery');
      expect(nextStep).toBeDefined();
      expect(nextStep.id).toContain('water');
    });

    it('returns solution for terminal answers', () => {
      // Navigate through the flow to get to a solution
      const step1 = processAnswer('white_residue_start', 'powdery');
      const step2 = processAnswer(step1.id, 'yes_hard');
      expect(step2.solution).toBeDefined();
      expect(step2.solution?.title).toContain('Hard Water');
    });
  });

  describe('getSolution', () => {
    it('returns solution for hard water deposits', () => {
      const solution = getSolution('hard_water_confirmed');
      expect(solution).toBeDefined();
      expect(solution?.title).toContain('Hard Water');
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns solution for dirty filter', () => {
      const solution = getSolution('dirty_filter');
      expect(solution).toBeDefined();
      expect(solution?.title).toContain('Filter');
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns solution for pod not dissolving', () => {
      const solution = getSolution('pod_not_dissolving');
      expect(solution).toBeDefined();
      expect(solution?.title).toContain('Pod');
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns solution for greasy dishes (no pre-wash)', () => {
      const solution = getSolution('no_prewash_detergent');
      expect(solution).toBeDefined();
      expect(solution?.title).toContain('Pre-Wash');
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns solution for water access issue', () => {
      const solution = getSolution('water_access_issue');
      expect(solution).toBeDefined();
      expect(solution?.title).toContain('Water');
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns solution for protein needs enzyme time', () => {
      const solution = getSolution('needs_enzyme_time');
      expect(solution).toBeDefined();
      expect(solution?.title?.toLowerCase()).toMatch(/enzyme|protein/);
      expect(solution?.steps.length).toBeGreaterThan(0);
    });

    it('returns undefined for unknown solution ID', () => {
      const solution = getSolution('unknown_solution_id');
      expect(solution).toBeUndefined();
    });
  });

  describe('full troubleshooting flows', () => {
    it('white residue -> powdery -> hard water flow', () => {
      const initial = getInitialQuestion();
      expect(initial.options?.some(o => o.value === 'white_residue')).toBe(true);

      const step1 = getTroubleshootFlow('white_residue');
      expect(step1.question).toBeDefined();

      const step2 = processAnswer(step1.id, 'powdery');
      expect(step2.question).toContain('hard water');

      const step3 = processAnswer(step2.id, 'yes_hard');
      expect(step3.solution).toBeDefined();
      expect(step3.solution?.title).toContain('Hard Water');
    });

    it('food stuck -> concave -> water access flow', () => {
      const step1 = getTroubleshootFlow('food_stuck');
      expect(step1.question).toBeDefined();

      const step2 = processAnswer(step1.id, 'concave');
      expect(step2.solution).toBeDefined();
      expect(step2.solution?.title).toContain('Water');
    });

    it('food stuck -> flat -> greasy -> no prewash flow', () => {
      const step1 = getTroubleshootFlow('food_stuck');
      const step2 = processAnswer(step1.id, 'flat');
      expect(step2.question).toContain('food');

      const step3 = processAnswer(step2.id, 'greasy');
      expect(step3.solution).toBeDefined();
      expect(step3.solution?.title).toContain('Pre-Wash');
    });

    it('bad smell -> never cleaned filter flow', () => {
      const step1 = getTroubleshootFlow('bad_smell');
      const step2 = processAnswer(step1.id, 'never');
      expect(step2.solution).toBeDefined();
      expect(step2.solution?.title).toContain('Filter');
    });
  });
});
