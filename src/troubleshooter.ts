import type {
  TroubleshootCategory,
  TroubleshootSolution,
  DiagnosisStep,
} from './types';

// ============================================
// CATEGORY DEFINITIONS
// ============================================

export const TROUBLESHOOT_CATEGORIES: Record<TroubleshootCategory, { label: string; description: string }> = {
  white_residue: {
    label: 'White residue or film',
    description: 'White marks, film, or powdery deposits on dishes',
  },
  cloudy_glasses: {
    label: 'Cloudy glasses',
    description: 'Glasses look foggy, hazy, or clouded',
  },
  food_stuck: {
    label: 'Food still stuck on',
    description: 'Food particles remain after the cycle',
  },
  greasy_feeling: {
    label: 'Greasy or slimy feeling',
    description: 'Dishes feel oily or have a residue',
  },
  spots: {
    label: 'Spots on glasses or cutlery',
    description: 'Water spots or marks on glassware and metal',
  },
  bad_smell: {
    label: 'Bad smell inside machine',
    description: 'Unpleasant odour from the dishwasher',
  },
  not_drying: {
    label: 'Dishes not drying',
    description: 'Dishes still wet after cycle completes',
  },
  other: {
    label: 'Something else',
    description: 'Other problems not listed above',
  },
};

// ============================================
// SOLUTIONS DATABASE
// ============================================

