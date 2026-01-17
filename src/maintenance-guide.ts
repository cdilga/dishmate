import type { WaterHardness } from './types';

// ============================================
// MAINTENANCE GUIDE TYPES
// ============================================

export type MaintenanceTask =
  | 'clean_filter'
  | 'clean_spray_arms'
  | 'clean_door_seal'
  | 'run_cleaning_cycle'
  | 'check_rinse_aid'
  | 'check_salt'
  | 'wipe_exterior'
  | 'check_drain';

export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'as_needed';

export interface MaintenanceTaskInfo {
  id: MaintenanceTask;
  name: string;
  description: string;
  frequency: Frequency;
  importanceLevel: 'critical' | 'high' | 'medium' | 'low';
  timeMinutes: number;
  steps: string[];
  tools: string[];
  tips: string[];
  signsNeeded: string[];
}

export interface MaintenanceSchedule {
  waterHardness: WaterHardness;
  usageLevel: 'light' | 'moderate' | 'heavy';
  tasks: Array<{
    task: MaintenanceTaskInfo;
    adjustedFrequency: Frequency;
    reason?: string;
  }>;
  nextActions: string[];
}

export interface MaintenanceInput {
  waterHardness: WaterHardness;
  loadsPerWeek: number;
  lastFilterClean?: Date;
  lastDeepClean?: Date;
  hasSmellIssues?: boolean;
  hasResidueIssues?: boolean;
}

// ============================================
// MAINTENANCE TASK DEFINITIONS
// ============================================

