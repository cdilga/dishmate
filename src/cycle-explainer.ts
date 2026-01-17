import type { CycleType, SoilType, ItemType } from './types';

// ============================================
// CYCLE EXPLAINER TYPES
// ============================================

export interface CycleInfo {
  cycle: CycleType;
  name: string;
  duration: string;
  temperature: string;
  description: string;
  howItWorks: string[];
  bestFor: string[];
  notSuitableFor: string[];
  enzymeFriendly: boolean;
  energyUsage: 'low' | 'medium' | 'high';
  waterUsage: 'low' | 'medium' | 'high';
  detergentNotes: string;
}

export interface CycleComparison {
  cycle1: CycleInfo;
  cycle2: CycleInfo;
  recommendation: CycleType;
  reason: string;
}

export interface CycleSelectionGuide {
  question: string;
  options: Array<{
    answer: string;
    recommendedCycle: CycleType;
    reason: string;
  }>;
}

// ============================================
// CYCLE INFORMATION DATABASE
// ============================================

const CYCLE_INFO: Record<CycleType, CycleInfo> = {
  quick: {
    cycle: 'quick',
    name: 'Quick / Express',
    duration: '30-45 minutes',
    temperature: '45-55°C',
    description: 'A short cycle for lightly soiled dishes that need a quick clean.',
    howItWorks: [
      'Skips or shortens the pre-wash phase.',
      'Uses moderate temperature to clean quickly.',
      'Limited enzyme activation time.',
      'Often skips the drying phase.',
    ],
    bestFor: [
      'Recently used dishes with light residue',
      'Glasses and cups with just water marks',
      'Items needed soon for another meal',
      'Lightly soiled plates from light meals',
    ],
    notSuitableFor: [
      'Greasy dishes (grease needs pre-wash detergent)',
      'Protein residue like egg or cheese (needs enzyme time)',
      'Baked-on or dried food',
      'Heavily soiled pots and pans',
    ],
    enzymeFriendly: false,
    energyUsage: 'low',
    waterUsage: 'medium',
    detergentNotes: 'No pre-wash detergent needed. Use less main detergent (about 1 tablespoon) since there\'s less time to rinse.',
  },

  eco: {
    cycle: 'eco',
    name: 'Eco / Energy Saver',
    duration: '2-3 hours',
    temperature: '40-50°C (lower than normal)',
    description: 'An energy-efficient cycle that uses lower temperatures but runs longer, giving enzymes time to work.',
    howItWorks: [
      'Uses lower water temperature to save energy.',
      'Runs much longer to compensate for lower heat.',
      'Extended enzyme activation time for thorough cleaning.',
      'Pre-wash phase included (add detergent to door).',
      'Efficient use of water through multiple short cycles.',
    ],
    bestFor: [
      'Everyday dishes with normal soil',
      'Protein-based residue (eggs, cheese, dairy)',
      'Starchy residue (pasta, rice, potato)',
      'When you have time and want to save energy',
      'Overnight loads',
    ],
    notSuitableFor: [
      'Heavily baked-on or burnt food (needs higher temp)',
      'When you need dishes quickly',
      'Very greasy loads (may need higher temp)',
    ],
    enzymeFriendly: true,
    energyUsage: 'low',
    waterUsage: 'low',
    detergentNotes: 'Add 1 tablespoon pre-wash detergent in the door, 1.5 tablespoons in the dispenser. Enzymes work best in this cycle.',
  },

  normal: {
    cycle: 'normal',
    name: 'Normal / Regular',
    duration: '1-1.5 hours',
    temperature: '55-65°C',
    description: 'The standard cycle that balances cleaning power, time, and efficiency.',
    howItWorks: [
      'Full pre-wash phase (add detergent to door).',
      'Main wash at moderate-high temperature.',
      'Adequate enzyme activation time.',
      'Proper rinse and dry phases.',
    ],
    bestFor: [
      'Mixed loads with various soil levels',
      'Everyday dinner dishes',
      'When you\'re unsure which cycle to use',
      'Most general dishwashing needs',
    ],
    notSuitableFor: [
      'Very lightly soiled items (wastes energy)',
      'Extremely heavy soil (may need intensive)',
      'Delicate items that can\'t handle the heat',
    ],
    enzymeFriendly: true,
    energyUsage: 'medium',
    waterUsage: 'medium',
    detergentNotes: 'Add 1 tablespoon pre-wash detergent in the door, 1.5-2 tablespoons in the dispenser.',
  },

  intensive: {
    cycle: 'intensive',
    name: 'Intensive / Heavy',
    duration: '1.5-2.5 hours',
    temperature: '65-75°C',
    description: 'A powerful cycle with higher temperatures for heavily soiled dishes.',
    howItWorks: [
      'Extended pre-wash phase with higher water volume.',
      'Main wash at high temperature.',
      'Additional wash phases for stubborn soil.',
      'Higher water pressure.',
      'Extended drying with heat.',
    ],
    bestFor: [
      'Baked-on and burnt food',
      'Very greasy pots and pans',
      'Casserole dishes and roasting trays',
      'Sunday roast cleanup',
      'Items that sat overnight with food',
    ],
    notSuitableFor: [
      'Delicate items (high heat can damage)',
      'Plastic containers (may warp)',
      'Lightly soiled items (wastes energy)',
      'Crystal or fine glassware',
    ],
    enzymeFriendly: false, // Too hot for optimal enzyme activity
    energyUsage: 'high',
    waterUsage: 'high',
    detergentNotes: 'Use maximum pre-wash detergent (1.5 tablespoons) and main dose (2.5+ tablespoons). The high temperature does most of the work.',
  },

  delicate: {
    cycle: 'delicate',
    name: 'Delicate / Glass',
    duration: '1-1.5 hours',
    temperature: '40-45°C',
    description: 'A gentle cycle with lower pressure and temperature for fragile items.',
    howItWorks: [
      'Lower water pressure to protect items.',
      'Lower temperature to prevent thermal shock.',
      'Gentler spray patterns.',
      'May skip heated drying to prevent stress.',
    ],
    bestFor: [
      'Fine glassware and crystal',
      'China and porcelain',
      'Wine glasses',
      'Items marked "top rack only"',
      'Antique or valuable dishes',
    ],
    notSuitableFor: [
      'Heavily soiled items',
      'Greasy dishes',
      'Baked-on food',
      'Items that need thorough sanitising',
    ],
    enzymeFriendly: true,
    energyUsage: 'low',
    waterUsage: 'medium',
    detergentNotes: 'Use less detergent (0.5 tablespoon pre-wash, 1 tablespoon main). Too much can leave residue on delicate items.',
  },

  sanitise: {
    cycle: 'sanitise',
    name: 'Sanitise / Hygiene',
    duration: '1.5-2 hours',
    temperature: '70-80°C (final rinse)',
    description: 'A high-temperature cycle designed to kill bacteria and germs.',
    howItWorks: [
      'Normal wash phases.',
      'Final rinse at very high temperature (70°C+).',
      'Extended high-temperature phase to sanitise.',
      'Hot air drying.',
    ],
    bestFor: [
      'Baby bottles and feeding equipment',
      'Chopping boards (especially after raw meat)',
      'Items used by someone who was sick',
      'Pet bowls',
      'When hygiene is the top priority',
    ],
    notSuitableFor: [
      'Plastic items (will warp)',
      'Delicate glassware',
      'Items not rated for high temperatures',
      'Everyday loads (wastes energy)',
    ],
    enzymeFriendly: false, // Final temperature kills enzymes
    energyUsage: 'high',
    waterUsage: 'medium',
    detergentNotes: 'Standard detergent amounts. The high temperature does the sanitising work.',
  },
};

