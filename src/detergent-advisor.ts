import type { SoilType, WaterHardness } from './types';

// ============================================
// DETERGENT ADVISOR TYPES
// ============================================

export type DetergentFormat = 'powder' | 'pods' | 'liquid' | 'tablets';

export type UsagePattern =
  | 'daily'           // Run 1+ times per day
  | 'regular'         // Run 4-6 times per week
  | 'occasional';     // Run 1-3 times per week

export type MainConcern =
  | 'clean_dishes'    // Just want dishes clean
  | 'convenience'     // Minimal effort
  | 'cost'            // Save money
  | 'eco'             // Environmental impact
  | 'specific_problem'; // Have a specific issue

export interface DetergentInput {
  currentFormat?: DetergentFormat;
  waterHardness: WaterHardness;
  usagePattern: UsagePattern;
  mainConcern: MainConcern;
  typicalSoilTypes: SoilType[];
  hasGreasyIssues?: boolean;
  hasResidueIssues?: boolean;
}

export interface DetergentRecommendation {
  recommendedFormat: DetergentFormat;
  reasoning: string;
  usageInstructions: string[];
  warnings?: string[];
  costComparison?: string;
  alternativeFormat?: DetergentFormat;
  alternativeReason?: string;
}

// ============================================
// DETERGENT FORMAT COMPARISON
// ============================================

interface DetergentFormatInfo {
  format: DetergentFormat;
  pros: string[];
  cons: string[];
  bestFor: string[];
  costPerWash: string;
  prewashCapable: boolean;
  enzymeContent: 'high' | 'medium' | 'low' | 'variable';
}

const DETERGENT_INFO: Record<DetergentFormat, DetergentFormatInfo> = {
  powder: {
    format: 'powder',
    pros: [
      'Can add to pre-wash (critical for greasy dishes)',
      'Adjustable dosing for load size and soil level',
      'Generally highest enzyme content',
      'Most cost-effective per wash',
      'Better for hard water (can use more)',
    ],
    cons: [
      'Requires measuring',
      'Can clump in humid conditions',
      'Messier than pods',
    ],
    bestFor: [
      'Greasy dishes',
      'Heavy soil loads',
      'Hard water areas',
      'Budget-conscious households',
      'Users who want optimal results',
    ],
    costPerWash: '$0.10-0.20',
    prewashCapable: true,
    enzymeContent: 'high',
  },
  pods: {
    format: 'pods',
    pros: [
      'Convenient - no measuring',
      'Clean and easy to handle',
      'Consistent dosing',
    ],
    cons: [
      'Cannot add to pre-wash phase',
      'Fixed dose (can\'t adjust for load)',
      'More expensive per wash',
      'Can leave residue if not fully dissolved',
      'Short cycles may not dissolve coating',
    ],
    bestFor: [
      'Lightly soiled dishes only',
      'Users who prioritise convenience',
      'Normal to soft water areas',
    ],
    costPerWash: '$0.25-0.50',
    prewashCapable: false,
    enzymeContent: 'medium',
  },
  tablets: {
    format: 'tablets',
    pros: [
      'Convenient - no measuring',
      'Generally dissolve faster than pods',
      'Can sometimes be broken in half for light loads',
    ],
    cons: [
      'Still cannot add to pre-wash effectively',
      'Fixed dose for most',
      'More expensive than powder',
    ],
    bestFor: [
      'Light to moderate soil',
      'Users who want balance of convenience and performance',
    ],
    costPerWash: '$0.20-0.40',
    prewashCapable: false,
    enzymeContent: 'medium',
  },
  liquid: {
    format: 'liquid',
    pros: [
      'Easy to measure and pour',
      'Dissolves quickly',
    ],
    cons: [
      'Often lower enzyme content',
      'Can leave smeary residue',
      'Less effective on tough soil',
      'Easy to overdose',
    ],
    bestFor: [
      'Very light soil only',
      'Quick cycles',
    ],
    costPerWash: '$0.15-0.30',
    prewashCapable: true,
    enzymeContent: 'low',
  },
};

// ============================================
// RECOMMENDATION LOGIC
// ============================================

function hasHeavySoil(soilTypes: SoilType[]): boolean {
  return soilTypes.some(s => ['heavy', 'greasy', 'protein'].includes(s));
}

