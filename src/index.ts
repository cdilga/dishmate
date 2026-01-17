// Dishmate - Smart Dishwasher Load Advisor and Troubleshooter
// MVP Decision Trees for optimal dishwasher usage

// Types
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

// Load Advisor
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

// Troubleshooter
export {
  TROUBLESHOOT_CATEGORIES,
  getInitialQuestion,
  getTroubleshootFlow,
  processAnswer,
  getSolution,
} from './troubleshooter';

// Pre-Rinse Guide
export {
  getPreRinseGuide,
  getWhatToLeave,
  getWhatToScrape,
  getCommonMyths,
  shouldScrapeItem,
  shouldLeaveItem,
} from './prerinse-guide';