// ============================================
// CYCLE INFORMATION API
// ============================================

export function getCycleInfo(cycle: CycleType): CycleInfo {
  return { ...CYCLE_INFO[cycle] };
}

export function getAllCycles(): CycleInfo[] {
  return Object.values(CYCLE_INFO).map(info => ({ ...info }));
}

export function compareCycles(cycle1: CycleType, cycle2: CycleType): CycleComparison {
  const info1 = CYCLE_INFO[cycle1];
  const info2 = CYCLE_INFO[cycle2];

  // Determine recommendation based on general use
  let recommendation: CycleType;
  let reason: string;

  // Quick vs Eco
  if ((cycle1 === 'quick' && cycle2 === 'eco') || (cycle1 === 'eco' && cycle2 === 'quick')) {
    recommendation = 'eco';
    reason = 'Eco is better for cleaning because it gives enzymes time to work. Quick should only be used for very lightly soiled items when time is critical.';
  }
  // Quick vs Normal
  else if ((cycle1 === 'quick' && cycle2 === 'normal') || (cycle1 === 'normal' && cycle2 === 'quick')) {
    recommendation = 'normal';
    reason = 'Normal provides better cleaning for most loads. Quick often leaves residue on anything beyond water-marked glasses.';
  }
  // Eco vs Normal
  else if ((cycle1 === 'eco' && cycle2 === 'normal') || (cycle1 === 'normal' && cycle2 === 'eco')) {
    recommendation = 'eco';
    reason = 'For everyday loads, Eco saves energy while cleaning just as well (or better) thanks to longer enzyme time. Use Normal when you need dishes faster.';
  }
  // Normal vs Intensive
  else if ((cycle1 === 'normal' && cycle2 === 'intensive') || (cycle1 === 'intensive' && cycle2 === 'normal')) {
    recommendation = 'normal';
    reason = 'Normal handles most loads well. Only use Intensive for heavily baked-on or burnt food - it uses significantly more energy.';
  }
  // Delicate vs Normal
  else if ((cycle1 === 'delicate' && cycle2 === 'normal') || (cycle1 === 'normal' && cycle2 === 'delicate')) {
    recommendation = 'normal';
    reason = 'Normal is suitable for most items. Only use Delicate for fine glassware, crystal, or china that could be damaged by regular cycles.';
  }
  // Default comparison
  else {
    // Generally prefer lower energy options
    const energyOrder = { low: 1, medium: 2, high: 3 };
    if (energyOrder[info1.energyUsage] <= energyOrder[info2.energyUsage]) {
      recommendation = cycle1;
      reason = `${info1.name} uses less energy while providing adequate cleaning for most loads.`;
    } else {
      recommendation = cycle2;
      reason = `${info2.name} uses less energy while providing adequate cleaning for most loads.`;
    }
  }

  return {
    cycle1: { ...info1 },
    cycle2: { ...info2 },
    recommendation,
    reason,
  };
}

