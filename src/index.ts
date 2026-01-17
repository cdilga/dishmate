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

// ============================================
// RINSE AID GUIDE
// ============================================

export type {
  RinseAidSetting,
  ItemCategory,
  SpotCause,
  RinseAidInput,
  RinseAidRecommendation,
  RinseAidExplanation,
  SpotDiagnosis,
} from './rinse-aid-guide';

export {
  getRinseAidRecommendation,
  getRinseAidExplanation,
  getDryingTips,
  getRinseAidSettings,
  diagnoseSpotIssue,
} from './rinse-aid-guide';

// ============================================
// WATER HARDNESS HELPER
// ============================================

export type {
  SudsAmount,
  WaterClarity,
  Confidence,
  WaterHardnessTest,
  TestResult,
  HardnessRecommendations,
  CityHardnessResult,
  HardnessExplanation,
  SymptomEstimate,
} from './water-hardness-helper';

export {
  getWaterHardnessTest,
  interpretTestResult,
  getHardnessRecommendations,
  getAustralianCityHardness,
  getHardnessExplanation,
  getAllHardnessLevels,
  estimateHardnessFromSymptoms,
} from './water-hardness-helper';

// ============================================
// QUICK START GUIDE
// ============================================

export type {
  QuickStartSection,
  QuickStartGuide,
  OnboardingStep,
  QuickWin,
  Mistake,
  ActionPlan,
  WashPhase,
  DishwasherBasics,
} from './quick-start-guide';

export {
  getQuickStartGuide,
  getOnboardingSteps,
  getQuickWin,
  getTopMistakes,
  getImmediateActionPlan,
  getDishwasherBasics,
} from './quick-start-guide';