const SOLUTIONS: Record<string, TroubleshootSolution> = {
  hard_water_confirmed: {
    title: 'Hard Water Deposits',
    summary: 'Your water is leaving mineral scale on dishes.',
    steps: [
      'INCREASE DETERGENT: Hard water needs 50-100% more than the packet says. Try doubling your current amount.',
      'CHECK RINSE AID: Fill the dispenser and set to maximum. Rinse aid prevents minerals from sticking.',
      'USE THE SALT COMPARTMENT: If your machine has one (check bottom of tub), fill it. This softens water during the wash.',
      'MONTHLY CLEAN: Run empty cycle with 2 cups white vinegar. Dissolves built-up scale inside the machine.',
    ],
    tips: [
      'Hard water is the #1 cause of dishwasher problems.',
      'Once you adjust for it, everything improves.',
    ],
    productRecommendation: 'Try our hard-water formula powder',
  },

  soft_water_residue: {
    title: 'Detergent Residue (Soft Water)',
    summary: 'You may be using too much detergent for soft water.',
    steps: [
      'REDUCE DETERGENT: Soft water needs less detergent. Try halving your current amount.',
      'CHECK RINSE AID: Make sure rinse aid is filled - it helps rinse away detergent.',
      'RUN HOTTER: If your machine has a temp boost option, try it.',
    ],
    tips: [
      'Soft water is great for cleaning but detergent can leave residue.',
      'Less is more with soft water.',
    ],
  },

  test_water_hardness: {
    title: "Let's Test Your Water",
    summary: 'Quick home test to determine your water hardness.',
    steps: [
      'Fill a clear bottle 1/3 with tap water',
      'Add 10 drops of dish soap',
      'Shake vigorously for 10 seconds',
      'Look at the result: Few suds + milky water = HARD. Some suds + slightly cloudy = MODERATE. Lots of suds + clear water = SOFT.',
    ],
    tips: [
      'You can also check with your water provider.',
      'In Australia, most capital cities have soft to moderate water.',
    ],
  },

  pod_not_dissolving: {
    title: 'Pod/Tablet Not Dissolving Properly',
    summary: "The coating isn't fully breaking down.",
    steps: [
      'CHECK DISPENSER: Make sure the dispenser door opens freely. Food or utensils may be blocking it.',
      "CHECK WATER TEMPERATURE: Pods need hot water to dissolve. Make sure your water heater is set to 50°C+.",
      'STORE PODS DRY: Store pods in dry place, handle with dry hands. Moisture makes the coating sticky.',
      'USE LONGER CYCLES: Quick/Express cycles may not give pods enough time. Use Normal or longer cycles with pods.',
    ],
    tips: [
      'BETTER SOLUTION: Switch to powder. Powder dissolves instantly and lets you add detergent to pre-wash (pods can\'t do this).',
    ],
    productRecommendation: 'Try our powder - fixes pod problems',
  },

  powder_not_rinsing: {
    title: 'Powder Not Rinsing Away',
    summary: 'Powder residue is being left behind.',
    steps: [
      'REDUCE AMOUNT: You might be using too much. Start with 1-1.5 tablespoons and adjust.',
      'CHECK WATER TEMP: Cold water doesn\'t dissolve powder well. Run hot tap before starting.',
      'CHECK SPRAY ARMS: Remove and clean spray arms - blocked holes mean less rinsing power.',
      'ADD RINSE AID: Helps water sheet off and takes residue with it.',
    ],
    tips: [
      'Pre-dissolving powder in warm water before adding can help in cold climates.',
    ],
  },

  gel_residue: {
    title: 'Gel/Liquid Detergent Residue',
    summary: 'Gel detergents can leave a smeary film.',
    steps: [
      'SWITCH TO POWDER: Gel detergents often lack enzymes and can leave residue. Powder is more effective.',
      'USE LESS: If sticking with gel, try using less.',
      'RUN HOTTER: Higher temperatures help gel rinse away.',
    ],
    tips: [
      'Gel and liquid detergents are generally less effective than powder.',
      'They lack the enzymes that break down protein and starch.',
    ],
    productRecommendation: 'Our enzyme-rich powder outperforms gels',
  },

  water_access_issue: {
    title: "Water Isn't Reaching Inside",
    summary: 'Concave items trap air bubbles that block water.',
    steps: [
      'ANGLE EVERYTHING: Bowls, cups, and mugs should tilt toward the spray arm, not sit upright.',
      'FACE THE SPRAY ARM: Items should tilt toward where water comes from (usually centre/bottom).',
      "DON'T NEST: Each item needs its own water access. Overlapping bowls = inner bowl stays dirty.",
      'CHECK SPRAY ARM: Tall items on bottom rack can block it. Spin it by hand before closing door.',
    ],
    tips: [
      'The most common loading mistake is putting bowls and cups straight up.',
      'Angling is the key to clean concave items.',
    ],
  },

  cycle_too_weak: {
    title: 'Cycle Too Weak for Baked-On Food',
    summary: 'Quick cycles can\'t handle heavy soil.',
    steps: [
      'USE INTENSIVE CYCLE: Baked-on and burnt food needs the extra time and temperature.',
      'ADD PRE-WASH DETERGENT: Put 1-1.5 tablespoons loose in the door before closing.',
      'SOAK FIRST: For really burnt items, soak in hot water + detergent for 30 mins before loading.',
      'SCRAPE THE WORST: Remove large burnt chunks, but leave the rest for enzymes.',
    ],
    tips: [
      'Intensive cycle uses more energy but is necessary for heavy soil.',
      'Pre-wash detergent is critical for baked-on messes.',
    ],
  },

  no_prewash_detergent: {
    title: 'Grease Needs Pre-Wash Detergent',
    summary: 'Your dishwasher runs a pre-wash before opening the detergent dispenser.',
    steps: [
      'USE POWDER INSTEAD OF PODS: Powder lets you add detergent to the pre-wash phase.',
      'PUT SOME IN THE DOOR: Add 1-1.5 tablespoons loose in the door or tub before closing.',
      'REST IN DISPENSER: Put the remainder in the dispenser as normal.',
    ],
    tips: [
      'Pods sit in the closed dispenser during pre-wash - that whole phase uses only water.',
      'Grease doesn\'t dissolve in plain water - it just moves around and redeposits.',
      'The loose powder cleans during pre-wash, the dispenser powder finishes the job.',
    ],
    productRecommendation: 'Our powder fixes greasy dish problems',
  },

  loading_issue: {
    title: 'Loading or Detergent Issue',
    summary: 'Everyday food should clean easily - something else is wrong.',
    steps: [
      'CHECK LOADING: Make sure items aren\'t blocking each other or the spray arms.',
      'CHECK DETERGENT AMOUNT: You might need more, especially if you have hard water.',
      'USE PRE-WASH DETERGENT: Add some loose powder in the door.',
      'CHECK FILTER: A clogged filter recirculates dirty water.',
    ],
    tips: [
      'The three keys: proper loading, enough detergent, clean filter.',
    ],
  },

  needs_enzyme_time: {
    title: 'Protein Needs Time to Break Down',
    summary: 'Egg, cheese, meat, and dairy residue need enzymes plus time.',
    steps: [
      'USE LONGER CYCLES: Normal (1+ hour) or Eco (2-3 hours) give enzymes time to work.',
      "DON'T PRE-RINSE PROTEIN: Counter-intuitive, but dried egg/cheese is fine. Enzymes need the protein there to work on.",
      'ECO MODE IS YOUR FRIEND: It runs longer at lower temps - perfect for enzyme action.',
      'USE QUALITY DETERGENT: Cheap detergents skimp on enzymes. Quality powder has proteases and amylases.',
    ],
    tips: [
      'Very short cycles blast with hot water but skip enzyme time.',
      'Eco cycle often cleans protein better than hotter, shorter cycles.',
    ],
  },

  fundamental_problem: {
    title: "Something's Wrong with the Basics",
    summary: 'If nothing is coming out clean, check these fundamentals.',
    steps: [
      'IS THE FILTER CLOGGED? A clogged filter means dirty water recirculates. Check bottom of tub, twist and remove filter, clean under running water.',
      'ARE THE SPRAY ARMS BLOCKED? Remove spray arms (usually twist off), check holes aren\'t clogged, rinse and poke with toothpick.',
      'IS WATER ENTERING? Start a cycle and listen - you should hear filling. Open mid-cycle (carefully) - is there water?',
      'IS DISPENSER OPENING? Check dispenser door isn\'t blocked by dishes. Look for detergent residue (sign it\'s not opening).',
      'IS WATER HOT ENOUGH? Run hot tap near dishwasher - is it hot? Cold water = nothing dissolves properly.',
    ],
    tips: [
      'If you\'ve checked all these and it\'s still not working, the machine may need professional service.',
    ],
  },

  loading_spray_issue: {
    title: 'Loading or Spray Pattern Issue',
    summary: 'Random dirty spots suggest water isn\'t reaching everywhere.',
    steps: [
      'CHECK FOR BLOCKING: A tall item may be blocking the spray arm from rotating freely.',
      'SPIN THE SPRAY ARM: Before closing, spin it by hand to make sure nothing blocks it.',
      "DON'T OVERLOAD: Packed loads mean some items get missed.",
      'CHECK SPRAY ARM HOLES: Remove and clean - debris blocks water distribution.',
    ],
    tips: [
      'Random dirty items are almost always a loading or spray arm problem.',
    ],
  },

  dirty_filter: {
    title: 'Your Filter Needs Cleaning',
    summary: 'Food particles collect in the filter and decompose. This is the #1 cause of dishwasher smell.',
    steps: [
      'Remove bottom rack',
      'Find filter (usually centre-bottom of tub)',
      'Twist counter-clockwise and lift out',
      'Rinse under hot running water',
      'Scrub mesh with soft brush (old toothbrush works great)',
      'Check for trapped debris underneath',
      'Replace and twist to lock',
    ],
    tips: [
      'Do this monthly - more often if you don\'t scrape plates before loading.',
    ],
  },

  drainage_issue: {
    title: 'Drainage Issue',
    summary: 'The smell right after a cycle suggests water isn\'t draining properly.',
    steps: [
      'CHECK DRAIN HOSE: Make sure it\'s not kinked or blocked.',
      'CHECK GARBAGE DISPOSAL: If connected, make sure the disposal knockout plug was removed.',
      'RUN DISPOSAL FIRST: If connected to disposal, run the disposal before starting dishwasher.',
      'CHECK FILTER: A clogged filter can cause drainage issues too.',
    ],
    tips: [
      'The drain hose should have a high loop or air gap to prevent backflow.',
    ],
  },

  stagnant_water_mould: {
    title: 'Moisture Is Building Up',
    summary: 'When the dishwasher sits unused, trapped moisture grows mould and bacteria.',
    steps: [
      'LEAVE DOOR AJAR: After cycles, crack it open a few centimetres to let moisture escape.',
      'RUN A CLEANING CYCLE: Empty machine, hottest cycle, with 2 cups white vinegar in a bowl on top rack (or commercial cleaner).',
      'CHECK DOOR SEAL: Wipe the rubber gasket with vinegar solution. Mould hides in the folds.',
      'CLEAN SPRAY ARM HOLES: Bacteria can grow inside blocked holes. Remove arms, soak in vinegar, clear holes.',
    ],
    tips: [
      'Run at least one cycle per week.',
      'Always leave door ajar after use.',
      'Monthly vinegar cleaning cycle prevents build-up.',
    ],
  },

  deep_contamination: {
    title: 'Deep Cleaning Needed',
    summary: 'Persistent smell indicates bacteria or mould deep in the system.',
    steps: [
      'CLEAN THE FILTER: See filter cleaning instructions.',
      'CLEAN THE SPRAY ARMS: Remove, soak in vinegar, clear all holes.',
      'CLEAN DOOR EDGES AND SEAL: Wipe all rubber gaskets with vinegar, pull back folds to clean inside.',
      'RUN VINEGAR CYCLE: 2 cups white vinegar in bowl on top rack, hottest cycle, empty machine.',
      'FOLLOW WITH BICARB CYCLE: Sprinkle 1 cup bicarb on bottom, run short hot cycle.',
    ],
    tips: [
      'This deep clean should eliminate most smells.',
      'If it persists, there may be a drainage or mould issue requiring professional help.',
    ],
  },

  other_smell: {
    title: 'Other Smell Sources',
    summary: 'The smell may be coming from somewhere unexpected.',
    steps: [
      'CHECK UNDER THE MACHINE: Water or food may have dripped underneath.',
      'CHECK THE DRAIN CONNECTION: The drain hose may have a crack or poor seal.',
      'CHECK FOR MOULD ELSEWHERE: Mould under the sink can smell like it\'s from the dishwasher.',
    ],
    tips: [
      'Sometimes the smell isn\'t actually from inside the machine.',
    ],
  },

  // Cloudy glasses solutions
  cloudy_etching: {
    title: 'Glass Etching (Permanent Damage)',
    summary: 'If the cloudiness doesn\'t wipe off with vinegar, the glass is etched.',
    steps: [
      'TEST IT: Soak in white vinegar for 5 minutes. If cloudiness remains, it\'s etching.',
      'PREVENT FUTURE DAMAGE: Use delicate cycle for fine glassware.',
      'REDUCE DETERGENT: Too much detergent can cause etching over time.',
      'HAND WASH VALUABLES: Some glasses shouldn\'t go in the dishwasher at all.',
    ],
    tips: [
      'Etching is permanent - the glass surface is actually damaged.',
      'Soft water + too much detergent + high heat = etching risk.',
    ],
  },

  cloudy_deposits: {
    title: 'Mineral Deposits on Glasses',
    summary: 'The cloudiness is hard water minerals - this can be fixed.',
    steps: [
      'SOAK IN VINEGAR: Soak cloudy glasses in white vinegar for 15-30 minutes, then wash.',
      'INCREASE RINSE AID: Set to maximum, make sure dispenser is full.',
      'ADD DISHWASHER SALT: If your machine has a salt compartment, use it.',
      'INCREASE DETERGENT: Hard water needs more detergent to prevent deposits.',
    ],
    tips: [
      'Unlike etching, mineral deposits can be removed and prevented.',
    ],
  },

  // Spots solutions
  water_spots: {
    title: 'Water Spots',
    summary: 'Spots form when water droplets dry on the surface.',
    steps: [
      'INCREASE RINSE AID: Rinse aid helps water sheet off instead of beading.',
      'SET RINSE AID TO MAX: The dial is usually on the dispenser lid.',
      'USE HEATED DRY: If your machine has it, heated drying evaporates water before spots form.',
      'OPEN DOOR AFTER CYCLE: Let steam escape to prevent condensation spots.',
    ],
    tips: [
      'Rinse aid is the main solution for water spots.',
    ],
  },

  // Not drying solutions
  not_drying_tips: {
    title: 'Dishes Not Drying',
    summary: 'Plastics especially struggle to dry.',
    steps: [
      'INCREASE RINSE AID: Rinse aid helps water sheet off.',
      'USE HEATED DRY: If your machine has it, enable it.',
      'PLASTIC ON TOP RACK: Plastic holds less heat so dries worse. Keep it away from heating element.',
      'OPEN DOOR AFTER CYCLE: Let steam escape and air circulate.',
      'CRACK DOOR DURING DRYING PHASE: If your machine allows, open slightly for the last 15 minutes.',
    ],
    tips: [
      'Plastic will never dry as well as ceramic or glass.',
      'Modern eco-friendly machines often skip heated drying - opening the door helps.',
    ],
  },

  // Greasy feeling
  greasy_dishes: {
    title: 'Dishes Feel Greasy',
    summary: 'Grease isn\'t being properly emulsified during the wash.',
    steps: [
      'ADD PRE-WASH DETERGENT: Put 1-1.5 tablespoons loose in the door. This is critical for grease.',
      'USE HOTTER CYCLE: Grease needs heat to emulsify. Use Normal or Intensive instead of Quick.',
      'DON\'T PRE-RINSE: Grease on dishes actually helps the detergent work.',
      'CHECK WATER TEMPERATURE: Run hot tap first to make sure you\'re getting hot water.',
    ],
    tips: [
      'The #1 cause of greasy dishes is no pre-wash detergent.',
      'Pods can\'t help with pre-wash - switch to powder.',
    ],
    productRecommendation: 'Our powder fixes greasy dish problems',
  },
};