const MAINTENANCE_TASKS: Record<MaintenanceTask, MaintenanceTaskInfo> = {
  clean_filter: {
    id: 'clean_filter',
    name: 'Clean the Filter',
    description: 'Remove and clean the filter to prevent food buildup and bad smells.',
    frequency: 'monthly',
    importanceLevel: 'critical',
    timeMinutes: 5,
    steps: [
      'Remove the bottom rack to access the filter.',
      'Locate the filter at the bottom of the tub (usually centre).',
      'Twist the filter counter-clockwise and lift out.',
      'Rinse under hot running water.',
      'Use a soft brush (old toothbrush) to scrub the mesh.',
      'Check underneath for any trapped debris.',
      'Replace the filter and twist to lock in place.',
    ],
    tools: ['Soft brush or old toothbrush'],
    tips: [
      'A dirty filter is the #1 cause of dishwasher smell and poor cleaning.',
      'If you don\'t scrape plates, clean the filter more often.',
      'The filter has multiple parts - make sure you clean all of them.',
    ],
    signsNeeded: [
      'Bad smell from dishwasher',
      'Food particles on clean dishes',
      'Dishes not coming out clean',
      'Visible debris in filter',
    ],
  },

  clean_spray_arms: {
    id: 'clean_spray_arms',
    name: 'Clean the Spray Arms',
    description: 'Clear blocked spray arm holes to ensure proper water distribution.',
    frequency: 'quarterly',
    importanceLevel: 'high',
    timeMinutes: 10,
    steps: [
      'Remove the bottom and top racks.',
      'Locate the spray arms (bottom and possibly middle/top).',
      'Remove spray arms by twisting or unclipping (check manual).',
      'Hold under running water and look through the holes.',
      'Use a toothpick to clear any blocked holes.',
      'Soak in white vinegar for 15 mins if heavily clogged.',
      'Rinse thoroughly and reattach.',
    ],
    tools: ['Toothpick', 'White vinegar (optional)'],
    tips: [
      'Blocked spray arm holes cause random dirty spots on dishes.',
      'Seeds, bits of label, and mineral buildup are common culprits.',
      'Spin the arms by hand after reattaching to check they move freely.',
    ],
    signsNeeded: [
      'Random items not getting clean',
      'Uneven cleaning (some dishes clean, others dirty)',
      'Visible blockage in spray holes',
    ],
  },

  clean_door_seal: {
    id: 'clean_door_seal',
    name: 'Clean the Door Seal',
    description: 'Wipe the rubber gasket around the door to prevent mould and odours.',
    frequency: 'monthly',
    importanceLevel: 'medium',
    timeMinutes: 5,
    steps: [
      'Open the door fully.',
      'Inspect the rubber seal/gasket around the door edge.',
      'Make a solution of equal parts white vinegar and water.',
      'Dip a cloth in the solution and wipe the entire seal.',
      'Pull back the folds of the gasket to clean inside.',
      'Pay attention to the bottom where water collects.',
      'Dry with a clean cloth.',
    ],
    tools: ['White vinegar', 'Clean cloths (2)'],
    tips: [
      'Mould loves to hide in the folds of the door seal.',
      'The bottom of the seal is often the dirtiest area.',
      'Do this more often if you keep the door closed between uses.',
    ],
    signsNeeded: [
      'Musty smell when opening door',
      'Visible mould or black spots on seal',
      'Debris trapped in seal folds',
    ],
  },

  run_cleaning_cycle: {
    id: 'run_cleaning_cycle',
    name: 'Run a Cleaning Cycle',
    description: 'Run an empty hot cycle to dissolve buildup and sanitise the interior.',
    frequency: 'monthly',
    importanceLevel: 'high',
    timeMinutes: 90, // Hands-off time
    steps: [
      'Remove all dishes and racks (racks can stay if convenient).',
      'Place 2 cups of white vinegar in a bowl on the top rack.',
      'Run the hottest cycle available.',
      'After the cycle: sprinkle 1 cup of bicarb soda on the bottom.',
      'Run a short hot cycle to freshen.',
      'Wipe any residue from the door and edges.',
    ],
    tools: ['White vinegar (2 cups)', 'Bicarb soda (1 cup)'],
    tips: [
      'Vinegar dissolves mineral deposits and grease.',
      'Bicarb neutralises odours and provides gentle abrasion.',
      'Commercial dishwasher cleaners work too but cost more.',
      'Do this more often in hard water areas.',
    ],
    signsNeeded: [
      'Persistent bad smell',
      'Visible scale buildup',
      'Dishes coming out with residue',
      'Monthly maintenance regardless',
    ],
  },

  check_rinse_aid: {
    id: 'check_rinse_aid',
    name: 'Check Rinse Aid Level',
    description: 'Ensure rinse aid dispenser is full for spot-free drying.',
    frequency: 'monthly',
    importanceLevel: 'medium',
    timeMinutes: 2,
    steps: [
      'Open the dishwasher door.',
      'Locate the rinse aid dispenser (usually next to detergent dispenser).',
      'Open the cap/lid.',
      'Check the level (many have an indicator window).',
      'Fill with rinse aid if low.',
      'Adjust the dosing dial if needed (usually 1-5 or 1-6).',
      'Close the cap securely.',
    ],
    tools: ['Rinse aid refill'],
    tips: [
      'Rinse aid helps water sheet off dishes instead of beading.',
      'Without it, you\'ll get water spots, especially on glasses.',
      'In hard water areas, set the dial to maximum.',
      'Rinse aid typically lasts 1-2 months.',
    ],
    signsNeeded: [
      'Water spots on glasses',
      'Dishes not drying well',
      'Empty indicator light',
    ],
  },

  check_salt: {
    id: 'check_salt',
    name: 'Check Dishwasher Salt',
    description: 'Refill the salt compartment to soften water and improve cleaning.',
    frequency: 'monthly',
    importanceLevel: 'high',
    timeMinutes: 3,
    steps: [
      'Check if your dishwasher has a salt compartment (usually bottom left of tub).',
      'Unscrew the salt compartment cap.',
      'Check the salt level (may have indicator light).',
      'If low, use the funnel provided to add dishwasher salt.',
      'Fill until salt is visible at the top.',
      'Wipe any spilled salt from the tub.',
      'Replace the cap securely.',
    ],
    tools: ['Dishwasher salt (not table salt!)'],
    tips: [
      'Only needed if you have a salt compartment and moderate/hard water.',
      'Use only dishwasher salt - table salt can damage the machine.',
      'Salt softens water, preventing limescale and improving cleaning.',
      'In soft water areas, you may not need salt at all.',
    ],
    signsNeeded: [
      'Salt indicator light on',
      'White residue on dishes (hard water)',
      'Limescale buildup visible',
    ],
  },

  wipe_exterior: {
    id: 'wipe_exterior',
    name: 'Wipe Exterior & Controls',
    description: 'Clean the door, handle, and control panel.',
    frequency: 'weekly',
    importanceLevel: 'low',
    timeMinutes: 3,
    steps: [
      'Wipe the door front with a damp cloth.',
      'For stainless steel: wipe in direction of grain.',
      'Clean the handle (high-touch area).',
      'Wipe the control panel gently (don\'t spray directly).',
      'Dry with a clean cloth to prevent streaks.',
    ],
    tools: ['Damp cloth', 'Dry cloth', 'Stainless steel cleaner (optional)'],
    tips: [
      'This is purely cosmetic but keeps your kitchen looking clean.',
      'Fingerprints show easily on stainless steel.',
      'Don\'t use abrasive cleaners on the control panel.',
    ],
    signsNeeded: [
      'Visible fingerprints or smudges',
      'Kitchen cleaning day',
    ],
  },

  check_drain: {
    id: 'check_drain',
    name: 'Check Drain Area',
    description: 'Inspect the drain area for blockages and debris.',
    frequency: 'quarterly',
    importanceLevel: 'medium',
    timeMinutes: 5,
    steps: [
      'Remove the bottom rack.',
      'Locate the drain area at the bottom of the tub.',
      'Remove any visible debris (food particles, glass, etc.).',
      'Check that the drain cover isn\'t blocked.',
      'If connected to garbage disposal: run the disposal first.',
      'Look for standing water (sign of drainage issue).',
    ],
    tools: ['Gloves (optional)', 'Paper towel'],
    tips: [
      'Standing water after a cycle indicates a drainage problem.',
      'Small items like broken glass can block the drain.',
      'Always run garbage disposal before starting dishwasher.',
    ],
    signsNeeded: [
      'Standing water after cycle',
      'Slow draining',
      'Gurgling sounds',
    ],
  },
};

