import { describe, it, expect } from 'vitest';
import {
  generateMaintenanceSchedule,
  getMaintenanceTask,
  getAllMaintenanceTasks,
  getTasksByImportance,
  getCriticalTasks,
  quickMaintenanceCheck,
  type MaintenanceInput,
  type MaintenanceTask,
} from './maintenance-guide';

describe('Maintenance Guide', () => {
  describe('generateMaintenanceSchedule', () => {
    it('generates a schedule for moderate usage', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.usageLevel).toBe('moderate');
      expect(schedule.tasks.length).toBeGreaterThan(0);
      expect(schedule.nextActions.length).toBeGreaterThan(0);
    });

    it('classifies light usage correctly', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 2,
      };
      const schedule = generateMaintenanceSchedule(input);
      expect(schedule.usageLevel).toBe('light');
    });

    it('classifies heavy usage correctly', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 10,
      };
      const schedule = generateMaintenanceSchedule(input);
      expect(schedule.usageLevel).toBe('heavy');
    });

    it('adjusts frequency for heavy usage', () => {
      const lightInput: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 2,
      };
      const heavyInput: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 10,
      };

      const lightSchedule = generateMaintenanceSchedule(lightInput);
      const heavySchedule = generateMaintenanceSchedule(heavyInput);

      // Filter should be more frequent for heavy users
      const lightFilter = lightSchedule.tasks.find(t => t.task.id === 'clean_filter');
      const heavyFilter = heavySchedule.tasks.find(t => t.task.id === 'clean_filter');

      // Heavy users should have reason for increased frequency
      expect(heavyFilter?.reason).toBeDefined();
    });

    it('adjusts frequency for hard water', () => {
      const input: MaintenanceInput = {
        waterHardness: 'hard',
        loadsPerWeek: 5,
      };
      const schedule = generateMaintenanceSchedule(input);

      // Check salt should be adjusted for hard water
      const saltTask = schedule.tasks.find(t => t.task.id === 'check_salt');
      expect(saltTask?.reason).toContain('hard water');
    });

    it('adds smell-related recommendations when hasSmellIssues', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
        hasSmellIssues: true,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.nextActions.some(a => a.toLowerCase().includes('filter'))).toBe(true);
      expect(schedule.nextActions.some(a => a.toLowerCase().includes('smell') || a.toLowerCase().includes('cleaning cycle'))).toBe(true);
    });

    it('adds residue-related recommendations when hasResidueIssues', () => {
      const input: MaintenanceInput = {
        waterHardness: 'hard',
        loadsPerWeek: 5,
        hasResidueIssues: true,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.nextActions.some(a => a.toLowerCase().includes('cleaning cycle'))).toBe(true);
      expect(schedule.nextActions.some(a => a.toLowerCase().includes('salt'))).toBe(true);
    });

    it('warns about old filter cleaning', () => {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
        lastFilterClean: sixtyDaysAgo,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.nextActions.some(a => a.toLowerCase().includes('filter'))).toBe(true);
    });

    it('warns about old deep cleaning', () => {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
        lastDeepClean: ninetyDaysAgo,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.nextActions.some(a => a.toLowerCase().includes('cleaning cycle'))).toBe(true);
    });

    it('suggests filter cleaning if never done', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
      };
      const schedule = generateMaintenanceSchedule(input);

      expect(schedule.nextActions.some(a => a.toLowerCase().includes('filter'))).toBe(true);
    });

    it('sorts tasks by importance', () => {
      const input: MaintenanceInput = {
        waterHardness: 'moderate',
        loadsPerWeek: 5,
      };
      const schedule = generateMaintenanceSchedule(input);

      // Critical tasks should come before low importance tasks
      const criticalIndex = schedule.tasks.findIndex(t => t.task.importanceLevel === 'critical');
      const lowIndex = schedule.tasks.findIndex(t => t.task.importanceLevel === 'low');

      expect(criticalIndex).toBeLessThan(lowIndex);
    });
  });

  describe('getMaintenanceTask', () => {
    it('returns clean_filter task', () => {
      const task = getMaintenanceTask('clean_filter');
      expect(task.id).toBe('clean_filter');
      expect(task.name).toContain('Filter');
      expect(task.steps.length).toBeGreaterThan(0);
      expect(task.importanceLevel).toBe('critical');
    });

    it('returns clean_spray_arms task', () => {
      const task = getMaintenanceTask('clean_spray_arms');
      expect(task.id).toBe('clean_spray_arms');
      expect(task.steps.length).toBeGreaterThan(0);
      expect(task.tools.length).toBeGreaterThan(0);
    });

    it('returns run_cleaning_cycle task', () => {
      const task = getMaintenanceTask('run_cleaning_cycle');
      expect(task.id).toBe('run_cleaning_cycle');
      expect(task.steps.some(s => s.toLowerCase().includes('vinegar'))).toBe(true);
    });

    it('each task has required properties', () => {
      const taskIds: MaintenanceTask[] = [
        'clean_filter',
        'clean_spray_arms',
        'clean_door_seal',
        'run_cleaning_cycle',
        'check_rinse_aid',
        'check_salt',
        'wipe_exterior',
        'check_drain',
      ];

      for (const taskId of taskIds) {
        const task = getMaintenanceTask(taskId);
        expect(task.id).toBe(taskId);
        expect(task.name).toBeTruthy();
        expect(task.description).toBeTruthy();
        expect(task.frequency).toBeTruthy();
        expect(task.importanceLevel).toBeTruthy();
        expect(task.timeMinutes).toBeGreaterThan(0);
        expect(task.steps.length).toBeGreaterThan(0);
        expect(task.tips.length).toBeGreaterThan(0);
        expect(task.signsNeeded.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getAllMaintenanceTasks', () => {
    it('returns all 8 maintenance tasks', () => {
      const tasks = getAllMaintenanceTasks();
      expect(tasks.length).toBe(8);
    });

    it('includes filter cleaning task', () => {
      const tasks = getAllMaintenanceTasks();
      expect(tasks.some(t => t.id === 'clean_filter')).toBe(true);
    });

    it('includes spray arm cleaning task', () => {
      const tasks = getAllMaintenanceTasks();
      expect(tasks.some(t => t.id === 'clean_spray_arms')).toBe(true);
    });

    it('includes cleaning cycle task', () => {
      const tasks = getAllMaintenanceTasks();
      expect(tasks.some(t => t.id === 'run_cleaning_cycle')).toBe(true);
    });
  });

  describe('getTasksByImportance', () => {
    it('returns critical tasks', () => {
      const tasks = getTasksByImportance('critical');
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every(t => t.importanceLevel === 'critical')).toBe(true);
    });

    it('returns high importance tasks', () => {
      const tasks = getTasksByImportance('high');
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every(t => t.importanceLevel === 'high')).toBe(true);
    });

    it('returns medium importance tasks', () => {
      const tasks = getTasksByImportance('medium');
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every(t => t.importanceLevel === 'medium')).toBe(true);
    });

    it('returns low importance tasks', () => {
      const tasks = getTasksByImportance('low');
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every(t => t.importanceLevel === 'low')).toBe(true);
    });
  });

  describe('getCriticalTasks', () => {
    it('returns critical tasks only', () => {
      const tasks = getCriticalTasks();
      expect(tasks.every(t => t.importanceLevel === 'critical')).toBe(true);
    });

    it('includes filter cleaning as critical', () => {
      const tasks = getCriticalTasks();
      expect(tasks.some(t => t.id === 'clean_filter')).toBe(true);
    });
  });

  describe('quickMaintenanceCheck', () => {
    it('returns good status when everything is fine', () => {
      const check = quickMaintenanceCheck({
        filterCleanedWithin30Days: true,
        deepCleanWithin60Days: true,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });

      expect(check.status).toBe('good');
      expect(check.score).toBe(100);
      expect(check.issues.length).toBe(0);
    });

    it('returns needs_attention when filter not cleaned', () => {
      const check = quickMaintenanceCheck({
        filterCleanedWithin30Days: false,
        deepCleanWithin60Days: true,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });

      expect(check.status).toBe('needs_attention');
      expect(check.score).toBeLessThan(100);
      expect(check.issues.some(i => i.toLowerCase().includes('filter'))).toBe(true);
    });

    it('returns urgent when multiple issues', () => {
      const check = quickMaintenanceCheck({
        filterCleanedWithin30Days: false,
        deepCleanWithin60Days: false,
        rinseAidFull: false,
        noSmellIssues: false,
        noResidueIssues: false,
        noDirtyDishIssues: false,
      });

      expect(check.status).toBe('urgent');
      expect(check.score).toBeLessThan(50);
      expect(check.issues.length).toBeGreaterThan(3);
    });

    it('provides specific recommendations for each issue', () => {
      const check = quickMaintenanceCheck({
        filterCleanedWithin30Days: false,
        deepCleanWithin60Days: false,
        rinseAidFull: false,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });

      expect(check.recommendations.some(r => r.toLowerCase().includes('filter'))).toBe(true);
      expect(check.recommendations.some(r => r.toLowerCase().includes('vinegar'))).toBe(true);
      expect(check.recommendations.some(r => r.toLowerCase().includes('rinse aid'))).toBe(true);
    });

    it('provides positive message when all good', () => {
      const check = quickMaintenanceCheck({
        filterCleanedWithin30Days: true,
        deepCleanWithin60Days: true,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });

      expect(check.recommendations.some(r => r.toLowerCase().includes('up to date'))).toBe(true);
    });

    it('deducts correct score amounts', () => {
      // Filter = -30
      const filterCheck = quickMaintenanceCheck({
        filterCleanedWithin30Days: false,
        deepCleanWithin60Days: true,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });
      expect(filterCheck.score).toBe(70);

      // Deep clean = -20
      const deepCheck = quickMaintenanceCheck({
        filterCleanedWithin30Days: true,
        deepCleanWithin60Days: false,
        rinseAidFull: true,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });
      expect(deepCheck.score).toBe(80);

      // Rinse aid = -10
      const rinseCheck = quickMaintenanceCheck({
        filterCleanedWithin30Days: true,
        deepCleanWithin60Days: true,
        rinseAidFull: false,
        noSmellIssues: true,
        noResidueIssues: true,
        noDirtyDishIssues: true,
      });
      expect(rinseCheck.score).toBe(90);
    });
  });
});
