Decision Tree 1: Load Advisor
Data Model
typescript// User inputs
interface LoadInput {
  items: ItemType[];
  soilTypes: SoilType[];
  quantity: 'light' | 'normal' | 'full';
  urgency: 'no_rush' | 'need_today' | 'need_fast';
}

type ItemType = 
  | 'plates' | 'bowls' | 'glasses' | 'mugs'
  | 'pots' | 'pans' | 'bakeware' | 'utensils'
  | 'containers' | 'baby_items' | 'cutting_boards';

type SoilType =
  | 'light'      // water marks, dust, minimal residue
  | 'everyday'   // normal food residue, sauces
  | 'heavy'      // baked-on, burnt, dried overnight
  | 'greasy'     // oils, fried food, butter
  | 'protein'    // eggs, cheese, meat, dairy
  | 'starchy'    // pasta, rice, potato, bread
  | 'acidic';    // tomato, citrus, vinegar

// Output recommendation
interface Recommendation {
  cycle: CycleType;
  prewashDose: string;
  mainDose: string;
  preinseAdvice: string;
  loadingTips: string[];
  reasoning: string;
}

type CycleType = 
  | 'quick'      // 30-45 min, no prewash, minimal enzyme time
  | 'eco'        // 2-3 hrs, low temp, long enzyme activation
  | 'normal'     // 1-1.5 hrs, moderate temp, good enzyme time
  | 'intensive'  // 1.5-2 hrs, high temp, heavy soil
  | 'delicate'   // low pressure, low temp, gentle
  | 'sanitise';  // high temp final rinse, baby items
```

### Decision Logic
```
START
│
├─► Are there BABY ITEMS?
│   │
│   YES ─► Flag: needs_sanitise = true
│   │
│   NO ─► Continue
│
├─► Are there DELICATE items? (fine glasses, crystal, china)
│   │
│   YES ─► Flag: needs_gentle = true
│   │
│   NO ─► Continue
│
├─► Calculate SOIL SCORE
│   │
│   │   Base scores:
│   │   - light: 1
│   │   - everyday: 2
│   │   - starchy: 2
│   │   - protein: 3
│   │   - greasy: 4
│   │   - heavy: 5
│   │   - acidic: 2 (but flag for staining risk)
│   │
│   │   Take MAX of selected soil types
│   │
│   └─► soil_score = max(selected_soils)
│
├─► Calculate GREASE FACTOR
│   │
│   │   If 'greasy' in soilTypes: grease_factor = HIGH
│   │   Else if 'protein' in soilTypes: grease_factor = MEDIUM
│   │   Else: grease_factor = LOW
│   │
│   └─► Determines pre-wash dosing
│
├─► Check URGENCY
│   │
│   │   'need_fast' ─► Can only use quick/normal
│   │   'need_today' ─► Can use any cycle
│   │   'no_rush' ─► Prefer eco for efficiency
│   │
│   └─► urgency_constraint
│
├─► CYCLE SELECTION
│   │
│   │   Priority rules (first match wins):
│   │
│   │   1. needs_sanitise AND NOT needs_gentle
│   │      ─► cycle = 'sanitise'
│   │
│   │   2. needs_gentle
│   │      ─► cycle = 'delicate'
│   │      ─► (warn if soil_score > 2: "hand wash heavily soiled")
│   │
│   │   3. urgency = 'need_fast' AND soil_score <= 2
│   │      ─► cycle = 'quick'
│   │
│   │   4. urgency = 'need_fast' AND soil_score > 2
│   │      ─► cycle = 'normal'
│   │      ─► (warn: "quick won't clean this well")
│   │
│   │   5. soil_score >= 4 (heavy or greasy)
│   │      ─► cycle = 'intensive'
│   │
│   │   6. soil_score = 3 (protein)
│   │      ─► cycle = 'normal' (needs enzyme time)
│   │
│   │   7. urgency = 'no_rush' AND soil_score <= 3
│   │      ─► cycle = 'eco'
│   │
│   │   8. DEFAULT
│   │      ─► cycle = 'normal'
│   │
│   └─► selected_cycle
│
├─► DOSING CALCULATION
│   │
│   │   Base doses (assumes moderate water hardness):
│   │
│   │   Pre-wash dose:
│   │   - grease_factor = HIGH: "1.5 tablespoons"
│   │   - grease_factor = MEDIUM: "1 tablespoon"
│   │   - grease_factor = LOW: "0.5 tablespoon"
│   │   - cycle = 'quick': "none" (no pre-wash phase)
│   │   - cycle = 'delicate': "0.5 tablespoon"
│   │
│   │   Main dose:
│   │   - soil_score >= 4: "2.5 tablespoons"
│   │   - soil_score = 3: "2 tablespoons"
│   │   - soil_score = 2: "1.5 tablespoons"
│   │   - soil_score = 1: "1 tablespoon"
│   │   - cycle = 'quick': "1 tablespoon"
│   │
│   │   Adjustments:
│   │   - If user has hard water flag: +50% to both
│   │   - If quantity = 'light': -25% to main
│   │   - If quantity = 'full': +25% to main
│   │
│   └─► prewash_dose, main_dose
│
├─► PRE-RINSE ADVICE
│   │
│   │   Rules:
│   │   - 'heavy' in soilTypes: 
│   │     "Scrape off large chunks and burnt bits. Don't rinse."
│   │
│   │   - 'greasy' in soilTypes:
│   │     "Don't rinse - grease helps detergent work. Scrape solids only."
│   │
│   │   - 'protein' in soilTypes:
│   │     "Light scrape only. Dried protein is fine - enzymes handle it."
│   │
│   │   - 'starchy' in soilTypes:
│   │     "No rinsing needed. Starch dissolves easily."
│   │
│   │   - 'acidic' in soilTypes:
│   │     "Run soon - acidic foods can stain if left too long."
│   │
│   │   - DEFAULT:
│   │     "Scrape large food pieces into bin. No rinsing needed."
│   │
│   └─► prerinse_advice
│
├─► LOADING TIPS
│   │
│   │   Conditional tips based on items:
│   │
│   │   - 'glasses' in items:
│   │     "Angle glasses between tines, not over them"
│   │
│   │   - 'bowls' in items:
│   │     "Face bowls toward centre, angled down"
│   │
│   │   - 'pots' OR 'pans' in items:
│   │     "Place on bottom rack, angled for water access"
│   │
│   │   - 'containers' in items:
│   │     "Plastic on top rack only - bottoms warp with heat"
│   │
│   │   - 'bakeware' in items:
│   │     "Angle to face spray arm, don't lay flat"
│   │
│   │   - 'utensils' in items:
│   │     "Mix handles up and down to prevent nesting"
│   │
│   │   - quantity = 'full':
│   │     "Don't block spray arm rotation - spin it to check"
│   │
│   └─► loading_tips[]
│
└─► GENERATE REASONING
    │
    │   Template:
    │   "{cycle} works best here because {reason}.
    │    {soil_explanation}. {time_note}"
    │
    │   Examples:
    │   - "Normal cycle works best because protein residue needs 
    │      enzyme activation time. The pre-wash detergent will 
    │      handle the grease before the main wash."
    │
    │   - "Eco cycle is ideal for this lightly soiled load. 
    │      It uses less energy by running longer at lower 
    │      temperatures - enzymes work great with time."
    │
    │   - "Intensive cycle needed for baked-on food. The higher 
    │      temperature helps break down stubite residue that 
    │      enzymes alone can't handle."
    │
    └─► reasoning

