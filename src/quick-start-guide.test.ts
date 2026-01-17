import { describe, it, expect } from 'vitest';
import {
  getQuickStartGuide,
  getOnboardingSteps,
  getQuickWin,
  getTopMistakes,
  getImmediateActionPlan,
  getDishwasherBasics,
} from './quick-start-guide';

describe('Quick Start Guide', () => {
  describe('getQuickStartGuide', () => {
    it('returns a complete quick start guide', () => {
      const guide = getQuickStartGuide();
      expect(guide.title).toBeDefined();
      expect(guide.subtitle).toBeDefined();
      expect(guide.sections.length).toBeGreaterThan(0);
    });

    it('is structured for 60-second reading', () => {
      const guide = getQuickStartGuide();
      // Each section should have a short, punchy title
      guide.sections.forEach(section => {
        expect(section.title.length).toBeLessThan(50);
      });
    });

    it('includes the core value propositions', () => {
      const guide = getQuickStartGuide();
      const allContent = guide.sections.map(s => s.content.join(' ')).join(' ').toLowerCase();

      // Should mention pre-wash/pods issue
      expect(allContent).toMatch(/pre-?wash|pod/);
      // Should mention not pre-rinsing
      expect(allContent).toMatch(/rinse|scrape/);
    });

    it('provides actionable advice', () => {
      const guide = getQuickStartGuide();
      const hasActionableAdvice = guide.sections.some(s =>
        s.content.some(c =>
          c.toLowerCase().includes('put') ||
          c.toLowerCase().includes('add') ||
          c.toLowerCase().includes('use')
        )
      );
      expect(hasActionableAdvice).toBe(true);
    });
  });

  describe('getOnboardingSteps', () => {
    it('returns numbered steps for new users', () => {
      const steps = getOnboardingSteps();
      expect(steps.length).toBeGreaterThan(0);
      expect(steps.length).toBeLessThanOrEqual(5); // Keep it simple
    });

    it('each step has required fields', () => {
      const steps = getOnboardingSteps();
      steps.forEach((step, index) => {
        expect(step.stepNumber).toBe(index + 1);
        expect(step.title).toBeDefined();
        expect(step.action).toBeDefined();
        expect(step.whyItMatters).toBeDefined();
      });
    });

    it('first step is about switching detergent format', () => {
      const steps = getOnboardingSteps();
      const firstStep = steps[0];
      expect(firstStep.action.toLowerCase()).toMatch(/powder|detergent/);
    });

    it('includes the pre-wash technique', () => {
      const steps = getOnboardingSteps();
      const hasPrewashStep = steps.some(s =>
        s.action.toLowerCase().includes('door') ||
        s.action.toLowerCase().includes('pre-wash') ||
        s.title.toLowerCase().includes('pre-wash')
      );
      expect(hasPrewashStep).toBe(true);
    });
  });

  describe('getQuickWin', () => {
    it('returns the single most impactful change', () => {
      const quickWin = getQuickWin();
      expect(quickWin.title).toBeDefined();
      expect(quickWin.description).toBeDefined();
      expect(quickWin.howTo).toBeDefined();
      expect(quickWin.expectedResult).toBeDefined();
    });

    it('focuses on the pre-wash detergent technique', () => {
      const quickWin = getQuickWin();
      const content = `${quickWin.title} ${quickWin.description} ${quickWin.howTo}`.toLowerCase();
      expect(content).toMatch(/powder|pre-?wash|door/);
    });

    it('sets realistic expectations', () => {
      const quickWin = getQuickWin();
      expect(quickWin.expectedResult).toBeDefined();
      expect(quickWin.expectedResult.length).toBeGreaterThan(10);
    });
  });

  describe('getTopMistakes', () => {
    it('returns the top mistakes people make', () => {
      const mistakes = getTopMistakes();
      expect(mistakes.length).toBeGreaterThanOrEqual(3);
      expect(mistakes.length).toBeLessThanOrEqual(5);
    });

    it('each mistake has a correction', () => {
      const mistakes = getTopMistakes();
      mistakes.forEach(mistake => {
        expect(mistake.mistake).toBeDefined();
        expect(mistake.whyItsWrong).toBeDefined();
        expect(mistake.whatToDoInstead).toBeDefined();
      });
    });

    it('includes pre-rinsing as a mistake', () => {
      const mistakes = getTopMistakes();
      const hasPreRinseMistake = mistakes.some(m =>
        m.mistake.toLowerCase().includes('rins') ||
        m.mistake.toLowerCase().includes('pre-wash')
      );
      expect(hasPreRinseMistake).toBe(true);
    });

    it('includes using pods as a potential issue', () => {
      const mistakes = getTopMistakes();
      const hasPodMistake = mistakes.some(m =>
        m.mistake.toLowerCase().includes('pod') ||
        m.whyItsWrong.toLowerCase().includes('pod')
      );
      expect(hasPodMistake).toBe(true);
    });
  });

  describe('getImmediateActionPlan', () => {
    it('returns actions for tonight', () => {
      const plan = getImmediateActionPlan();
      expect(plan.tonight).toBeDefined();
      expect(plan.tonight.length).toBeGreaterThan(0);
    });

    it('returns actions for this week', () => {
      const plan = getImmediateActionPlan();
      expect(plan.thisWeek).toBeDefined();
      expect(plan.thisWeek.length).toBeGreaterThan(0);
    });

    it('returns ongoing habits', () => {
      const plan = getImmediateActionPlan();
      expect(plan.ongoing).toBeDefined();
      expect(plan.ongoing.length).toBeGreaterThan(0);
    });

    it('prioritizes the pre-wash technique tonight', () => {
      const plan = getImmediateActionPlan();
      const tonightActions = plan.tonight.join(' ').toLowerCase();
      expect(tonightActions).toMatch(/powder|tablespoon|door|pre-?wash/);
    });
  });

  describe('getDishwasherBasics', () => {
    it('explains how a dishwasher works', () => {
      const basics = getDishwasherBasics();
      expect(basics.howItWorks).toBeDefined();
      expect(basics.howItWorks.length).toBeGreaterThan(0);
    });

    it('explains the wash phases', () => {
      const basics = getDishwasherBasics();
      expect(basics.phases).toBeDefined();
      expect(basics.phases.length).toBeGreaterThanOrEqual(3);
    });

    it('each phase has a name and description', () => {
      const basics = getDishwasherBasics();
      basics.phases.forEach(phase => {
        expect(phase.name).toBeDefined();
        expect(phase.description).toBeDefined();
        expect(phase.duration).toBeDefined();
      });
    });

    it('highlights the pre-wash phase importance', () => {
      const basics = getDishwasherBasics();
      const prewashPhase = basics.phases.find(p =>
        p.name.toLowerCase().includes('pre') ||
        p.name.toLowerCase().includes('first')
      );
      expect(prewashPhase).toBeDefined();
      expect(prewashPhase?.keyInsight).toBeDefined();
    });

    it('explains role of detergent and rinse aid', () => {
      const basics = getDishwasherBasics();
      expect(basics.detergentRole).toBeDefined();
      expect(basics.rinseAidRole).toBeDefined();
    });
  });
});