// ============================================
// DECISION TREE STEPS
// ============================================

const STEPS: Record<string, DiagnosisStep> = {
  // Initial question
  start: {
    id: 'start',
    question: "What's the problem?",
    options: [
      { label: 'White residue or film on dishes', value: 'white_residue' },
      { label: 'Cloudy glasses', value: 'cloudy_glasses' },
      { label: 'Food still stuck on', value: 'food_stuck' },
      { label: 'Greasy or slimy feeling', value: 'greasy_feeling' },
      { label: 'Spots on glasses or cutlery', value: 'spots' },
      { label: 'Bad smell inside machine', value: 'bad_smell' },
      { label: 'Dishes not drying', value: 'not_drying' },
      { label: 'Something else', value: 'other' },
    ],
  },

  // WHITE RESIDUE BRANCH
  white_residue_start: {
    id: 'white_residue_start',
    question: 'Touch the residue. Is it...',
    options: [
      { label: 'Powdery/chalky (wipes off easily)', value: 'powdery', nextStep: 'white_residue_water' },
      { label: 'Smeary/greasy (needs scrubbing)', value: 'smeary', nextStep: 'white_residue_detergent' },
    ],
  },

  white_residue_water: {
    id: 'white_residue_water',
    question: 'Do you know if you have hard water?',
    options: [
      { label: 'Yes, I have hard water', value: 'yes_hard' },
      { label: 'No, my water is soft', value: 'no_soft' },
      { label: "I don't know", value: 'unknown' },
    ],
  },

  white_residue_detergent: {
    id: 'white_residue_detergent',
    question: 'What detergent are you using?',
    options: [
      { label: 'Pods/tablets', value: 'pods' },
      { label: 'Powder', value: 'powder' },
      { label: 'Liquid/gel', value: 'liquid' },
    ],
  },

  // FOOD STUCK BRANCH
  food_stuck_start: {
    id: 'food_stuck_start',
    question: 'Where is the food stuck?',
    options: [
      { label: 'Inside bowls, cups, or mugs', value: 'concave' },
      { label: 'On flat surfaces (plates, pan bottoms)', value: 'flat', nextStep: 'food_stuck_type' },
      { label: 'Everywhere - nothing is clean', value: 'everywhere' },
      { label: 'Random spots on random items', value: 'random' },
    ],
  },

  food_stuck_type: {
    id: 'food_stuck_type',
    question: 'What kind of food?',
    options: [
      { label: 'Baked-on / burnt', value: 'baked' },
      { label: 'Greasy residue', value: 'greasy' },
      { label: 'Dried sauce / everyday food', value: 'everyday' },
      { label: 'Egg / cheese / protein', value: 'protein' },
    ],
  },

  // BAD SMELL BRANCH
  bad_smell_start: {
    id: 'bad_smell_start',
    question: 'When did you last clean the filter?',
    options: [
      { label: "Never / I don't know where it is", value: 'never' },
      { label: 'Recently (within a month)', value: 'recently', nextStep: 'bad_smell_timing' },
      { label: 'I clean it regularly', value: 'regularly', nextStep: 'bad_smell_timing' },
    ],
  },

  bad_smell_timing: {
    id: 'bad_smell_timing',
    question: 'Does the smell happen...',
    options: [
      { label: 'Right after a cycle', value: 'after_cycle' },
      { label: 'When you open the door after days unused', value: 'after_unused' },
      { label: 'All the time', value: 'always' },
    ],
  },

  // CLOUDY GLASSES BRANCH
  cloudy_glasses_start: {
    id: 'cloudy_glasses_start',
    question: 'Soak a cloudy glass in white vinegar for 5 minutes. Does the cloudiness...',
    options: [
      { label: 'Disappear or reduce (deposits)', value: 'deposits' },
      { label: 'Stay the same (etching)', value: 'etching' },
    ],
  },

  // SPOTS BRANCH
  spots_start: {
    id: 'spots_start',
    question: 'Where are the spots appearing?',
    options: [
      { label: 'On glasses', value: 'glasses' },
      { label: 'On cutlery/silverware', value: 'cutlery' },
      { label: 'On everything', value: 'everything' },
    ],
  },

  // NOT DRYING BRANCH
  not_drying_start: {
    id: 'not_drying_start',
    question: 'What items are not drying?',
    options: [
      { label: 'Plastic items', value: 'plastic' },
      { label: 'Everything', value: 'everything' },
      { label: 'Only some items', value: 'some' },
    ],
  },

  // GREASY FEELING BRANCH
  greasy_feeling_start: {
    id: 'greasy_feeling_start',
    question: 'Are you using pods or powder?',
    options: [
      { label: 'Pods/tablets', value: 'pods' },
      { label: 'Powder', value: 'powder' },
    ],
  },

  // OTHER
  other_start: {
    id: 'other_start',
    question: 'Can you describe the problem?',
    options: [
      { label: 'Machine makes strange noises', value: 'noises' },
      { label: 'Cycle takes too long', value: 'too_long' },
      { label: "Machine won't start", value: 'wont_start' },
      { label: 'Water leaking', value: 'leaking' },
    ],
  },
};