function needsPrewash(soilTypes: SoilType[], hasGreasyIssues?: boolean): boolean {
  return hasGreasyIssues === true || soilTypes.includes('greasy');
}

export function getDetergentRecommendation(input: DetergentInput): DetergentRecommendation {
  const warnings: string[] = [];
  let recommendedFormat: DetergentFormat = 'powder';
  let reasoning = '';
  const usageInstructions: string[] = [];
  let alternativeFormat: DetergentFormat | undefined;
  let alternativeReason: string | undefined;

  // Determine if pre-wash is critical for this user
  const needsPrewashCapability = needsPrewash(input.typicalSoilTypes, input.hasGreasyIssues);
  const heavySoil = hasHeavySoil(input.typicalSoilTypes);

  // Decision logic based on main concern and situation
  if (input.hasGreasyIssues) {
    // User has greasy dish problems - powder is the only real fix
    recommendedFormat = 'powder';
    reasoning = 'Greasy dishes need pre-wash detergent. Powder is the only format that lets you add ' +
      'detergent to the pre-wash phase. This is critical because your dishwasher runs a pre-wash ' +
      'BEFORE opening the dispenser - pods sit there doing nothing while plain water fails to cut grease.';

    if (input.currentFormat === 'pods') {
      warnings.push('Your current pods cannot help with the pre-wash phase. This is likely causing your greasy dish issues.');
    }
  } else if (input.hasResidueIssues) {
    // User has residue issues
    if (input.waterHardness === 'hard') {
      recommendedFormat = 'powder';
      reasoning = 'Residue in hard water areas usually means you need MORE detergent. Powder lets you ' +
        'adjust the dose - try doubling what you currently use. Pods give you a fixed amount that\'s ' +
        'often not enough for hard water.';
    } else if (input.currentFormat === 'pods' || input.currentFormat === 'liquid') {
      recommendedFormat = 'powder';
      reasoning = 'White residue from pods often means they\'re not dissolving fully. Powder dissolves ' +
        'instantly and lets you control the amount. With soft water, you might actually need less detergent.';
    } else {
      recommendedFormat = 'powder';
      reasoning = 'Powder gives you the control to adjust dosing until you find the right amount for your water.';
    }
  } else if (input.mainConcern === 'convenience' && !heavySoil && input.waterHardness !== 'hard') {
    // User wants convenience and doesn't have challenging conditions
    recommendedFormat = 'pods';
    reasoning = 'Pods work fine for lightly soiled dishes in soft/moderate water areas. They\'re convenient ' +
      'and give consistent results for everyday loads.';

    alternativeFormat = 'powder';
    alternativeReason = 'Switch to powder if you ever need to tackle greasy or heavily soiled items - pods can\'t handle the pre-wash.';

    warnings.push('If you start seeing greasy residue, switch to powder - pods can\'t help with pre-wash.');
  } else if (input.mainConcern === 'cost') {
    recommendedFormat = 'powder';
    reasoning = 'Powder is the most cost-effective option at $0.10-0.20 per wash compared to $0.25-0.50 for pods. ' +
      'It also cleans better because you can add pre-wash detergent and adjust for load size.';
  } else if (input.mainConcern === 'eco') {
    recommendedFormat = 'powder';
    reasoning = 'Powder typically has the lowest environmental impact: less packaging, more concentrated, ' +
      'and no plastic pod coatings. You can also use less for light loads, reducing waste.';
  } else if (heavySoil) {
    recommendedFormat = 'powder';
    reasoning = 'For heavy soil (baked-on, greasy, protein), powder is essential. You need the pre-wash ' +
      'capability and ability to use more detergent. Pods will leave you with dirty dishes.';
  } else if (input.waterHardness === 'hard') {
    recommendedFormat = 'powder';
    reasoning = 'Hard water needs more detergent than pods provide. With powder, you can increase the dose ' +
      '50-100% to compensate. Pods give you a fixed amount that\'s often insufficient.';

    warnings.push('In hard water areas, you\'ll need about 50% more detergent than packet recommendations.');
  } else {
    // Default recommendation
    recommendedFormat = 'powder';
    reasoning = 'Powder gives you the best combination of cleaning power, flexibility, and value. ' +
      'It\'s the only format that works with the pre-wash phase, and you can adjust the dose for each load.';

    if (input.mainConcern === 'clean_dishes') {
      alternativeFormat = 'tablets';
      alternativeReason = 'Tablets are a reasonable middle ground if you want some convenience, but powder still cleans better.';
    }
  }

  // Generate usage instructions
  usageInstructions.push(...getUsageInstructions(recommendedFormat, input.waterHardness, heavySoil));

  // Add cost comparison
  const costComparison = generateCostComparison(recommendedFormat, input.usagePattern);

  return {
    recommendedFormat,
    reasoning,
    usageInstructions,
    warnings: warnings.length > 0 ? warnings : undefined,
    costComparison,
    alternativeFormat,
    alternativeReason,
  };
}

