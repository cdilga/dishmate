import type { WaterHardness } from './types';

// ============================================
// WATER HARDNESS HELPER TYPES
// ============================================

export type SudsAmount = 'few' | 'some' | 'lots';
export type WaterClarity = 'milky' | 'slightly_cloudy' | 'clear';
export type Confidence = 'low' | 'medium' | 'high';

export interface WaterHardnessTest {
  name: string;
  description: string;
  materials: string[];
  steps: string[];
  interpretationGuide: Record<string, string>;
}

export interface TestResult {
  hardness: WaterHardness;
  confidence: Confidence;
  suggestProfessionalTest: boolean;
  explanation: string;
}

export interface HardnessRecommendations {
  detergentAdjustment: string;
  useSalt: boolean;
  rinseAidSetting: 'low' | 'medium' | 'high' | 'maximum';
  maintenanceFrequency: string;
  firstStep?: string;
  tips: string[];
}

export interface CityHardnessResult {
  city: string;
  hardness: WaterHardness;
  ppmRange?: string;
  source?: string;
  message?: string;
}

export interface HardnessExplanation {
  whatIsIt: string;
  whyItMatters: string[];
  measurementUnits: string[];
  hardnessScale: Record<WaterHardness, { range: string; description: string }>;
}

export interface SymptomEstimate {
  likelyHardness: WaterHardness;
  confidence: Confidence;
  recommendTest: boolean;
  reasoning: string;
}

// ============================================
// WATER HARDNESS TEST
// ============================================

export function getWaterHardnessTest(): WaterHardnessTest {
  return {
    name: 'Soap Bottle Test',
    description: 'A simple home test to estimate your water hardness using dish soap.',
    materials: [
      'Clear plastic bottle with cap (300-500ml)',
      'Tap water from your kitchen',
      'Liquid dish soap (any brand)',
    ],
    steps: [
      'Fill the bottle about 1/3 full with cold tap water.',
      'Add 10 drops of liquid dish soap.',
      'Screw the cap on tightly.',
      'Shake vigorously for 10 seconds.',
      'Let it settle for a moment.',
      'Observe the suds and water clarity.',
    ],
    interpretationGuide: {
      hard: 'Few suds on top, water looks milky or cloudy',
      moderate: 'Some suds, water slightly cloudy',
      soft: 'Lots of fluffy suds, water is clear beneath them',
    },
  };
}

// ============================================
// TEST RESULT INTERPRETATION
// ============================================

export function interpretTestResult(input: {
  sudsAmount: SudsAmount;
  waterClarity: WaterClarity;
}): TestResult {
  const { sudsAmount, waterClarity } = input;

  // Hard water indicators
  if (sudsAmount === 'few' && waterClarity === 'milky') {
    return {
      hardness: 'hard',
      confidence: 'high',
      suggestProfessionalTest: false,
      explanation: 'Few suds and milky water strongly indicate hard water. Minerals are interfering with soap.',
    };
  }

  // Soft water indicators
  if (sudsAmount === 'lots' && waterClarity === 'clear') {
    return {
      hardness: 'soft',
      confidence: 'high',
      suggestProfessionalTest: false,
      explanation: 'Lots of suds and clear water indicate soft water. Soap lathers easily without minerals interfering.',
    };
  }

  // Moderate indicators
  if (sudsAmount === 'some' && waterClarity === 'slightly_cloudy') {
    return {
      hardness: 'moderate',
      confidence: 'medium',
      suggestProfessionalTest: false,
      explanation: 'Moderate suds and slightly cloudy water suggest moderately hard water.',
    };
  }

  // Ambiguous results
  if (
    (sudsAmount === 'some' && waterClarity === 'milky') ||
    (sudsAmount === 'few' && waterClarity === 'slightly_cloudy')
  ) {
    return {
      hardness: 'hard',
      confidence: 'low',
      suggestProfessionalTest: true,
      explanation: 'Results suggest hard water but are not definitive. A professional test would be more accurate.',
    };
  }

  if (
    (sudsAmount === 'some' && waterClarity === 'clear') ||
    (sudsAmount === 'lots' && waterClarity === 'slightly_cloudy')
  ) {
    return {
      hardness: 'moderate',
      confidence: 'low',
      suggestProfessionalTest: true,
      explanation: 'Results are mixed. Your water is likely soft to moderate. Consider a professional test for certainty.',
    };
  }

  // Default moderate
  return {
    hardness: 'moderate',
    confidence: 'low',
    suggestProfessionalTest: true,
    explanation: 'Results are inconclusive. A professional water test is recommended.',
  };
}