OUTPUT: Recommendation object
```

### Example Flows

**Example 1: Weeknight dinner plates**
```
Input:
  items: [plates, bowls, glasses, utensils]
  soilTypes: [everyday, protein]  // pasta with meat sauce
  quantity: normal
  urgency: no_rush

Processing:
  needs_sanitise: false
  needs_gentle: false
  soil_score: 3 (protein)
  grease_factor: MEDIUM
  urgency_constraint: prefer_eco

Cycle selection:
  Rule 7 matches (no_rush AND soil_score <= 3)
  BUT protein needs enzyme time, eco provides this ✓
  → cycle = 'eco'

Output:
  cycle: "Eco"
  prewashDose: "1 tablespoon in the door"
  mainDose: "1.5 tablespoons in dispenser"
  prerinseAdvice: "Light scrape only. Dried protein is fine - enzymes handle it."
  loadingTips: [
    "Angle glasses between tines, not over them",
    "Face bowls toward centre, angled down",
    "Mix utensil handles up and down to prevent nesting"
  ]
  reasoning: "Eco cycle is perfect here. The longer run time at lower 
              temperature gives enzymes plenty of time to break down 
              the protein residue. You'll use less energy too."
```

**Example 2: Sunday roast cleanup**
```
Input:
  items: [plates, pots, pans, bakeware, utensils]
  soilTypes: [heavy, greasy, protein]  // roast dinner carnage
  quantity: full
  urgency: need_today

Processing:
  needs_sanitise: false
  needs_gentle: false
  soil_score: 5 (heavy)
  grease_factor: HIGH
  urgency_constraint: any_cycle

Cycle selection:
  Rule 5 matches (soil_score >= 4)
  → cycle = 'intensive'

Dosing adjustment:
  quantity = full → +25% to main dose

Output:
  cycle: "Intensive"
  prewashDose: "1.5 tablespoons in the door"
  mainDose: "3 tablespoons in dispenser"
  prerinseAdvice: "Scrape off large chunks and burnt bits. Don't rinse 
                   the grease - it actually helps the detergent work."
  loadingTips: [
    "Place pots and pans on bottom rack, angled for water access",
    "Angle bakeware to face spray arm, don't lay flat",
    "Don't block spray arm rotation - spin it to check"
  ]
  reasoning: "Intensive cycle needed for this heavy load. The higher 
              temperature and longer wash time will tackle the baked-on 
              and greasy residue. Extra pre-wash detergent is critical 
              to emulsify all that fat before the main wash."