// ============================================
// CYCLE SELECTION GUIDANCE
// ============================================

export function getCycleForSoilType(soilType: SoilType): { cycle: CycleType; reason: string } {
  switch (soilType) {
    case 'light':
      return {
        cycle: 'quick',
        reason: 'Light soil only needs a quick wash - saves time and energy.',
      };
    case 'everyday':
      return {
        cycle: 'eco',
        reason: 'Everyday soil cleans well in Eco mode - enzymes handle it with time.',
      };
    case 'starchy':
      return {
        cycle: 'eco',
        reason: 'Starch dissolves well with enzyme time. Eco\'s longer cycle is perfect.',
      };
    case 'protein':
      return {
        cycle: 'eco',
        reason: 'Protein needs enzyme time to break down. Eco\'s long, low-temp cycle is ideal.',
      };
    case 'acidic':
      return {
        cycle: 'normal',
        reason: 'Acidic foods can stain if left too long. Normal cycle runs faster to prevent this.',
      };
    case 'greasy':
      return {
        cycle: 'normal',
        reason: 'Grease needs heat to emulsify. Normal\'s higher temperature handles it well.',
      };
    case 'heavy':
      return {
        cycle: 'intensive',
        reason: 'Baked-on and burnt food needs the high temperature of Intensive cycle.',
      };
    default:
      return {
        cycle: 'normal',
        reason: 'Normal cycle is a good default for unknown soil types.',
      };
  }
}

