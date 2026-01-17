import type {
  SoilType,
  ItemType,
  LoadQuantity,
  Urgency,
  CycleType,
  GreaseFactor,
  WaterHardness,
  LoadInput,
  LoadCalculation,
  Recommendation,
} from './types';

// ============================================
// SOIL SCORE CALCULATION
// ============================================

const SOIL_SCORES: Record<SoilType, number> = {
  light: 1,
  everyday: 2,
  starchy: 2,
  acidic: 2,
  protein: 3,
  greasy: 4,
  heavy: 5,
};

export function calculateSoilScore(soilTypes: SoilType[]): number {
  if (soilTypes.length === 0) return 1;
  return Math.max(...soilTypes.map(soil => SOIL_SCORES[soil] ?? 1));
}

// ============================================
// GREASE FACTOR CALCULATION
// ============================================

export function calculateGreaseFactor(soilTypes: SoilType[]): GreaseFactor {
  if (soilTypes.includes('greasy')) return 'high';
  if (soilTypes.includes('protein')) return 'medium';
  return 'low';
}

// ============================================
// CHECK FOR SPECIAL REQUIREMENTS
// ============================================

function needsSanitise(items: ItemType[]): boolean {
  return items.includes('baby_items');
}

function needsGentle(items: ItemType[]): boolean {
  return items.includes('delicate');
}

function hasAcidicRisk(soilTypes: SoilType[]): boolean {
  return soilTypes.includes('acidic');
}

// ============================================
// CYCLE SELECTION
// ============================================

export function selectCycle(calc: LoadCalculation, urgency: Urgency): CycleType {
  // Rule 1: Baby items need sanitise (unless delicate)
  if (calc.needsSanitise && !calc.needsGentle) {
    return 'sanitise';
  }

  // Rule 2: Delicate items need gentle cycle
  if (calc.needsGentle) {
    return 'delicate';
  }

  // Rule 3: Need fast + low soil = quick
  if (urgency === 'need_fast' && calc.soilScore <= 2) {
    return 'quick';
  }

  // Rule 4: Need fast + high soil = normal (with warning)
  if (urgency === 'need_fast' && calc.soilScore > 2) {
    return 'normal';
  }

  // Rule 5: Heavy or greasy = intensive
  if (calc.soilScore >= 4) {
    return 'intensive';
  }

  // Rule 6: No rush + moderate soil (including protein) = eco
  // Per spec: eco provides long enzyme activation time, good for protein
  if (urgency === 'no_rush' && calc.soilScore <= 3) {
    return 'eco';
  }

  // Rule 7: Protein with urgency = normal (needs enzyme time)
  if (calc.soilScore === 3) {
    return 'normal';
  }

  // Rule 8: Default
  return 'normal';
}

// ============================================
// DOSING CALCULATION
// ============================================

interface DosingResult {
  prewashDose: string;
  mainDose: string;
}

const PREWASH_DOSES: Record<GreaseFactor, number> = {
  high: 1.5,
  medium: 1,
  low: 0.5,
};

function getMainDoseBase(soilScore: number): number {
  if (soilScore >= 4) return 2.5;
  if (soilScore === 3) return 2;
  if (soilScore === 2) return 1.5;
  return 1;
}

function formatDose(amount: number, isPrewash: boolean): string {
  // Round to nearest 0.5
  const rounded = Math.round(amount * 2) / 2;
  // Use singular for exactly 1, plural for all others (0.5, 1.5, 2, etc.)
  const unit = rounded === 1 ? 'tablespoon' : 'tablespoons';
  const location = isPrewash ? 'in the door' : 'in dispenser';
  return `${rounded} ${unit} ${location}`;
}

export function calculateDosing(
  soilScore: number,
  greaseFactor: GreaseFactor,
  cycle: CycleType,
  quantity: LoadQuantity,
  waterHardness: WaterHardness = 'moderate'
): DosingResult {
  // Quick cycle has no prewash
  if (cycle === 'quick') {
    let mainDose = 1;
    if (waterHardness === 'hard') mainDose *= 1.5;
    if (quantity === 'light') mainDose *= 0.75;
    if (quantity === 'full') mainDose *= 1.25;
    return {
      prewashDose: 'None needed',
      mainDose: formatDose(mainDose, false),
    };
  }

  // Calculate prewash dose
  let prewashDose = cycle === 'delicate' ? 0.5 : PREWASH_DOSES[greaseFactor];

  // Calculate main dose
  let mainDose = getMainDoseBase(soilScore);

  // Quantity adjustments (main dose only)
  if (quantity === 'light') {
    mainDose *= 0.75;
  } else if (quantity === 'full') {
    mainDose *= 1.25;
  }

  // Hard water adjustments (+50% to both)
  if (waterHardness === 'hard') {
    prewashDose *= 1.5;
    mainDose *= 1.5;
  }

  return {
    prewashDose: formatDose(prewashDose, true),
    mainDose: formatDose(mainDose, false),
  };
}

// ============================================
// PRE-RINSE ADVICE
// ============================================