```

**Example 3: Quick glasses after drinks**
```
Input:
  items: [glasses]
  soilTypes: [light]
  quantity: light
  urgency: need_fast

Processing:
  needs_sanitise: false
  needs_gentle: false (regular glasses, not crystal)
  soil_score: 1
  grease_factor: LOW
  urgency_constraint: quick_or_normal

Cycle selection:
  Rule 3 matches (need_fast AND soil_score <= 2)
  → cycle = 'quick'

Output:
  cycle: "Quick"
  prewashDose: "None needed"
  mainDose: "1 tablespoon in dispenser"
  prerinseAdvice: "No prep needed - these are barely dirty."
  loadingTips: [
    "Angle glasses between tines, not over them"
  ]
  reasoning: "Quick cycle is fine for lightly soiled glasses. No pre-wash 
              dose needed since there's no grease to tackle. Just a light 
              wash to remove water marks and dust."
```

---

## Decision Tree 2: Troubleshooter

### Main Entry Point
```
START: "What's the problem?"
│
├─► [1] White residue or film on dishes
│   └─► BRANCH_WHITE_RESIDUE
│
├─► [2] Cloudy glasses
│   └─► BRANCH_CLOUDY_GLASSES
│
├─► [3] Food still stuck on
│   └─► BRANCH_FOOD_STUCK
│
├─► [4] Greasy or slimy feeling
│   └─► BRANCH_GREASY
│
├─► [5] Spots on glasses or cutlery
│   └─► BRANCH_SPOTS
│
├─► [6] Bad smell inside machine
│   └─► BRANCH_SMELL
│
├─► [7] Dishes not drying
│   └─► BRANCH_DRYING
│
└─► [8] Something else
    └─► BRANCH_OTHER