export function getCycleForItemType(itemType: ItemType): { cycle: CycleType; reason: string } {
  switch (itemType) {
    case 'delicate':
      return {
        cycle: 'delicate',
        reason: 'Delicate items need lower pressure and temperature to prevent damage.',
      };
    case 'baby_items':
      return {
        cycle: 'sanitise',
        reason: 'Baby items benefit from the high-temperature sanitise cycle to kill germs.',
      };
    case 'containers':
      return {
        cycle: 'normal',
        reason: 'Plastic containers should avoid high heat. Normal is hot enough to clean but won\'t warp.',
      };
    case 'pots':
    case 'pans':
    case 'bakeware':
      return {
        cycle: 'intensive',
        reason: 'Cookware often has heavy soil. Intensive handles baked-on residue best.',
      };
    case 'glasses':
      return {
        cycle: 'normal',
        reason: 'Regular glasses are fine in Normal. Use Delicate only for fine crystal or wine glasses.',
      };
    default:
      return {
        cycle: 'normal',
        reason: 'Normal cycle works well for most dish types.',
      };
  }
}

// ============================================
// EDUCATIONAL CONTENT
// ============================================

export interface CycleEducation {
  title: string;
  content: string;
  keyTakeaway: string;
}

export function getEnzymeExplanation(): CycleEducation {
  return {
    title: 'How Enzymes Work in Your Dishwasher',
    content: `Dishwasher detergent contains enzymes - biological catalysts that break down specific types of food residue:

• PROTEASES break down protein (eggs, cheese, meat, dairy)
• AMYLASES break down starch (pasta, rice, potato, bread)
• LIPASES break down fats and oils

Enzymes work best at moderate temperatures (40-55°C) and need TIME to work. This is why:
- ECO cycles run longer at lower temps - giving enzymes maximum working time
- QUICK cycles often leave residue - not enough time for enzymes to work
- INTENSIVE cycles use high heat instead of enzymes - temperature does the cleaning

The practical takeaway: For protein and starch residue, ECO cycle often cleans BETTER than shorter, hotter cycles because it gives enzymes the time they need.`,
    keyTakeaway: 'Longer isn\'t slower cleaning - it\'s smarter cleaning. Enzymes need time, not heat.',
  };
}

export function getPrewashExplanation(): CycleEducation {
  return {
    title: 'Why Pre-Wash Detergent Matters',
    content: `Every dishwasher runs a PRE-WASH phase before the main cycle. This is when:
- Water sprays to loosen food
- The detergent DISPENSER is still CLOSED

If you use pods or tablets, they sit in the closed dispenser during this entire phase. The pre-wash uses only plain water - no cleaning power.

With POWDER, you can put some loose in the door or tub floor. This powder:
- Dissolves immediately when water hits
- Provides cleaning power during pre-wash
- Tackles grease before it can spread

This is why powder often cleans greasy dishes better than pods - it's not better detergent, it's using the pre-wash phase that pods waste.`,
    keyTakeaway: 'Add 1-1.5 tablespoons of powder loose in the door for pre-wash. The rest goes in the dispenser.',
  };
}

export function getTemperatureExplanation(): CycleEducation {
  return {
    title: 'Understanding Cycle Temperatures',
    content: `Different temperatures serve different purposes:

40-50°C (ECO, DELICATE):
- Optimal for enzyme activity
- Gentle on plastics and delicates
- Saves energy
- Needs longer time to clean

55-65°C (NORMAL):
- Good balance of enzyme activity and cleaning power
- Effective on most soil types
- Standard energy usage

65-75°C (INTENSIVE):
- High temperature does most cleaning
- Enzymes become less effective
- Good for baked-on, burnt food
- Uses more energy

70-80°C (SANITISE final rinse):
- Kills bacteria and germs
- Can damage plastics
- Reserved for hygiene needs

The takeaway: Higher temperature isn't always better. For everyday dishes, moderate temps with good enzyme time often clean better than short, hot cycles.`,
    keyTakeaway: 'Match the temperature to your soil type. Protein needs time (Eco), baked-on needs heat (Intensive).',
  };
}

export function getAllEducationalContent(): CycleEducation[] {
  return [
    getEnzymeExplanation(),
    getPrewashExplanation(),
    getTemperatureExplanation(),
  ];
}
