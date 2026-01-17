import type { WaterHardness } from './types';

// ============================================
// RINSE AID GUIDE TYPES
// ============================================

export type RinseAidSetting = 'low' | 'medium' | 'high' | 'maximum';
export type ItemCategory = 'plastic' | 'glass' | 'ceramic' | 'mixed';
export type SpotCause = 'insufficient_rinse_aid' | 'hard_water_deposits' | 'etching';

export interface RinseAidInput {
  waterHardness: WaterHardness;
  hasSpotIssues: boolean;
  hasDryingIssues: boolean;
  dispenserEmpty?: boolean;
}

export interface RinseAidRecommendation {
  settingRecommendation: RinseAidSetting;
  reasoning: string;
  usageTips: string[];
  urgentActions?: string[];
}

export interface RinseAidExplanation {
  title: string;
  whatItIs: string;
  howItWorks: string[];
  benefits: string[];
  commonMisconceptions: Array<{
    misconception: string;
    truth: string;
  }>;
}

export interface SpotDiagnosis {
  likelyCause: SpotCause;
  solutions: string[];
  isPermanent: boolean;
  preventionTips: string[];
}

// ============================================
// RINSE AID SETTING LOGIC
// ============================================

export function getRinseAidRecommendation(input: RinseAidInput): RinseAidRecommendation {
  const urgentActions: string[] = [];

  if (input.dispenserEmpty) {
    urgentActions.push('Refill rinse aid dispenser immediately');
  }

  // Determine base setting from water hardness
  let setting: RinseAidSetting;
  let reasoning: string;

  if (input.waterHardness === 'hard') {
    setting = 'maximum';
    reasoning = 'With hard water, maximum rinse aid helps prevent mineral deposits from forming as water dries on dishes.';
  } else if (input.waterHardness === 'moderate') {
    setting = input.hasSpotIssues || input.hasDryingIssues ? 'high' : 'medium';
    reasoning = input.hasSpotIssues
      ? 'Moderate water with spot issues benefits from increased rinse aid to help water sheet off.'
      : 'Medium setting works well for moderate water hardness.';
  } else if (input.waterHardness === 'soft') {
    if (input.hasSpotIssues || input.hasDryingIssues) {
      setting = 'medium';
      reasoning = 'Even with soft water, spot or drying issues indicate you could benefit from more rinse aid.';
    } else {
      setting = 'low';
      reasoning = 'Soft water needs less rinse aid. Low setting prevents residue from excess rinse aid.';
    }
  } else {
    // Unknown hardness
    setting = 'medium';
    reasoning = 'Medium is a good starting point until you test your water hardness. Adjust based on results.';
  }

  const usageTips: string[] = [
    'Rinse aid typically lasts 1-2 months before needing refill.',
    'The setting dial is usually on the rinse aid dispenser cap.',
    'If you see blue streaks on dishes, reduce the setting.',
    'Open door slightly after cycle to let steam escape and improve drying.',
  ];

  return {
    settingRecommendation: setting,
    reasoning,
    usageTips,
    urgentActions: urgentActions.length > 0 ? urgentActions : undefined,
  };
}

// ============================================
// EDUCATIONAL CONTENT
// ============================================

export function getRinseAidExplanation(): RinseAidExplanation {
  return {
    title: 'How Rinse Aid Works',
    whatItIs: 'Rinse aid is a surfactant that reduces the surface tension of water, helping it sheet off dishes instead of forming droplets.',
    howItWorks: [
      'Water naturally forms droplets due to surface tension.',
      'Rinse aid breaks this surface tension, making water "sheet" off dishes.',
      'When water sheets off, it takes minerals and residue with it.',
      'Less water remaining on dishes means fewer spots when it dries.',
      'Rinse aid is released during the final rinse, not during washing.',
    ],
    benefits: [
      'Reduces water spots on glasses and cutlery',
      'Improves drying - dishes dry faster and more completely',
      'Prevents mineral deposits from hard water',
      'Helps plastic items dry better (they retain less heat)',
      'Makes unloading easier - no towel-drying needed',
    ],
    commonMisconceptions: [
      {
        misconception: 'Rinse aid is optional if I use pods with "rinse aid included"',
        truth: 'Pod rinse aid is minimal and releases during wash, not the rinse. Fill the dispenser for best results.',
      },
      {
        misconception: 'Rinse aid adds chemicals to my dishes',
        truth: 'Rinse aid is rinsed away with water. The tiny amount remaining evaporates as dishes dry.',
      },
      {
        misconception: 'More rinse aid is always better',
        truth: 'Too much can leave a blue/oily film on dishes. Adjust to your water hardness.',
      },
      {
        misconception: 'I don\'t need rinse aid with soft water',
        truth: 'Even soft water benefits from rinse aid for drying. You just need less of it.',
      },
    ],
  };
}