```

### Branch: White Residue
```
BRANCH_WHITE_RESIDUE
│
├─► Q: "Touch the residue. Is it..."
│   │
│   ├─► [A] Powdery/chalky (wipes off easily)
│   │   │
│   │   └─► DIAGNOSIS: Hard water mineral deposits
│   │       │
│   │       ├─► Q: "Do you know if you have hard water?"
│   │       │   │
│   │       │   ├─► [Yes, I have hard water]
│   │       │   │   └─► SOLUTION_HARD_WATER_CONFIRMED
│   │       │   │
│   │       │   ├─► [No, my water is soft]
│   │       │   │   └─► SOLUTION_SOFT_WATER_RESIDUE
│   │       │   │
│   │       │   └─► [I don't know]
│   │       │       └─► SOLUTION_TEST_WATER_HARDNESS
│   │       │
│   │       └─► Solutions below
│   │
│   └─► [B] Smeary/greasy (needs scrubbing)
│       │
│       └─► DIAGNOSIS: Detergent not dissolving or rinsing
│           │
│           ├─► Q: "What detergent are you using?"
│           │   │
│           │   ├─► [Pods/tablets]
│           │   │   └─► SOLUTION_POD_NOT_DISSOLVING
│           │   │
│           │   ├─► [Powder]
│           │   │   └─► SOLUTION_POWDER_NOT_RINSING
│           │   │
│           │   └─► [Liquid/gel]
│           │       └─► SOLUTION_GEL_RESIDUE
│           │
│           └─► Solutions below


SOLUTION_HARD_WATER_CONFIRMED:
┌────────────────────────────────────────────────────────────────┐
│  HARD WATER DEPOSITS                                           │
│                                                                │
│  Your water is leaving mineral scale on dishes.                │
│                                                                │
│  FIX IT:                                                       │
│                                                                │
│  1. INCREASE DETERGENT                                         │
│     Hard water needs 50-100% more than the packet says.        │
│     Try doubling your current amount.                          │
│                                                                │
│  2. CHECK RINSE AID                                            │
│     Fill the dispenser and set to maximum.                     │
│     Rinse aid prevents minerals from sticking.                 │
│                                                                │
│  3. USE THE SALT COMPARTMENT                                   │
│     If your machine has one (check bottom of tub), fill it.    │
│     This softens water during the wash.                        │
│     [Show me where the salt goes →]                            │
│                                                                │
│  4. MONTHLY CLEAN                                              │
│     Run empty cycle with 2 cups white vinegar.                 │
│     Dissolves built-up scale inside the machine.               │
│                                                                │
│  ─────────────────────────────────────────────────────────     │
│  💡 Hard water is the #1 cause of dishwasher problems.         │
│     Once you adjust for it, everything improves.               │
│                                                                │
│  [Try our hard-water formula powder →]                         │
│  [Set reminder for monthly clean →]                            │
│  [Did this help? Yes / No]                                     │
└────────────────────────────────────────────────────────────────┘


SOLUTION_TEST_WATER_HARDNESS:
┌────────────────────────────────────────────────────────────────┐
│  LET'S TEST YOUR WATER                                         │
│                                                                │
│  Quick home test:                                              │
│                                                                │
│  1. Fill a clear bottle 1/3 with tap water                     │
│  2. Add 10 drops of dish soap                                  │
│  3. Shake vigorously for 10 seconds                            │
│  4. Look at the result:                                        │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ ░░░░░░░░░░░ │  │ ░░░░░░░░░░░ │  │ ░░░░░░░░░░░ │            │
│  │ ░░░░░░░░░░░ │  │ ░░░░░░░░░░░ │  │ ▓▓▓▓▓▓▓▓▓▓▓ │            │
│  │ ░░░SUDS░░░░ │  │ ░░░░░░░░░░░ │  │ ▓▓▓▓▓▓▓▓▓▓▓ │            │
│  │ ░░░░░░░░░░░ │  │ ░░░░░░░░░░░ │  │ ▓▓SUDS▓▓▓▓▓ │            │
│  │ ─────────── │  │ ────suds─── │  │ ▓▓▓▓▓▓▓▓▓▓▓ │            │
│  │   water     │  │   water     │  │ ▓▓▓▓▓▓▓▓▓▓▓ │            │
│  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│    HARD           MODERATE          SOFT                       │
│    Few suds,      Some suds,        Lots of suds,             │
│    milky water    slightly cloudy   clear water               │
│                                                                │
│  [My water is HARD]  [MODERATE]  [SOFT]                        │
└────────────────────────────────────────────────────────────────┘


SOLUTION_POD_NOT_DISSOLVING:
┌────────────────────────────────────────────────────────────────┐
│  POD/TABLET NOT DISSOLVING PROPERLY                            │
│                                                                │
│  The coating isn't fully breaking down. Common causes:         │
│                                                                │
│  1. DISPENSER BLOCKED                                          │
│     Check the dispenser door opens freely.                     │
│     Food or utensils may be blocking it.                       │
│     [Show me how to check →]                                   │
│                                                                │
│  2. WATER NOT HOT ENOUGH                                       │
│     Pods need hot water to dissolve the coating.               │
│     Make sure your water heater is set to 50°C+.               │
│                                                                │
│  3. POD GETTING WET BEFORE USE                                 │
│     Store pods in dry place, handle with dry hands.            │
│     Moisture makes the coating sticky and slow to dissolve.    │
│                                                                │
│  4. SHORT CYCLE                                                │
│     Quick/Express cycles may not give pods enough time.        │
│     Use Normal or longer cycles with pods.                     │
│                                                                │
│  ─────────────────────────────────────────────────────────     │
│  💡 BETTER SOLUTION: Switch to powder                          │
│                                                                │
│  Powder dissolves instantly and lets you:                      │
│  • Add detergent to pre-wash (pods can't do this)              │
│  • Adjust dose for load size and soil level                    │
│  • Save money (powder is cheaper per wash)                     │
│                                                                │
│  [Why powder beats pods →]                                     │
│  [Try our powder →]                                            │
└────────────────────────────────────────────────────────────────┘
```

### Branch: Food Still Stuck
```
BRANCH_FOOD_STUCK
│
├─► Q: "Where is the food stuck?"
│   │
│   ├─► [A] Inside bowls, cups, or mugs
│   │   └─► DIAGNOSIS: Water access issue
│   │
│   ├─► [B] On flat surfaces (plates, pan bottoms)
│   │   │
│   │   └─► Q: "What kind of food?"
│   │       │
│   │       ├─► [Baked-on / burnt]
│   │       │   └─► DIAGNOSIS: Cycle too weak
│   │       │
│   │       ├─► [Greasy residue]
│   │       │   └─► DIAGNOSIS: No pre-wash detergent
│   │       │
│   │       ├─► [Dried sauce / everyday food]
│   │       │   └─► DIAGNOSIS: Detergent or loading issue
│   │       │
│   │       └─► [Egg / cheese / protein]
│   │           └─► DIAGNOSIS: Needs enzyme time
│   │
│   ├─► [C] Everywhere - nothing is clean
│   │   └─► DIAGNOSIS: Fundamental problem
│   │
│   └─► [D] Random spots on random items
│       └─► DIAGNOSIS: Loading/spray pattern issue


DIAGNOSIS: Water access issue (bowls/cups)
┌────────────────────────────────────────────────────────────────┐
│  WATER ISN'T REACHING INSIDE                                   │
│                                                                │
│  Concave items trap air bubbles that block water.              │
│                                                                │
│  FIX IT:                                                       │
│                                                                │
│  1. ANGLE EVERYTHING                                           │
│     ┌──────────────────────────────────────────────┐           │
│     │                                              │           │
│     │    ✗ WRONG          ✓ RIGHT                  │           │
│     │    ┌───┐            ┌───┐                    │           │
│     │    │   │            │  ╱                     │           │
│     │    │   │             ╲╱                      │           │
│     │    └───┘                                     │           │
│     │    Upright          Angled toward            │           │
│     │    (traps air)      spray arm                │           │
│     │                                              │           │
│     └──────────────────────────────────────────────┘           │
│                                                                │
│  2. FACE THE SPRAY ARM                                         │
│     Items should tilt toward where water comes from.           │
│     Usually that's the centre/bottom of the machine.           │
│                                                                │
│  3. DON'T NEST                                                 │
│     Each item needs its own water access.                      │
│     Overlapping bowls = inner bowl stays dirty.                │
│                                                                │
│  4. CHECK SPRAY ARM SPINS FREELY                               │
│     Tall items on bottom rack can block it.                    │
│     Spin it by hand before closing door.                       │
│                                                                │
│  [Show me optimal loading patterns →]                          │
│  [Did this help? Yes / No]                                     │
└────────────────────────────────────────────────────────────────┘


DIAGNOSIS: No pre-wash detergent (greasy residue)
┌────────────────────────────────────────────────────────────────┐
│  GREASE NEEDS PRE-WASH DETERGENT                               │
│                                                                │
│  Here's what's happening:                                      │
│                                                                │
│  Your dishwasher runs a PRE-WASH before opening the            │
│  detergent dispenser. If you use pods, that entire             │
│  pre-wash phase uses only water - no cleaning power.           │
│                                                                │
│  Grease doesn't dissolve in plain water. It just moves         │
│  around and redeposits on your dishes.                         │
│                                                                │
│  ┌──────────────────────────────────────────────────┐          │
│  │  CYCLE TIMELINE                                  │          │
│  │                                                  │          │
│  │  ├─── Pre-wash ───┼─── Main wash ───┼── Rinse ──┤          │
│  │  │                │                 │           │          │
│  │  │  ✗ Pod sits    │  Pod finally    │           │          │
│  │  │    here doing  │  opens here     │           │          │
│  │  │    nothing     │                 │           │          │
│  │  │                │                 │           │          │
│  │  │  ✓ Powder HERE │  + Powder here  │           │          │
│  │  │    tackles     │                 │           │          │
│  │  │    grease      │                 │           │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                │
│  FIX IT:                                                       │
│                                                                │
│  1. Use powder instead of pods                                 │
│  2. Put 1-1.5 tablespoons loose in the door or tub             │
│  3. Put the rest in the dispenser as normal                    │
│                                                                │
│  The loose powder cleans during pre-wash.                      │
│  The dispenser powder finishes the job.                        │
│                                                                │
│  [Why powder beats pods (full explanation) →]                  │
│  [Try our powder - fixes greasy dish problems →]               │
└────────────────────────────────────────────────────────────────┘


DIAGNOSIS: Needs enzyme time (protein)
┌────────────────────────────────────────────────────────────────┐
│  PROTEIN NEEDS TIME TO BREAK DOWN                              │
│                                                                │
│  Egg, cheese, meat, and dairy residue are proteins.            │
│  They need ENZYMES (in detergent) plus TIME to break down.     │
│                                                                │
│  The problem:                                                  │
│  • Quick cycles (30-45 min) don't give enzymes enough time     │
│  • Enzymes work best at 40-50°C - too hot kills them           │
│  • Very short cycles blast with hot water but skip enzyme time │
│                                                                │
│  FIX IT:                                                       │
│                                                                │
│  1. USE LONGER CYCLES                                          │
│     Normal (1+ hour) or Eco (2-3 hours) give enzymes           │
│     the time they need to work.                                │
│                                                                │
│  2. DON'T PRE-RINSE PROTEIN                                    │
│     Counter-intuitive, but dried egg/cheese is fine.           │
│     Enzymes actually need the protein there to work on.        │
│     Pre-rinsing removes what enzymes need.                     │
│                                                                │
│  3. ECO MODE IS YOUR FRIEND                                    │
│     It runs longer at lower temps - perfect for enzymes.       │
│     Despite the name, it often cleans protein better           │
│     than hotter, shorter cycles.                               │
│                                                                │
│  4. USE ENZYME-RICH DETERGENT                                  │
│     Cheap detergents skimp on enzymes.                         │
│     Quality powder has proteases (protein) and amylases        │
│     (starch) that do the real work.                            │
│                                                                │
│  [Learn more about how enzymes work →]                         │
│  [Did this help? Yes / No]                                     │
└────────────────────────────────────────────────────────────────┘


DIAGNOSIS: Fundamental problem (nothing is clean)
┌────────────────────────────────────────────────────────────────┐
│  SOMETHING'S WRONG WITH THE BASICS                             │
│                                                                │
│  If nothing is coming out clean, let's check fundamentals.     │
│                                                                │
│  CHECK THESE IN ORDER:                                         │
│                                                                │
│  1. IS THE FILTER CLOGGED?                                     │
│     └─► A clogged filter means dirty water recirculates        │
│     └─► Check bottom of tub, twist and remove filter           │
│     └─► Clean under running water, scrub with brush            │
│     [Show me where the filter is →]                            │
│                                                                │
│  2. ARE THE SPRAY ARMS BLOCKED?                                │
│     └─► Remove spray arms (usually twist off)                  │
│     └─► Check holes aren't clogged with debris                 │
│     └─► Rinse under tap, poke holes with toothpick             │
│     [Show me how to clean spray arms →]                        │
│                                                                │
│  3. IS WATER ACTUALLY ENTERING?                                │
│     └─► Start a cycle and listen - you should hear filling     │
│     └─► Open mid-cycle (carefully) - is there water?           │
│     └─► If no water: check inlet hose isn't kinked             │
│                                                                │
│  4. IS DISPENSER OPENING?                                      │
│     └─► Check dispenser door isn't blocked by dishes           │
│     └─► Manually open/close to check mechanism                 │
│     └─► Look for detergent residue (sign it's not opening)     │
│                                                                │
│  5. IS WATER HOT ENOUGH?                                       │
│     └─► Run hot tap near dishwasher - is it hot?               │
│     └─► Some machines heat their own water, some don't         │
│     └─► Cold water = nothing dissolves properly                │
│                                                                │
│  ─────────────────────────────────────────────────────────     │
│  If you've checked all these and it's still not working,       │
│  the machine may need professional service.                    │
│                                                                │
│  [Find a repair service near me →]                             │
│  [Still not working - more help →]                             │
└────────────────────────────────────────────────────────────────┘
```

### Branch: Bad Smell
```
BRANCH_SMELL
│
├─► Q: "When did you last clean the filter?"
│   │
│   ├─► [A] Never / I don't know where it is
│   │   └─► DIAGNOSIS: Dirty filter (primary cause)
│   │
│   ├─► [B] Recently (within a month)
│   │   │
│   │   └─► Q: "Does the smell happen..."
│   │       │
│   │       ├─► [Right after a cycle]
│   │       │   └─► DIAGNOSIS: Drainage issue
│   │       │
│   │       ├─► [When you open the door after days unused]
│   │       │   └─► DIAGNOSIS: Stagnant water / mould
│   │       │
│   │       └─► [All the time]
│   │           └─► DIAGNOSIS: Deep contamination
│   │
│   └─► [C] I clean it regularly
│       └─► DIAGNOSIS: Other source


DIAGNOSIS: Dirty filter
┌────────────────────────────────────────────────────────────────┐
│  YOUR FILTER NEEDS CLEANING                                    │
│                                                                │
│  Food particles collect in the filter and decompose.           │
│  This is the #1 cause of dishwasher smell.                     │
│                                                                │
│  HOW TO CLEAN IT:                                              │
│                                                                │
│  ┌──────────────────────────────────────────────────┐          │
│  │  1. Remove bottom rack                           │          │
│  │                                                  │          │
│  │  2. Find filter (usually centre-bottom)          │          │
│  │     ┌─────────────────────┐                      │          │
│  │     │    ┌───────────┐    │                      │          │
│  │     │    │  FILTER   │    │  ← Twist counter-    │          │
│  │     │    │   HERE    │    │    clockwise and     │          │
│  │     │    └───────────┘    │    lift out          │          │
│  │     └─────────────────────┘                      │          │
│  │                                                  │          │
│  │  3. Rinse under hot running water                │          │
│  │                                                  │          │
│  │  4. Scrub mesh with soft brush                   │          │
│  │     (old toothbrush works great)                 │          │
│  │                                                  │          │
│  │  5. Check for trapped debris underneath          │          │
│  │                                                  │          │
│  │  6. Replace, twist to lock                       │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                │
│  DO THIS MONTHLY                                               │
│  More often if you don't scrape plates before loading.         │
│                                                                │
│  [Set a monthly reminder →]                                    │
│  [Show me a video →]                                           │
│  [Did this fix it? Yes / No]                                   │
└────────────────────────────────────────────────────────────────┘


DIAGNOSIS: Stagnant water / mould
┌────────────────────────────────────────────────────────────────┐
│  MOISTURE IS BUILDING UP                                       │
│                                                                │
│  When the dishwasher sits unused, trapped moisture grows       │
│  mould and bacteria. Common in humid climates.                 │
│                                                                │
│  FIX IT:                                                       │
│                                                                │
│  1. LEAVE DOOR AJAR AFTER CYCLES                               │
│     Crack it open a few centimetres.                           │
│     Lets moisture escape instead of sitting.                   │
│                                                                │
│  2. RUN A CLEANING CYCLE                                       │
│     Empty machine, hottest cycle, with either:                 │
│     • 2 cups white vinegar in a bowl on top rack               │
│     • Commercial dishwasher cleaner                            │
│     • 1 cup bicarb sprinkled on bottom                         │
│                                                                │
│  3. CHECK DOOR SEAL                                            │
│     Wipe the rubber gasket with vinegar solution.              │
│     Mould hides in the folds - pull back and clean.            │
│                                                                │
│  4. CLEAN SPRAY ARM HOLES                                      │
│     Bacteria can grow inside blocked holes.                    │
│     Remove arms, soak in vinegar, clear holes.                 │
│                                                                │
│  PREVENT IT:                                                   │
│  • Run at least one cycle per week                             │
│  • Always leave door ajar after use                            │
│  • Monthly vinegar cleaning cycle                              │
│                                                                │
│  [Set up maintenance reminders →]                              │
└────────────────────────────────────────────────────────────────┘
```

---

## Decision Tree 3: Pre-Rinse Guide

Quick standalone flow for the common question.
```
START: "How much should I pre-rinse?"
│
├─► THE SHORT ANSWER
│   │
│   │  ┌────────────────────────────────────────────────────┐
│   │  │                                                    │
│   │  │   SCRAPE, DON'T RINSE                              │
│   │  │                                                    │
│   │  │   • Scrape large food chunks into bin              │
│   │  │   • Leave everything else                          │
│   │  │   • Seriously, that's it                           │
│   │  │                                                    │
│   │  └────────────────────────────────────────────────────┘
│   │
│   └─► [Why? Tell me more →]
│
├─► THE DETAILED GUIDE
│   │
│   │  ┌────────────────────────────────────────────────────┐
│   │  │  WHAT TO LEAVE                                     │
│   │  │                                                    │
│   │  │  ✓ Grease and oil                                  │
│   │  │    Surfactants need fat to emulsify.               │
│   │  │    Rinsing just spreads it around.                 │
│   │  │                                                    │
│   │  │  ✓ Dried sauce and food residue                    │
│   │  │    Enzymes break this down easily.                 │
│   │  │    They actually need it there to work.            │
│   │  │                                                    │
│   │  │  ✓ Dried egg, cheese, dairy                        │
│   │  │    Proteases (protein enzymes) handle this.        │
│   │  │    Dried is fine - enzymes don't care.             │
│   │  │                                                    │
│   │  │  ✓ Pasta/rice/potato residue                       │
│   │  │    Amylases (starch enzymes) dissolve this.        │
│   │  │    Water alone won't help anyway.                  │
│   │  │                                                    │
│   │  │  ✓ Sauce smears and thin residue                   │
│   │  │    Hot water + detergent handles easily.           │
│   │  │                                                    │
│   │  └────────────────────────────────────────────────────┘
│   │
│   │  ┌────────────────────────────────────────────────────┐
│   │  │  WHAT TO SCRAPE OFF                                │
│   │  │                                                    │
│   │  │  ✗ Large food chunks (bones, veg pieces)           │
│   │  │    These won't dissolve - they'll clog filter.     │
│   │  │                                                    │
│   │  │  ✗ Seeds, pips, toothpicks, labels                 │
│   │  │    Physical debris that won't break down.          │
│   │  │                                                    │
│   │  │  ✗ Thick burnt/carbonised residue                  │
│   │  │    Scrape the worst, leave the rest.               │
│   │  │    Intensive cycle + soak handles moderate burn.   │
│   │  │                                                    │
│   │  │  ✗ Coffee grounds, tea leaves                      │
│   │  │    These clog the filter and drain.                │
│   │  │                                                    │
│   │  │  ✗ Paper (napkins stuck to plates)                 │
│   │  │    Remove before loading.                          │
│   │  │                                                    │
│   │  └────────────────────────────────────────────────────┘
│   │
│   └─► [But won't my dishwasher get dirty? →]
│
├─► THE "BUT..." OBJECTIONS
│   │
│   ├─► "But my mum always rinsed dishes first"
│   │   │
│   │   │  Old dishwashers and detergents needed this.
│   │   │  Modern machines and enzymes don't.
│   │   │  
│   │   │  Pre-rinsing wastes:
│   │   │  • 20+ litres of water per load
│   │   │  • Your time
│   │   │  • The food that enzymes need to work on
│   │   │
│   │   └─► [Continue →]
│   │
│   ├─► "But won't food clog the dishwasher?"
│   │   │
│   │   │  That's what the filter is for.
│   │   │  
│   │   │  Clean it monthly and you'll never have problems.
│   │   │  
│   │   │  Only scrape off chunks that won't dissolve:
│   │   │  bones, seeds, labels, paper.
│   │   │
│   │   └─► [Show me how to clean the filter →]
│   │
│   ├─► "But the food dries on and gets harder to clean"
│   │   │
│   │   │  Actually, enzymes don't care.
│   │   │  
│   │   │  Fresh or dried, enzymes break down protein and
│   │   │  starch the same way. They work by chemistry,
│   │   │  not by physical scrubbing.
│   │   │  
│   │   │  The only exception: acidic foods (tomato sauce)
│   │   │  can stain if left for days. Run within 24 hours.
│   │   │
│   │   └─► [Continue →]
│   │
│   └─► "But I've always done it this way and it works"
│       │
│       │  Fair enough! But try skipping the rinse for a week.
│       │  
│       │  If your dishes come out just as clean, you've been
│       │  wasting water and time all along.
│       │  
│       │  The only change you might need: add pre-wash
│       │  detergent (1 tbsp in the door) if you weren't
│       │  already. That replaces what pre-rinsing did.
│       │
│       └─► [Take the challenge: no pre-rinse for a week →]
│
└─► END
```

---

## Waitlist Landing Page Structure

Simple, focused, no distractions.
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                              RINSE MATE                                    │
│                                                                            │
│                    Your dishwasher is working too hard.                    │
│                         Yours might be too.                                │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│     Most people use their dishwasher wrong:                                │
│                                                                            │
│     ✗ Pods waste the pre-wash cycle                                        │
│     ✗ Pre-rinsing wastes water and makes dishes dirtier                    │
│     ✗ Quick cycles don't give enzymes time to work                         │
│                                                                            │
│     Rinse Mate fixes this in 60 seconds.                                   │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│     THE APP:                                                               │
│     • Learn what you're doing wrong (and how to fix it)                    │
│     • Get cycle + dosing advice for every load                             │
│     • Troubleshoot when dishes don't come out clean                        │
│                                                                            │
│     THE POWDER:                                                            │
│     • Enzyme-rich formula that actually works                              │
│     • Ships automatically when you're running low                          │
│     • Never think about dishwasher supplies again                          │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│                         Join the waitlist                                  │
│                                                                            │
│         ┌─────────────────────────────────────────────┐                    │
│         │  your@email.com                             │                    │
│         └─────────────────────────────────────────────┘                    │
│                                                                            │
│                    [ NOTIFY ME AT LAUNCH ]                                 │
│                                                                            │
│                                                                            │
│     Early access members get:                                              │
│     • Free shipping on first powder order                                  │
│     • Input on features we build                                           │
│     • Exclusive pricing locked in                                          │
│                                                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│     "Wait, why don't pods work?"                                           │
│                                                                            │
│     Your dishwasher runs a pre-wash BEFORE opening the                     │
│     detergent dispenser. Pods sit there doing nothing                      │
│     while plain water fails to clean your dishes.                          │
│                                                                            │
│     Powder lets you add detergent to the pre-wash.                         │
│     That's the entire secret.                                              │
│                                                                            │
│     [Watch the full explanation (Technology Connections) →]                │
│                                                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│                           [X] people on waitlist                           │
│                                                                            │
│                                                                            │
│  Footer: Made in Australia | Contact | Privacy                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Post-Signup Flow

After email submission:
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                              YOU'RE IN! 🎉                                 │
│                                                                            │
│     We'll email you when Rinse Mate launches.                              │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│     While you wait, start getting cleaner dishes TODAY:                    │
│                                                                            │
│     1. Switch from pods to powder                                          │
│        (any supermarket powder works)                                      │
│                                                                            │
│     2. Put 1 tablespoon loose in the door                                  │
│        before you close it                                                 │
│                                                                            │
│     3. Put the rest in the dispenser as normal                             │
│                                                                            │
│     4. Stop pre-rinsing                                                    │
│        (seriously, just scrape and load)                                   │
│                                                                            │
│     That's it. Your dishes will be cleaner tonight.                        │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│     Help us build the right thing:                                         │
│                                                                            │
│     Quick question - what's your biggest dishwasher frustration?           │
│                                                                            │
│     ○ Dishes don't come out clean                                          │
│     ○ Glasses are cloudy or spotty                                         │
│     ○ I never know which cycle to use                                      │
│     ○ I always run out of detergent                                        │
│     ○ Something else: [________________]                                   │
│                                                                            │
│                         [ SUBMIT ]                                         │
│                                                                            │
│                                                                            │
│     [Share with a friend who needs this →]                                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Summary: MVP Scope
What to Build
ComponentPriorityEffortLanding page + waitlistP01 day60-second onboardingP02 daysLoad advisor (full decision tree)P03 daysTroubleshooter (top 5 branches)P03 daysPre-rinse guideP11 dayLearn more contentP12 daysManual cycle loggingP22 daysPowder purchase flowP22 days
Total MVP: ~2-3 weeks
What to Skip (for now)

Smart plug integration
Account system
Auto-reorder
Maintenance reminders
Any machine-specific database

Success Metrics

Waitlist signups (demand validation)
Post-signup survey responses (problem validation)
Landing page conversion rate
Email open rates (engagement signal)

Ready to spec out the data model and API structure, or want to refine any of these flows further?