// ============================================
// HARDNESS-BASED RECOMMENDATIONS
// ============================================

export function getHardnessRecommendations(hardness: WaterHardness): HardnessRecommendations {
  switch (hardness) {
    case 'hard':
      return {
        detergentAdjustment: 'Increase by 50-100%. Use about double the packet recommendation.',
        useSalt: true,
        rinseAidSetting: 'maximum',
        maintenanceFrequency: 'Monthly cleaning cycles, fortnightly filter check',
        tips: [
          'Fill the salt compartment if your machine has one - this is critical for hard water.',
          'Increase detergent significantly - the packet dose is for average water.',
          'Set rinse aid to maximum to prevent mineral spots.',
          'Run monthly vinegar cleaning cycles to prevent scale buildup.',
          'Consider a water softener if your water is very hard.',
        ],
      };

    case 'soft':
      return {
        detergentAdjustment: 'Reduce by 25-50%. Use less than the packet says.',
        useSalt: false,
        rinseAidSetting: 'low',
        maintenanceFrequency: 'Quarterly cleaning cycles, monthly filter check',
        tips: [
          'Less detergent is better with soft water - excess can etch glasses over time.',
          'Skip the salt compartment - it\'s not needed with soft water.',
          'Use low rinse aid setting - too much can leave residue.',
          'Be careful with delicate glassware - use Delicate cycle.',
          'You may not need pre-wash detergent for light loads.',
        ],
      };

    case 'moderate':
      return {
        detergentAdjustment: 'Use standard packet recommendations.',
        useSalt: true, // Helps in moderate areas
        rinseAidSetting: 'medium',
        maintenanceFrequency: 'Monthly cleaning cycles, monthly filter check',
        tips: [
          'Packet recommendations should work well for you.',
          'Consider using the salt compartment for extra protection.',
          'Medium rinse aid setting is a good starting point.',
          'Adjust based on results - increase detergent if you see spots.',
        ],
      };

    case 'unknown':
    default:
      return {
        detergentAdjustment: 'Start with packet recommendations and adjust based on results.',
        useSalt: true, // Default to using it
        rinseAidSetting: 'medium',
        maintenanceFrequency: 'Monthly cleaning cycles until you know your water',
        firstStep: 'Do the soap bottle test to determine your water hardness.',
        tips: [
          'Test your water hardness first - it affects everything.',
          'Check your local water authority website for hardness data.',
          'Start with medium settings and adjust based on results.',
          'Look for signs: white residue = hard water, over-sudsing = soft water.',
        ],
      };
  }
}

// ============================================
// AUSTRALIAN CITY WATER HARDNESS DATA
// ============================================

const AUSTRALIAN_CITY_HARDNESS: Record<string, { hardness: WaterHardness; ppmRange: string; source: string }> = {
  sydney: {
    hardness: 'soft',
    ppmRange: '40-50 ppm',
    source: 'Sydney Water',
  },
  melbourne: {
    hardness: 'soft',
    ppmRange: '10-40 ppm',
    source: 'Melbourne Water',
  },
  brisbane: {
    hardness: 'moderate',
    ppmRange: '80-120 ppm',
    source: 'Urban Utilities',
  },
  perth: {
    hardness: 'moderate',
    ppmRange: '80-150 ppm',
    source: 'Water Corporation',
  },
  adelaide: {
    hardness: 'hard',
    ppmRange: '150-350 ppm',
    source: 'SA Water',
  },
  hobart: {
    hardness: 'soft',
    ppmRange: '10-30 ppm',
    source: 'TasWater',
  },
  darwin: {
    hardness: 'soft',
    ppmRange: '30-50 ppm',
    source: 'Power and Water',
  },
  canberra: {
    hardness: 'soft',
    ppmRange: '20-40 ppm',
    source: 'Icon Water',
  },
  gold_coast: {
    hardness: 'moderate',
    ppmRange: '80-120 ppm',
    source: 'City of Gold Coast',
  },
  newcastle: {
    hardness: 'soft',
    ppmRange: '40-60 ppm',
    source: 'Hunter Water',
  },
};