// ============================================
// ANSWER -> SOLUTION MAPPING
// ============================================

const ANSWER_TO_SOLUTION: Record<string, string> = {
  // White residue
  'white_residue_water:yes_hard': 'hard_water_confirmed',
  'white_residue_water:no_soft': 'soft_water_residue',
  'white_residue_water:unknown': 'test_water_hardness',
  'white_residue_detergent:pods': 'pod_not_dissolving',
  'white_residue_detergent:powder': 'powder_not_rinsing',
  'white_residue_detergent:liquid': 'gel_residue',

  // Food stuck
  'food_stuck_start:concave': 'water_access_issue',
  'food_stuck_start:everywhere': 'fundamental_problem',
  'food_stuck_start:random': 'loading_spray_issue',
  'food_stuck_type:baked': 'cycle_too_weak',
  'food_stuck_type:greasy': 'no_prewash_detergent',
  'food_stuck_type:everyday': 'loading_issue',
  'food_stuck_type:protein': 'needs_enzyme_time',

  // Bad smell
  'bad_smell_start:never': 'dirty_filter',
  'bad_smell_timing:after_cycle': 'drainage_issue',
  'bad_smell_timing:after_unused': 'stagnant_water_mould',
  'bad_smell_timing:always': 'deep_contamination',

  // Cloudy glasses
  'cloudy_glasses_start:deposits': 'cloudy_deposits',
  'cloudy_glasses_start:etching': 'cloudy_etching',

  // Spots
  'spots_start:glasses': 'water_spots',
  'spots_start:cutlery': 'water_spots',
  'spots_start:everything': 'water_spots',

  // Not drying
  'not_drying_start:plastic': 'not_drying_tips',
  'not_drying_start:everything': 'not_drying_tips',
  'not_drying_start:some': 'not_drying_tips',

  // Greasy
  'greasy_feeling_start:pods': 'greasy_dishes',
  'greasy_feeling_start:powder': 'greasy_dishes',
};

