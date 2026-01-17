import type { PreRinseAdvice } from './types';

// ============================================
// WHAT TO LEAVE ON DISHES
// ============================================

interface PreRinseItem {
  item: string;
  reason: string;
}

const WHAT_TO_LEAVE: PreRinseItem[] = [
  {
    item: 'Grease and oil',
    reason: 'Surfactants in detergent need fat to emulsify. Rinsing grease just spreads it around - leave it for the detergent to work on.',
  },
  {
    item: 'Dried sauce and food residue',
    reason: 'Enzymes in detergent break this down easily. They actually need the food there to work on - pre-rinsing removes what enzymes need.',
  },
  {
    item: 'Dried egg, cheese, dairy',
    reason: 'Proteases (protein enzymes) handle this perfectly. Dried protein is fine - enzymes don\'t care if it\'s fresh or dried.',
  },
  {
    item: 'Pasta, rice, potato residue',
    reason: 'Amylases (starch enzymes) dissolve this easily. Water alone won\'t help - you need enzymes.',
  },
  {
    item: 'Sauce smears and thin residue',
    reason: 'Hot water + detergent handles this in seconds. No prep needed.',
  },
];

// ============================================
// WHAT TO SCRAPE OFF
// ============================================

const WHAT_TO_SCRAPE: PreRinseItem[] = [
  {
    item: 'Large food chunks',
    reason: 'Bones, vegetable pieces, meat chunks won\'t dissolve - they\'ll just clog the filter and drain.',
  },
  {
    item: 'Seeds, pips, toothpicks, labels',
    reason: 'Physical debris that won\'t break down. Will block the filter and potentially damage the pump.',
  },
  {
    item: 'Thick burnt/carbonised residue',
    reason: 'Scrape the worst burnt bits, leave moderate residue. Intensive cycle + soak can handle the rest.',
  },
  {
    item: 'Coffee grounds, tea leaves',
    reason: 'These clog the filter and drain. Always empty and rinse coffee mugs and teapots.',
  },
  {
    item: 'Paper (napkins stuck to plates)',
    reason: 'Paper turns to mush and clogs everything. Remove before loading.',
  },
];

// ============================================
// COMMON MYTHS
// ============================================

interface Myth {
  myth: string;
  reality: string;
}

const COMMON_MYTHS: Myth[] = [
  {
    myth: 'My mum always rinsed dishes first',
    reality: 'Old dishwashers and detergents needed this. Modern machines and enzyme-based detergents don\'t. Pre-rinsing wastes 20+ litres of water per load, your time, and actually makes detergent less effective by removing what it needs to work on.',
  },
  {
    myth: "Food will clog my dishwasher",
    reality: 'That\'s what the filter is for. Clean it monthly and you\'ll never have problems. Only scrape off chunks that won\'t dissolve: bones, seeds, labels, paper. Normal food residue is fine.',
  },
  {
    myth: 'Dried food is harder to clean',
    reality: 'Enzymes don\'t care if food is fresh or dried. They break down protein and starch the same way - through chemistry, not physical scrubbing. The only exception: acidic foods (tomato sauce) can stain if left for days.',
  },
  {
    myth: "I've always done it this way and it works",
    reality: 'Try skipping the rinse for a week. If your dishes come out just as clean, you\'ve been wasting water and time. The only change you might need: add pre-wash detergent (1 tbsp in the door) if you weren\'t already.',
  },
  {
    myth: 'Pre-rinsing saves water by making the dishwasher work less',
    reality: 'A full dishwasher cycle uses about 10-15 litres. Pre-rinsing by hand uses about 20+ litres. You\'re using MORE water, not less. And the dishwasher uses the same amount regardless of how dirty the dishes are.',
  },
];

// ============================================
// ITEM CLASSIFICATION HELPERS
// ============================================

const SCRAPE_PATTERNS = [
  /bone/i,
  /seed/i,
  /pip/i,
  /toothpick/i,
  /label/i,
  /paper/i,
  /napkin/i,
  /coffee.*ground/i,
  /tea.*lea/i,
  /grounds/i,
  /leaves/i,
  /large.*chunk/i,
  /big.*chunk/i,
  /large.*piece/i,
  /large.*food/i,
];

const LEAVE_PATTERNS = [
  /grease/i,
  /oil/i,
  /butter/i,
  /fat/i,
  /sauce/i,
  /residue/i,
  /dried/i,
  /egg/i,
  /cheese/i,
  /milk/i,
  /dairy/i,
  /protein/i,
  /pasta/i,
  /rice/i,
  /potato/i,
  /starch/i,
  /smear/i,
];

export function shouldScrapeItem(item: string): boolean {
  const lowered = item.toLowerCase();
  return SCRAPE_PATTERNS.some(pattern => pattern.test(lowered));
}

export function shouldLeaveItem(item: string): boolean {
  const lowered = item.toLowerCase();
  // First check if it should be scraped
  if (shouldScrapeItem(item)) {
    return false;
  }
  // Then check if it matches leave patterns
  return LEAVE_PATTERNS.some(pattern => pattern.test(lowered));
}

// ============================================
// PUBLIC API
// ============================================

export function getWhatToLeave(): PreRinseItem[] {
  return [...WHAT_TO_LEAVE];
}

export function getWhatToScrape(): PreRinseItem[] {
  return [...WHAT_TO_SCRAPE];
}

export function getCommonMyths(): Myth[] {
  return [...COMMON_MYTHS];
}

export interface FullPreRinseGuide extends PreRinseAdvice {
  summary: string;
  keyTakeaway: string;
}

export function getPreRinseGuide(): FullPreRinseGuide {
  return {
    summary: "Scrape, don't rinse. Scrape large food chunks into bin. Leave everything else.",
    keyTakeaway: 'Modern detergents use enzymes that need food residue to work on. Pre-rinsing removes what makes them effective and wastes 20+ litres of water per load.',
    whatToLeave: WHAT_TO_LEAVE,
    whatToScrape: WHAT_TO_SCRAPE,
    commonMyths: COMMON_MYTHS,
  };
}
