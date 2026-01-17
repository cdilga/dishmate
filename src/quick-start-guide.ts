// ============================================
// QUICK START GUIDE - 60-SECOND ONBOARDING
// ============================================

export interface QuickStartSection {
  title: string;
  content: string[];
}

export interface QuickStartGuide {
  title: string;
  subtitle: string;
  sections: QuickStartSection[];
}

export interface OnboardingStep {
  stepNumber: number;
  title: string;
  action: string;
  whyItMatters: string;
}

export interface QuickWin {
  title: string;
  description: string;
  howTo: string;
  expectedResult: string;
}

export interface Mistake {
  mistake: string;
  whyItsWrong: string;
  whatToDoInstead: string;
}

export interface ActionPlan {
  tonight: string[];
  thisWeek: string[];
  ongoing: string[];
}

export interface WashPhase {
  name: string;
  description: string;
  duration: string;
  keyInsight?: string;
}

export interface DishwasherBasics {
  howItWorks: string[];
  phases: WashPhase[];
  detergentRole: string;
  rinseAidRole: string;
}

// ============================================
// QUICK START GUIDE
// ============================================

export function getQuickStartGuide(): QuickStartGuide {
  return {
    title: 'Get Cleaner Dishes in 60 Seconds',
    subtitle: 'Three changes that make an immediate difference',
    sections: [
      {
        title: 'The Pre-Wash Secret',
        content: [
          'Your dishwasher runs a pre-wash before opening the detergent dispenser.',
          'Pods sit closed during this phase - plain water fails to cut grease.',
          'Put 1 tablespoon of powder loose in the door before closing.',
          'This single change fixes most "dishes not clean" problems.',
        ],
      },
      {
        title: 'Stop Pre-Rinsing',
        content: [
          'Don\'t rinse dishes before loading - just scrape off large chunks.',
          'Enzymes in detergent NEED food residue to work on.',
          'Pre-rinsing wastes 20+ litres of water per load.',
          'Dried-on food is fine - enzymes break it down regardless.',
        ],
      },
      {
        title: 'Use the Right Cycle',
        content: [
          'Quick cycle is only for water-marked glasses.',
          'Eco cycle is best for everyday dishes - enzymes need time.',
          'Normal cycle for mixed loads with some grease.',
          'Intensive only for baked-on, burnt, or very greasy items.',
        ],
      },
    ],
  };
}

// ============================================
// ONBOARDING STEPS
// ============================================

export function getOnboardingSteps(): OnboardingStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Switch to Powder',
      action: 'Buy powder detergent instead of pods. Any supermarket brand works.',
      whyItMatters: 'Powder lets you use the pre-wash phase that pods waste completely.',
    },
    {
      stepNumber: 2,
      title: 'Add Pre-Wash Detergent',
      action: 'Put 1 tablespoon of powder loose in the door or tub floor before closing.',
      whyItMatters: 'This dissolves during pre-wash, tackling grease before it can spread.',
    },
    {
      stepNumber: 3,
      title: 'Fill the Dispenser',
      action: 'Put 1.5-2 tablespoons in the dispenser compartment.',
      whyItMatters: 'Fresh detergent for the main wash finishes the cleaning job.',
    },
    {
      stepNumber: 4,
      title: 'Stop Pre-Rinsing',
      action: 'Scrape large chunks into the bin. Load everything else as-is.',
      whyItMatters: 'Enzymes need food residue to work. Rinsing removes what they need.',
    },
    {
      stepNumber: 5,
      title: 'Choose the Right Cycle',
      action: 'Use Eco for most loads, Normal for greasy dishes.',
      whyItMatters: 'Longer cycles give enzymes time to break down food properly.',
    },
  ];
}

// ============================================
// QUICK WIN
// ============================================

export function getQuickWin(): QuickWin {
  return {
    title: 'The One Change That Fixes Most Problems',
    description: 'Add pre-wash detergent. That\'s it. This single technique solves greasy dishes, food residue, and poor cleaning for the majority of users.',
    howTo: 'Put 1 tablespoon of powder loose in the door or on the tub floor before you close the door. Then add 1.5-2 tablespoons in the dispenser as normal. Run Normal or Eco cycle.',
    expectedResult: 'Your greasy dishes will come out clean. The grease that used to remain will be broken down during pre-wash instead of spreading around.',
  };
}