const PRERINSE_ADVICE: Record<SoilType, string> = {
  heavy: "Scrape off large chunks and burnt bits. Don't rinse.",
  greasy: "Don't rinse - grease helps detergent work. Scrape solids only.",
  protein: 'Light scrape only. Dried protein is fine - enzymes handle it.',
  starchy: 'No rinsing needed. Starch dissolves easily.',
  acidic: 'Run soon - acidic foods can stain if left too long.',
  everyday: 'Scrape large food pieces into bin. No rinsing needed.',
  light: 'Scrape large food pieces into bin. No rinsing needed.',
};

export function getPrerinseAdvice(soilTypes: SoilType[]): string {
  // Priority order for advice
  const priorityOrder: SoilType[] = ['heavy', 'greasy', 'protein', 'starchy', 'acidic'];

  for (const soil of priorityOrder) {
    if (soilTypes.includes(soil)) {
      return PRERINSE_ADVICE[soil];
    }
  }

  return PRERINSE_ADVICE['everyday'];
}

// ============================================
// LOADING TIPS
// ============================================

const ITEM_TIPS: Record<string, string> = {
  glasses: 'Angle glasses between tines, not over them',
  bowls: 'Face bowls toward centre, angled down',
  pots: 'Place pots and pans on bottom rack, angled for water access',
  pans: 'Place pots and pans on bottom rack, angled for water access',
  containers: 'Plastic on top rack only - bottoms warp with heat',
  bakeware: "Angle bakeware to face spray arm, don't lay flat",
  utensils: 'Mix utensil handles up and down to prevent nesting',
  mugs: 'Place mugs at an angle to prevent water pooling',
  cutting_boards: "Place cutting boards on sides, don't lay flat",
};

export function getLoadingTips(items: ItemType[], quantity: LoadQuantity): string[] {
  const tips: string[] = [];
  const addedTips = new Set<string>();

  for (const item of items) {
    const tip = ITEM_TIPS[item];
    if (tip && !addedTips.has(tip)) {
      tips.push(tip);
      addedTips.add(tip);
    }
  }

  if (quantity === 'full') {
    tips.push("Don't block spray arm rotation - spin it to check");
  }

  return tips;
}

// ============================================
// REASONING GENERATION
// ============================================

const CYCLE_REASONING: Record<CycleType, (soilScore: number, greaseFactor: GreaseFactor) => string> = {
  quick: () =>
    'Quick cycle is fine for lightly soiled items. No pre-wash dose needed since there\'s minimal grease to tackle.',
  eco: () =>
    'Eco cycle is ideal here. The longer run time at lower temperature gives enzymes plenty of time to work - uses less energy too.',
  normal: (soilScore, greaseFactor) => {
    if (soilScore === 3) {
      return 'Normal cycle works best because protein residue needs enzyme activation time. The pre-wash detergent will handle any grease before the main wash.';
    }
    if (greaseFactor === 'high') {
      return 'Normal cycle needed to give enzymes time to work on the grease. Pre-wash detergent is critical.';
    }
    return 'Normal cycle provides good balance of cleaning power and efficiency for this load.';
  },
  intensive: () =>
    'Intensive cycle needed for heavy/greasy load. The higher temperature and longer wash time will tackle baked-on and greasy residue.',
  delicate: () =>
    'Delicate cycle uses lower pressure and temperature to protect fragile items. Handle with care.',
  sanitise: () =>
    'Sanitise cycle uses high-temperature final rinse to eliminate bacteria - important for baby items.',
};

export function generateReasoning(
  cycle: CycleType,
  soilScore: number,
  greaseFactor: GreaseFactor
): string {
  return CYCLE_REASONING[cycle](soilScore, greaseFactor);
}

// ============================================
// MAIN RECOMMENDATION FUNCTION
// ============================================

export function getLoadRecommendation(input: LoadInput): Recommendation {
  const warnings: string[] = [];

  // Calculate internal state
  const calc: LoadCalculation = {
    needsSanitise: needsSanitise(input.items),
    needsGentle: needsGentle(input.items),
    soilScore: calculateSoilScore(input.soilTypes),
    greaseFactor: calculateGreaseFactor(input.soilTypes),
    hasAcidicRisk: hasAcidicRisk(input.soilTypes),
  };

  // Select cycle
  const cycle = selectCycle(calc, input.urgency);

  // Generate warnings
  if (input.urgency === 'need_fast' && calc.soilScore > 2) {
    warnings.push("Quick cycle won't clean this well - using normal instead.");
  }

  if (calc.needsGentle && calc.soilScore > 2) {
    warnings.push('Consider hand washing heavily soiled delicate items.');
  }

  if (calc.hasAcidicRisk) {
    warnings.push('Run soon to prevent staining from acidic foods.');
  }

  // Calculate dosing
  const doses = calculateDosing(
    calc.soilScore,
    calc.greaseFactor,
    cycle,
    input.quantity,
    input.waterHardness ?? 'moderate'
  );

  // Get advice and tips
  const prerinseAdvice = getPrerinseAdvice(input.soilTypes);
  const loadingTips = getLoadingTips(input.items, input.quantity);
  const reasoning = generateReasoning(cycle, calc.soilScore, calc.greaseFactor);

  return {
    cycle,
    prewashDose: doses.prewashDose,
    mainDose: doses.mainDose,
    prerinseAdvice,
    loadingTips,
    reasoning,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
