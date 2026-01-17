// ============================================
// DISHMATE CORE TYPES
// ============================================

// Item types that can be loaded into dishwasher
export type ItemType =
  | 'plates'
  | 'bowls'
  | 'glasses'
  | 'mugs'
  | 'pots'
  | 'pans'
  | 'bakeware'
  | 'utensils'
  | 'containers'
  | 'baby_items'
  | 'cutting_boards'
  | 'delicate'; // fine glasses, crystal, china

// Soil types representing different kinds of food residue
export type SoilType =
  | 'light' // water marks, dust, minimal residue
  | 'everyday' // normal food residue, sauces
  | 'heavy' // baked-on, burnt, dried overnight
  | 'greasy' // oils, fried food, butter
  | 'protein' // eggs, cheese, meat, dairy
  | 'starchy' // pasta, rice, potato, bread
  | 'acidic'; // tomato, citrus, vinegar

// Load quantity
export type LoadQuantity = 'light' | 'normal' | 'full';

// Urgency level
export type Urgency = 'no_rush' | 'need_today' | 'need_fast';

// Dishwasher cycle types
export type CycleType =
  | 'quick' // 30-45 min, no prewash, minimal enzyme time
  | 'eco' // 2-3 hrs, low temp, long enzyme activation
  | 'normal' // 1-1.5 hrs, moderate temp, good enzyme time
  | 'intensive' // 1.5-2 hrs, high temp, heavy soil
  | 'delicate' // low pressure, low temp, gentle
  | 'sanitise'; // high temp final rinse, baby items

// Grease factor levels
export type GreaseFactor = 'low' | 'medium' | 'high';

// Water hardness levels
export type WaterHardness = 'soft' | 'moderate' | 'hard' | 'unknown';

// ============================================
// LOAD ADVISOR TYPES
// ============================================

export interface LoadInput {
  items: ItemType[];
  soilTypes: SoilType[];
  quantity: LoadQuantity;
  urgency: Urgency;
  waterHardness?: WaterHardness;
}

export interface Recommendation {
  cycle: CycleType;
  prewashDose: string;
  mainDose: string;
  prerinseAdvice: string;
  loadingTips: string[];
  reasoning: string;
  warnings?: string[];
}

// Internal calculation state
export interface LoadCalculation {
  needsSanitise: boolean;
  needsGentle: boolean;
  soilScore: number;
  greaseFactor: GreaseFactor;
  hasAcidicRisk: boolean;
}

// ============================================
// TROUBLESHOOTER TYPES
// ============================================

export type TroubleshootCategory =
  | 'white_residue'
  | 'cloudy_glasses'
  | 'food_stuck'
  | 'greasy_feeling'
  | 'spots'
  | 'bad_smell'
  | 'not_drying'
  | 'other';

export type ResidueType = 'powdery' | 'smeary';
export type DetergentType = 'pods' | 'powder' | 'liquid';
export type FoodStuckLocation = 'concave' | 'flat' | 'everywhere' | 'random';
export type FoodType = 'baked_on' | 'greasy' | 'everyday' | 'protein';
export type SmellTiming = 'after_cycle' | 'after_unused' | 'always';

export interface TroubleshootInput {
  category: TroubleshootCategory;
  // For white residue
  residueType?: ResidueType;
  waterHardness?: WaterHardness;
  detergentType?: DetergentType;
  // For food stuck
  foodLocation?: FoodStuckLocation;
  foodType?: FoodType;
  // For bad smell
  filterCleanedRecently?: boolean;
  smellTiming?: SmellTiming;
}

export interface DiagnosisStep {
  id: string;
  question?: string;
  options?: Array<{
    label: string;
    value: string;
    nextStep?: string;
  }>;
  diagnosis?: string;
  solution?: TroubleshootSolution;
}

export interface TroubleshootSolution {
  title: string;
  summary: string;
  steps: string[];
  tips?: string[];
  productRecommendation?: string;
}

// ============================================
// PRE-RINSE GUIDE TYPES
// ============================================

export interface PreRinseAdvice {
  whatToLeave: Array<{
    item: string;
    reason: string;
  }>;
  whatToScrape: Array<{
    item: string;
    reason: string;
  }>;
  commonMyths: Array<{
    myth: string;
    reality: string;
  }>;
}

// ============================================
// DECISION TREE TYPES
// ============================================

export interface DecisionNode<TInput, TOutput> {
  id: string;
  evaluate: (input: TInput, context?: Record<string, unknown>) => TOutput | string;
}

export interface DecisionTree<TInput, TOutput> {
  name: string;
  description: string;
  rootNode: string;
  nodes: Map<string, DecisionNode<TInput, TOutput>>;
  execute: (input: TInput) => TOutput;
}