// ============================================
// TOP MISTAKES
// ============================================

export function getTopMistakes(): Mistake[] {
  return [
    {
      mistake: 'Pre-rinsing dishes before loading',
      whyItsWrong: 'Enzymes in detergent need food residue to work on. Rinsing removes what they need and wastes water.',
      whatToDoInstead: 'Scrape large chunks into the bin. Load everything else as-is, even dried-on food.',
    },
    {
      mistake: 'Using pods for all loads',
      whyItsWrong: 'Pods can\'t provide detergent during the pre-wash phase. Grease spreads instead of being cleaned.',
      whatToDoInstead: 'Switch to powder. Add some loose in the door for pre-wash, rest in the dispenser.',
    },
    {
      mistake: 'Using Quick cycle for everything',
      whyItsWrong: 'Quick cycles don\'t give enzymes enough time to break down food. Protein especially needs time.',
      whatToDoInstead: 'Use Eco or Normal for everyday dishes. Save Quick for water-marked glasses only.',
    },
    {
      mistake: 'Not using enough detergent',
      whyItsWrong: 'Packet recommendations assume average water. Hard water needs 50-100% more.',
      whatToDoInstead: 'Test your water hardness. Increase detergent if you have hard water or heavy soil.',
    },
    {
      mistake: 'Ignoring the filter',
      whyItsWrong: 'A clogged filter recirculates dirty water. Nothing comes clean.',
      whatToDoInstead: 'Clean the filter monthly. It takes 2 minutes and is the most important maintenance.',
    },
  ];
}

// ============================================
// IMMEDIATE ACTION PLAN
// ============================================

export function getImmediateActionPlan(): ActionPlan {
  return {
    tonight: [
      'Put 1 tablespoon of powder loose in the door before closing',
      'Put 1.5 tablespoons in the dispenser',
      'Run Normal or Eco cycle (not Quick)',
      'Don\'t rinse dishes - just scrape large chunks',
    ],
    thisWeek: [
      'Buy powder detergent if you\'re using pods',
      'Check and clean the filter (bottom of tub, twist to remove)',
      'Fill the rinse aid dispenser if it\'s low',
      'Test your water hardness with the soap bottle test',
    ],
    ongoing: [
      'Always add pre-wash detergent (loose in door)',
      'Clean filter monthly',
      'Run a vinegar cleaning cycle monthly',
      'Use Eco for most loads - it actually cleans better',
    ],
  };
}

// ============================================
// DISHWASHER BASICS
// ============================================

export function getDishwasherBasics(): DishwasherBasics {
  return {
    howItWorks: [
      'Water sprays from rotating arms, hitting dishes from below and above.',
      'Detergent contains enzymes that break down specific types of food.',
      'Hot water helps dissolve grease and sanitise dishes.',
      'Multiple rinses remove detergent and loosened food.',
      'Final rinse with rinse aid helps water sheet off for drying.',
    ],
    phases: [
      {
        name: 'Pre-Wash',
        description: 'Water sprays to loosen food. Dispenser is CLOSED during this phase.',
        duration: '5-15 minutes',
        keyInsight: 'This is why pods fail - they\'re trapped in the closed dispenser. Loose powder works here.',
      },
      {
        name: 'Main Wash',
        description: 'Dispenser opens, releasing detergent. Hot water and enzymes clean dishes.',
        duration: '20-60 minutes',
      },
      {
        name: 'Rinse Cycles',
        description: 'Clean water removes loosened food and detergent residue.',
        duration: '10-20 minutes',
      },
      {
        name: 'Final Rinse',
        description: 'Hot water rinse with rinse aid. Helps water sheet off for spot-free drying.',
        duration: '5-10 minutes',
      },
      {
        name: 'Drying',
        description: 'Residual heat evaporates water. Some machines use a fan or heating element.',
        duration: '15-30 minutes (varies)',
      },
    ],
    detergentRole: 'Detergent contains surfactants (cut grease), enzymes (break down food), and builders (soften water). The enzymes do most of the cleaning work on protein and starch.',
    rinseAidRole: 'Rinse aid reduces water surface tension so it sheets off dishes instead of beading. This prevents water spots and helps dishes dry faster.',
  };
}