function getUsageInstructions(format: DetergentFormat, waterHardness: WaterHardness, heavySoil: boolean): string[] {
  const instructions: string[] = [];

  if (format === 'powder') {
    instructions.push('PRE-WASH: Put 1-1.5 tablespoons loose in the door or on the tub floor before closing.');
    instructions.push('MAIN WASH: Put 1.5-2 tablespoons in the dispenser compartment.');

    if (waterHardness === 'hard') {
      instructions.push('HARD WATER: Increase both doses by 50% (so about 2 tbsp pre-wash, 3 tbsp main).');
    }

    if (heavySoil) {
      instructions.push('HEAVY SOIL: Use the maximum doses and run Intensive or Normal cycle (not Quick).');
    }

    instructions.push('STORAGE: Keep in a dry place with lid sealed to prevent clumping.');
  } else if (format === 'pods' || format === 'tablets') {
    instructions.push('Place one pod/tablet in the dispenser compartment before running.');
    instructions.push('Make sure the dispenser door isn\'t blocked by dishes.');
    instructions.push('Use Normal or longer cycles - Quick may not dissolve them fully.');
    instructions.push('Handle with dry hands - moisture makes them sticky.');

    if (waterHardness === 'hard') {
      instructions.push('NOTE: Pods may not provide enough detergent for hard water. Consider switching to powder if you see residue.');
    }
  } else if (format === 'liquid') {
    instructions.push('Fill dispenser to the line marked for your load size.');
    instructions.push('Don\'t overfill - liquid spreads easily.');
    instructions.push('Can add a small amount to the door for pre-wash if needed.');
    instructions.push('Best for light loads and quick cycles.');
  }

  return instructions;
}

function generateCostComparison(recommendedFormat: DetergentFormat, usagePattern: UsagePattern): string {
  const loadsPerWeek = usagePattern === 'daily' ? 7 : usagePattern === 'regular' ? 5 : 2;
  const loadsPerYear = loadsPerWeek * 52;

  const costs: Record<DetergentFormat, { low: number; high: number }> = {
    powder: { low: 0.10, high: 0.20 },
    pods: { low: 0.25, high: 0.50 },
    tablets: { low: 0.20, high: 0.40 },
    liquid: { low: 0.15, high: 0.30 },
  };

  const recommended = costs[recommendedFormat];
  const yearly = {
    low: Math.round(recommended.low * loadsPerYear),
    high: Math.round(recommended.high * loadsPerYear),
  };

  // Compare to pods if not recommending pods
  if (recommendedFormat !== 'pods') {
    const podYearly = {
      low: Math.round(costs.pods.low * loadsPerYear),
      high: Math.round(costs.pods.high * loadsPerYear),
    };
    const savingsLow = podYearly.low - yearly.high;
    const savingsHigh = podYearly.high - yearly.low;

    return `${recommendedFormat.charAt(0).toUpperCase() + recommendedFormat.slice(1)} costs ~$${yearly.low}-${yearly.high}/year ` +
      `(${loadsPerYear} loads). That's $${savingsLow}-${savingsHigh} less than pods.`;
  }

  return `Estimated cost: ~$${yearly.low}-${yearly.high}/year (${loadsPerYear} loads).`;
}

// ============================================
// FORMAT COMPARISON API
// ============================================

export function getDetergentFormatInfo(format: DetergentFormat): DetergentFormatInfo {
  return { ...DETERGENT_INFO[format] };
}