// ============================================
// SCHEDULE GENERATION
// ============================================

function getUsageLevel(loadsPerWeek: number): 'light' | 'moderate' | 'heavy' {
  if (loadsPerWeek <= 3) return 'light';
  if (loadsPerWeek <= 6) return 'moderate';
  return 'heavy';
}

function adjustFrequency(
  baseFrequency: Frequency,
  usageLevel: 'light' | 'moderate' | 'heavy',
  waterHardness: WaterHardness,
  taskId: MaintenanceTask
): { frequency: Frequency; reason?: string } {
  // Frequency order: weekly < fortnightly < monthly < quarterly < as_needed
  const frequencyOrder: Frequency[] = ['weekly', 'fortnightly', 'monthly', 'quarterly', 'as_needed'];

  let adjustedIndex = frequencyOrder.indexOf(baseFrequency);
  let reason: string | undefined;

  // Heavy usage = more frequent cleaning
  if (usageLevel === 'heavy') {
    if (taskId === 'clean_filter' || taskId === 'run_cleaning_cycle') {
      adjustedIndex = Math.max(0, adjustedIndex - 1);
      reason = 'More frequent due to heavy usage';
    }
  }

  // Light usage = less frequent (except critical tasks)
  if (usageLevel === 'light') {
    if (taskId !== 'clean_filter') {
      adjustedIndex = Math.min(frequencyOrder.length - 2, adjustedIndex + 1);
      reason = 'Less frequent due to light usage';
    }
  }

  // Hard water = more frequent for scale-related tasks
  if (waterHardness === 'hard') {
    if (taskId === 'run_cleaning_cycle' || taskId === 'check_salt') {
      adjustedIndex = Math.max(0, adjustedIndex - 1);
      reason = 'More frequent due to hard water';
    }
  }

  return {
    frequency: frequencyOrder[adjustedIndex],
    reason,
  };
}

