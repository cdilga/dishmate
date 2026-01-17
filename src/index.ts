// Dishmate - Smart Dishwasher Load Advisor and Troubleshooter
// MVP Decision Trees for optimal dishwasher usage

// ============================================
// TYPES
// ============================================

export type {
  ItemType,
  SoilType,
  LoadQuantity,
  Urgency,
  CycleType,
  GreaseFactor,
  WaterHardness,
  LoadInput,
  LoadCalculation,
  Recommendation,
  TroubleshootCategory,
  TroubleshootInput,
  DiagnosisStep,
  TroubleshootSolution,
  PreRinseAdvice,
} from './types';

// ============================================
// LOAD ADVISOR
// ============================================

export {
  getLoadRecommendation,
  calculateSoilScore,
  calculateGreaseFactor,
  selectCycle,
  calculateDosing,
  getPrerinseAdvice,
  getLoadingTips,
  generateReasoning,
} from './load-advisor';

// ============================================
// TROUBLESHOOTER
// ============================================

export {
  TROUBLESHOOT_CATEGORIES,
  getInitialQuestion,
  getTroubleshootFlow,
  processAnswer,
  getSolution,
} from './troubleshooter';

// ============================================
// PRE-RINSE GUIDE
// ============================================

export {
  getPreRinseGuide,
  getWhatToLeave,
  getWhatToScrape,
  getCommonMyths,
  shouldScrapeItem,
  shouldLeaveItem,
} from './prerinse-guide';

// ============================================
// DETERGENT ADVISOR
// ============================================

export type {
  DetergentFormat,
  UsagePattern,
  MainConcern,
  DetergentInput,
  DetergentRecommendation,
} from './detergent-advisor';

export {
  getDetergentRecommendation,
  getDetergentFormatInfo,
  getAllDetergentFormats,
  compareFormats,
  getWhyPowderBeatsPods,
} from './detergent-advisor';

// ============================================
// MAINTENANCE GUIDE
// ============================================

export type {
  MaintenanceTask,
  Frequency,
  MaintenanceTaskInfo,
  MaintenanceSchedule,
  MaintenanceInput,
  MaintenanceCheck,
} from './maintenance-guide';

export {
  generateMaintenanceSchedule,
  getMaintenanceTask,
  getAllMaintenanceTasks,
  getTasksByImportance,
  getCriticalTasks,
  quickMaintenanceCheck,
} from './maintenance-guide';

// ============================================
// CYCLE EXPLAINER
// ============================================

export type {
  CycleInfo,
  CycleComparison,
  CycleSelectionGuide,
  CycleEducation,
} from './cycle-explainer';

export {
  getCycleInfo,
  getAllCycles,
  compareCycles,
  getCycleForSoilType,
  getCycleForItemType,
  getEnzymeExplanation,
  getPrewashExplanation,
  getTemperatureExplanation,
  getAllEducationalContent,
} from './cycle-explainer';