export function getAllDetergentFormats(): DetergentFormatInfo[] {
  return Object.values(DETERGENT_INFO).map(info => ({ ...info }));
}

export function compareFormats(format1: DetergentFormat, format2: DetergentFormat): {
  format1: DetergentFormatInfo;
  format2: DetergentFormatInfo;
  winner: DetergentFormat;
  whyWinner: string;
} {
  const info1 = DETERGENT_INFO[format1];
  const info2 = DETERGENT_INFO[format2];

  // Powder wins in most comparisons
  let winner: DetergentFormat;
  let whyWinner: string;

  if (format1 === 'powder' || format2 === 'powder') {
    winner = 'powder';
    const other = format1 === 'powder' ? format2 : format1;
    if (other === 'pods') {
      whyWinner = 'Powder can be used in pre-wash (pods cannot), has adjustable dosing, and costs less per wash.';
    } else if (other === 'liquid') {
      whyWinner = 'Powder has higher enzyme content and is more effective on tough soil than liquid.';
    } else {
      whyWinner = 'Powder offers better cleaning performance and value than tablets.';
    }
  } else if ((format1 === 'pods' && format2 === 'liquid') || (format1 === 'liquid' && format2 === 'pods')) {
    winner = 'pods';
    whyWinner = 'Pods have more consistent dosing and typically better enzyme content than liquid.';
  } else {
    winner = format1;
    whyWinner = 'Both formats have similar performance for light loads.';
  }

  return {
    format1: { ...info1 },
    format2: { ...info2 },
    winner,
    whyWinner,
  };
}

// ============================================
// WHY POWDER BEATS PODS (Educational Content)
// ============================================

export interface PowderVsPodsExplanation {
  headline: string;
  summary: string;
  keyPoints: Array<{
    title: string;
    explanation: string;
  }>;
  conclusion: string;
}

export function getWhyPowderBeatsPods(): PowderVsPodsExplanation {
  return {
    headline: 'Why Powder Beats Pods',
    summary: 'Your dishwasher runs a PRE-WASH phase before opening the detergent dispenser. ' +
      'Pods sit locked in the dispenser during this entire phase, doing nothing. ' +
      'That means the pre-wash uses only plain water - no cleaning power.',
    keyPoints: [
      {
        title: 'The Pre-Wash Problem',
        explanation: 'Most dishwashers spray dishes with water before the main cycle to loosen food. ' +
          'This is when grease and heavy soil should be tackled. But with pods, there\'s no detergent ' +
          'in this phase - the pod is still sealed in the dispenser. Plain water can\'t cut grease, ' +
          'so it just spreads around and redeposits on your dishes.',
      },
      {
        title: 'Powder Solution',
        explanation: 'With powder, you can put 1-1.5 tablespoons loose in the door or tub floor ' +
          'BEFORE closing the door. This powder dissolves in the pre-wash phase, tackling grease ' +
          'and heavy soil when it matters most. Then the dispenser opens for the main wash with ' +
          'fresh detergent for the finishing clean.',
      },
      {
        title: 'Adjustable Dosing',
        explanation: 'Pods give you one fixed dose regardless of load size, soil level, or water hardness. ' +
          'Powder lets you use less for light loads (saving money) and more for heavy loads or hard water ' +
          '(getting cleaner dishes). This flexibility means better results and less waste.',
      },
      {
        title: 'Better Enzymes',
        explanation: 'Quality powder detergents typically have higher concentrations of enzymes ' +
          '(proteases for protein, amylases for starch, lipases for fats). These enzymes do the ' +
          'real cleaning work. Pods often sacrifice enzyme content to fit everything in a small package.',
      },
      {
        title: 'Cost Savings',
        explanation: 'Powder costs $0.10-0.20 per wash compared to $0.25-0.50 for pods. ' +
          'Over a year of daily use, that\'s $50-100+ in savings - while getting cleaner dishes.',
      },
    ],
    conclusion: 'The convenience of pods comes at the cost of cleaning performance. ' +
      'If you\'re having any issues with greasy dishes, residue, or food not coming off, ' +
      'switching to powder and using the pre-wash technique will make an immediate difference.',
  };
}