// ============================================
// PUBLIC API
// ============================================

export function getInitialQuestion(): DiagnosisStep {
  return STEPS.start;
}

export function getTroubleshootFlow(category: TroubleshootCategory): DiagnosisStep {
  const stepId = `${category}_start`;
  return STEPS[stepId] || STEPS.start;
}

export function processAnswer(currentStepId: string, answer: string): DiagnosisStep {
  const currentStep = STEPS[currentStepId];
  if (!currentStep) {
    return { id: 'error', diagnosis: 'Unknown step' };
  }

  // Find the selected option
  const selectedOption = currentStep.options?.find(o => o.value === answer);

  // If option has a next step, go there
  if (selectedOption?.nextStep) {
    return STEPS[selectedOption.nextStep] || { id: 'error', diagnosis: 'Unknown next step' };
  }

  // Otherwise, check for a solution
  const solutionKey = `${currentStepId}:${answer}`;
  const solutionId = ANSWER_TO_SOLUTION[solutionKey];

  if (solutionId) {
    const solution = SOLUTIONS[solutionId];
    return {
      id: solutionId,
      solution,
    };
  }

  // No solution found, return generic advice
  return {
    id: 'generic',
    diagnosis: 'We couldn\'t find a specific solution. Try checking the filter and running a cleaning cycle.',
  };
}

export function getSolution(solutionId: string): TroubleshootSolution | undefined {
  return SOLUTIONS[solutionId];
}