export function generateMaintenanceSchedule(input: MaintenanceInput): MaintenanceSchedule {
  const usageLevel = getUsageLevel(input.loadsPerWeek);
  const tasks: MaintenanceSchedule['tasks'] = [];
  const nextActions: string[] = [];

  // Get all tasks and adjust frequencies
  for (const task of Object.values(MAINTENANCE_TASKS)) {
    const { frequency, reason } = adjustFrequency(
      task.frequency,
      usageLevel,
      input.waterHardness,
      task.id
    );

    tasks.push({
      task,
      adjustedFrequency: frequency,
      reason,
    });
  }

  // Sort by importance
  const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => importanceOrder[a.task.importanceLevel] - importanceOrder[b.task.importanceLevel]);

  // Generate next actions based on input
  if (input.hasSmellIssues) {
    nextActions.push('Clean the filter immediately - this is the most likely cause of smell.');
    nextActions.push('Run a cleaning cycle with vinegar after cleaning the filter.');
    nextActions.push('Check and clean the door seal for mould.');
  }

  if (input.hasResidueIssues) {
    nextActions.push('Run a cleaning cycle to dissolve buildup.');
    if (input.waterHardness === 'hard' || input.waterHardness === 'unknown') {
      nextActions.push('Check and refill dishwasher salt if your machine has a salt compartment.');
    }
    nextActions.push('Clean the spray arms - blocked holes cause uneven cleaning.');
  }

  if (input.lastFilterClean) {
    const daysSinceFilter = Math.floor((Date.now() - input.lastFilterClean.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceFilter > 45) {
      nextActions.push(`Filter hasn't been cleaned in ${daysSinceFilter} days - clean it soon.`);
    }
  } else {
    nextActions.push('If you\'ve never cleaned the filter, do that first - it\'s the most important task.');
  }

  if (input.lastDeepClean) {
    const daysSinceDeep = Math.floor((Date.now() - input.lastDeepClean.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceDeep > 60) {
      nextActions.push(`It's been ${daysSinceDeep} days since your last cleaning cycle - schedule one soon.`);
    }
  }

  // Default next action if none specific
  if (nextActions.length === 0) {
    nextActions.push('Your maintenance is on track. Keep up with the schedule above.');
  }

  return {
    waterHardness: input.waterHardness,
    usageLevel,
    tasks,
    nextActions,
  };
}

// ============================================
// INDIVIDUAL TASK RETRIEVAL
// ============================================

export function getMaintenanceTask(taskId: MaintenanceTask): MaintenanceTaskInfo {
  return { ...MAINTENANCE_TASKS[taskId] };
}

export function getAllMaintenanceTasks(): MaintenanceTaskInfo[] {
  return Object.values(MAINTENANCE_TASKS).map(task => ({ ...task }));
}

export function getTasksByImportance(level: MaintenanceTaskInfo['importanceLevel']): MaintenanceTaskInfo[] {
  return Object.values(MAINTENANCE_TASKS)
    .filter(task => task.importanceLevel === level)
    .map(task => ({ ...task }));
}

export function getCriticalTasks(): MaintenanceTaskInfo[] {
  return getTasksByImportance('critical');
}

// ============================================
// QUICK MAINTENANCE CHECK
// ============================================

export interface MaintenanceCheck {
  score: number; // 0-100
  status: 'good' | 'needs_attention' | 'urgent';
  issues: string[];
  recommendations: string[];
}

export function quickMaintenanceCheck(input: {
  filterCleanedWithin30Days: boolean;
  deepCleanWithin60Days: boolean;
  rinseAidFull: boolean;
  noSmellIssues: boolean;
  noResidueIssues: boolean;
  noDirtyDishIssues: boolean;
}): MaintenanceCheck {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!input.filterCleanedWithin30Days) {
    score -= 30;
    issues.push('Filter needs cleaning');
    recommendations.push('Clean the filter - it\'s the most important maintenance task.');
  }

  if (!input.deepCleanWithin60Days) {
    score -= 20;
    issues.push('Due for a cleaning cycle');
    recommendations.push('Run an empty hot cycle with vinegar to dissolve buildup.');
  }

  if (!input.rinseAidFull) {
    score -= 10;
    issues.push('Rinse aid low');
    recommendations.push('Refill rinse aid for spot-free drying.');
  }

  if (!input.noSmellIssues) {
    score -= 20;
    issues.push('Smell issues reported');
    recommendations.push('Clean filter, door seal, and run cleaning cycle.');
  }

  if (!input.noResidueIssues) {
    score -= 15;
    issues.push('Residue issues reported');
    recommendations.push('Check water hardness settings and run cleaning cycle.');
  }

  if (!input.noDirtyDishIssues) {
    score -= 15;
    issues.push('Cleaning performance issues');
    recommendations.push('Check filter, spray arms, and detergent amount.');
  }

  let status: MaintenanceCheck['status'];
  if (score >= 80) {
    status = 'good';
  } else if (score >= 50) {
    status = 'needs_attention';
  } else {
    status = 'urgent';
  }

  if (issues.length === 0) {
    recommendations.push('Your dishwasher maintenance is up to date!');
  }

  return { score, status, issues, recommendations };
}