// ============================================
// DRYING TIPS BY ITEM TYPE
// ============================================

export function getDryingTips(itemCategory: ItemCategory): string[] {
  switch (itemCategory) {
    case 'plastic':
      return [
        'Plastic holds less heat than ceramic or glass, so it doesn\'t dry as well.',
        'Always place plastic on the top rack, away from the heating element.',
        'Plastic containers will likely need a quick hand-dry - this is normal.',
        'Crack the door open after the cycle to let steam escape.',
        'Consider removing plastic items first and letting ceramics/glass dry naturally.',
      ];

    case 'glass':
      return [
        'Glasses should dry well if rinse aid is set correctly.',
        'Angle glasses between tines, not over them, for better water runoff.',
        'Open door slightly after cycle to prevent condensation spots.',
        'If glasses are still spotty, increase rinse aid setting.',
        'For perfect results, unload bottom rack first so drops don\'t fall on glasses below.',
      ];

    case 'ceramic':
      return [
        'Ceramics retain heat well and typically dry fastest.',
        'Angle plates and bowls for water to run off.',
        'Heavy ceramics may have pools in concave areas - tip to drain.',
        'Let the heated dry cycle complete for best results.',
      ];

    case 'mixed':
    default:
      return [
        'Open the door slightly after the cycle to let steam escape.',
        'Unload bottom rack first so drips don\'t fall on dry items below.',
        'Plastic will need a quick wipe - this is normal.',
        'Increase rinse aid if glasses or cutlery still have spots.',
        'Make sure rinse aid dispenser is full for best drying.',
      ];
  }
}

// ============================================
// SPOT DIAGNOSIS
// ============================================

export function diagnoseSpotIssue(input: {
  spotsWipeOff: boolean;
  needsVinegarToRemove?: boolean;
  waterHardness: WaterHardness;
}): SpotDiagnosis {
  if (input.spotsWipeOff) {
    // Water spots - rinse aid issue
    return {
      likelyCause: 'insufficient_rinse_aid',
      isPermanent: false,
      solutions: [
        'Increase rinse aid setting to maximum.',
        'Check rinse aid dispenser is full.',
        'Open door after cycle to let steam escape.',
        'Make sure items are angled for water to run off.',
      ],
      preventionTips: [
        'Keep rinse aid topped up - check monthly.',
        'Set rinse aid dial higher for hard water.',
        'Don\'t overload - items need space for water to drain.',
      ],
    };
  }

  if (input.needsVinegarToRemove) {
    // Hard water deposits
    return {
      likelyCause: 'hard_water_deposits',
      isPermanent: false,
      solutions: [
        'Soak affected items in white vinegar for 15-30 minutes.',
        'Increase detergent amount by 50% for hard water.',
        'Use dishwasher salt if your machine has a salt compartment.',
        'Increase rinse aid to maximum.',
        'Run a cleaning cycle with vinegar to clear machine buildup.',
      ],
      preventionTips: [
        'Address your water hardness - test and adjust detergent.',
        'Fill salt compartment if available.',
        'Monthly vinegar cleaning cycle prevents buildup.',
        'Consider a water softener for severe hard water.',
      ],
    };
  }

  // Etching - permanent damage
  return {
    likelyCause: 'etching',
    isPermanent: true,
    solutions: [
      'Unfortunately, etching is permanent glass damage.',
      'The cloudy surface cannot be removed or restored.',
      'Affected glasses may still be usable but won\'t look clear.',
    ],
    preventionTips: [
      'Use less detergent - excess detergent causes etching over time.',
      'Reduce rinse aid if you have soft water.',
      'Use Delicate cycle for fine glassware.',
      'Hand wash valuable or antique glasses.',
      'Avoid high-temperature cycles for glassware.',
    ],
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getRinseAidSettings(): RinseAidSetting[] {
  return ['low', 'medium', 'high', 'maximum'];
}