export function getAustralianCityHardness(city: string): CityHardnessResult {
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '_');
  const data = AUSTRALIAN_CITY_HARDNESS[normalizedCity];

  if (data) {
    return {
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      hardness: data.hardness,
      ppmRange: data.ppmRange,
      source: data.source,
    };
  }

  return {
    city,
    hardness: 'unknown',
    message: 'City not in our database. Please test your water or check with your local water authority.',
  };
}

// ============================================
// EDUCATIONAL CONTENT
// ============================================

export function getHardnessExplanation(): HardnessExplanation {
  return {
    whatIsIt: 'Water hardness measures the amount of dissolved minerals, primarily calcium and magnesium, in your water supply. These minerals are natural and safe to drink, but affect how well soap and detergent work.',
    whyItMatters: [
      'Hard water reduces detergent effectiveness - minerals bind to cleaning agents.',
      'Minerals can deposit on dishes as white spots or film.',
      'Scale builds up inside your dishwasher over time.',
      'You need more detergent with hard water to get the same cleaning.',
      'Soft water needs less detergent - too much can etch glasses.',
    ],
    measurementUnits: [
      'ppm (parts per million) - same as mg/L',
      'gpg (grains per gallon) - older US unit',
      'German degrees (°dH) - European scale',
      'French degrees (°f) - sometimes used in Australia',
    ],
    hardnessScale: {
      soft: {
        range: '0-60 ppm (0-60 mg/L)',
        description: 'Water lathers easily. Use less detergent to avoid residue.',
      },
      moderate: {
        range: '61-120 ppm (61-120 mg/L)',
        description: 'Average water. Packet detergent recommendations work well.',
      },
      hard: {
        range: '121-180 ppm (121-180 mg/L)',
        description: 'Noticeably hard water. Increase detergent and use salt compartment.',
      },
      unknown: {
        range: 'Not tested',
        description: 'Test your water to get accurate recommendations.',
      },
    },
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getAllHardnessLevels(): WaterHardness[] {
  return ['soft', 'moderate', 'hard', 'unknown'];
}

// ============================================
// SYMPTOM-BASED ESTIMATION
// ============================================

export function estimateHardnessFromSymptoms(input: {
  whiteResidueOnDishes?: boolean;
  cloudyGlasses?: boolean;
  scaleInKettle?: boolean;
  soapLathersEasily?: boolean;
  spottyGlassware?: boolean;
}): SymptomEstimate {
  let hardScore = 0;
  let softScore = 0;
  let totalIndicators = 0;

  if (input.whiteResidueOnDishes !== undefined) {
    totalIndicators++;
    if (input.whiteResidueOnDishes) hardScore += 2;
    else softScore += 1;
  }

  if (input.cloudyGlasses !== undefined) {
    totalIndicators++;
    if (input.cloudyGlasses) hardScore += 1;
  }

  if (input.scaleInKettle !== undefined) {
    totalIndicators++;
    if (input.scaleInKettle) hardScore += 2;
    else softScore += 1;
  }

  if (input.soapLathersEasily !== undefined) {
    totalIndicators++;
    if (input.soapLathersEasily) softScore += 2;
    else hardScore += 1;
  }

  if (input.spottyGlassware !== undefined) {
    totalIndicators++;
    if (input.spottyGlassware) hardScore += 1;
  }

  // Determine hardness
  let likelyHardness: WaterHardness;
  let confidence: Confidence;
  let recommendTest = false;

  if (hardScore >= 4) {
    likelyHardness = 'hard';
    confidence = 'high';
  } else if (hardScore >= 2 && softScore < 2) {
    likelyHardness = 'hard';
    confidence = 'medium';
    recommendTest = true;
  } else if (softScore >= 3) {
    likelyHardness = 'soft';
    confidence = 'medium';
  } else if (softScore >= 1 && hardScore === 0) {
    likelyHardness = 'soft';
    confidence = 'low';
    recommendTest = true;
  } else if (hardScore === softScore || totalIndicators < 2) {
    likelyHardness = 'moderate';
    confidence = 'low';
    recommendTest = true;
  } else {
    likelyHardness = 'moderate';
    confidence = 'low';
    recommendTest = true;
  }

  const reasoning = hardScore >= 4
    ? 'Multiple hard water indicators present: white residue, scale buildup, spotty glassware.'
    : softScore >= 3
      ? 'Soap lathers easily and no mineral buildup observed - typical of soft water.'
      : 'Mixed or limited indicators. A simple test would give more accurate results.';

  return {
    likelyHardness,
    confidence,
    recommendTest,
    reasoning,
  };
}
