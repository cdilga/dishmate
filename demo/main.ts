import {
  // Quick Start
  getQuickStartGuide,
  getOnboardingSteps,
  getQuickWin,
  getTopMistakes,
  getDishwasherBasics,
  // Load Advisor
  getLoadRecommendation,
  // Troubleshooter
  TROUBLESHOOT_CATEGORIES,
  getInitialQuestion,
  getTroubleshootFlow,
  processAnswer,
  // Detergent
  getDetergentRecommendation,
  getAllDetergentFormats,
  getWhyPowderBeatsPods,
  // Rinse Aid
  getRinseAidRecommendation,
  getRinseAidExplanation,
  getDryingTips,
  // Water Hardness
  getWaterHardnessTest,
  getHardnessRecommendations,
  getAustralianCityHardness,
  getAllHardnessLevels,
  getHardnessExplanation,
  // Maintenance
  generateMaintenanceSchedule,
  getAllMaintenanceTasks,
  getCriticalTasks,
  // Cycles
  getAllCycles,
  getAllEducationalContent,
} from 'dishmate';

import type {
  ItemType,
  SoilType,
  LoadQuantity,
  Urgency,
  WaterHardness,
  DiagnosisStep,
  TroubleshootCategory,
  UsagePattern,
  MainConcern,
} from 'dishmate';

// Tab navigation with persistence
const TAB_STORAGE_KEY = 'dishmate-active-tab';

function activateTab(tabId: string): void {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));

  const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (tab) {
    tab.classList.add('active');
    document.getElementById(tabId)?.classList.add('active');
    localStorage.setItem(TAB_STORAGE_KEY, tabId);
    window.location.hash = tabId;
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const panelId = (tab as HTMLElement).dataset.tab!;
    activateTab(panelId);
  });
});

// Restore tab state on page load
function restoreTabState(): void {
  // Priority: URL hash > localStorage > default (first tab)
  const hash = window.location.hash.slice(1);
  const storedTab = localStorage.getItem(TAB_STORAGE_KEY);

  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  } else if (storedTab && document.getElementById(storedTab)) {
    activateTab(storedTab);
  }
}

// Handle browser back/forward for hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  }
});

// ============================================
// QUICK START
// ============================================

function renderQuickStart(): void {
  const container = document.getElementById('quick-start-content')!;
  const guide = getQuickStartGuide();
  const steps = getOnboardingSteps();
  const quickWin = getQuickWin();
  const mistakes = getTopMistakes();
  const basics = getDishwasherBasics();

  container.innerHTML = `
    <div class="section">
      <h3>${guide.title}</h3>
      <p><em>${guide.subtitle}</em></p>
      ${guide.sections
        .map(
          (section) => `
        <div class="result">
          <h4>${section.title}</h4>
          <ul>
            ${section.content.map((c) => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>🎯 ${quickWin.title}</h3>
      <div class="tip">
        <p><strong>${quickWin.description}</strong></p>
        <p>${quickWin.howTo}</p>
        <p><em>Expected: ${quickWin.expectedResult}</em></p>
      </div>
    </div>

    <div class="section">
      <h3>📋 Onboarding Steps</h3>
      ${steps
        .map(
          (step) => `
        <div class="step">
          <strong>Step ${step.stepNumber}: ${step.title}</strong>
          <p>${step.action}</p>
          <small><em>Why: ${step.whyItMatters}</em></small>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>❌ Top Mistakes to Avoid</h3>
      ${mistakes
        .map(
          (m) => `
        <div class="result warning">
          <strong>${m.mistake}</strong>
          <p><em>Why it's wrong:</em> ${m.whyItsWrong}</p>
          <p><em>Instead:</em> ${m.whatToDoInstead}</p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>🔄 How Your Dishwasher Works</h3>
      <ul>
        ${basics.howItWorks.map((h) => `<li>${h}</li>`).join('')}
      </ul>
      <h4>Wash Phases</h4>
      ${basics.phases
        .map(
          (phase) => `
        <div class="phase">
          <strong>${phase.name}</strong> (${phase.duration})
          <p>${phase.description}</p>
          ${phase.keyInsight ? `<p><em>💡 ${phase.keyInsight}</em></p>` : ''}
        </div>
      `
        )
        .join('')}
      <div class="tip">
        <p><strong>Detergent:</strong> ${basics.detergentRole}</p>
        <p><strong>Rinse Aid:</strong> ${basics.rinseAidRole}</p>
      </div>
    </div>
  `;
}

// ============================================
// LOAD ADVISOR
// ============================================

document.getElementById('get-recommendation')?.addEventListener('click', () => {
  const items = Array.from(
    document.querySelectorAll('#items-group input:checked')
  ).map((el) => (el as HTMLInputElement).value) as ItemType[];

  const soilTypes = Array.from(
    document.querySelectorAll('#soil-group input:checked')
  ).map((el) => (el as HTMLInputElement).value) as SoilType[];

  const quantity = (document.getElementById('quantity') as HTMLSelectElement)
    .value as LoadQuantity;
  const urgency = (document.getElementById('urgency') as HTMLSelectElement)
    .value as Urgency;
  const waterHardness = (
    document.getElementById('water-hardness') as HTMLSelectElement
  ).value as WaterHardness;

  const recommendation = getLoadRecommendation({
    items,
    soilTypes,
    quantity,
    urgency,
    waterHardness,
  });

  const resultDiv = document.getElementById('load-result')!;
  resultDiv.innerHTML = `
    <div class="result">
      <h3>✅ Recommended: ${recommendation.cycle.toUpperCase()} Cycle</h3>
      <p><strong>Pre-wash dose:</strong> ${recommendation.prewashDose}</p>
      <p><strong>Main wash dose:</strong> ${recommendation.mainDose}</p>
      <p><em>${recommendation.reasoning}</em></p>

      <h4>Pre-rinse advice:</h4>
      <p>${recommendation.prerinseAdvice}</p>

      ${
        recommendation.loadingTips.length > 0
          ? `
        <h4>Loading tips:</h4>
        <ul>
          ${recommendation.loadingTips.map((tip) => `<li>${tip}</li>`).join('')}
        </ul>
      `
          : ''
      }

      ${
        recommendation.warnings
          ? `
        <div class="result warning">
          <h4>⚠️ Warnings</h4>
          <ul>
            ${recommendation.warnings.map((w) => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
  `;
});

// ============================================
// TROUBLESHOOTER
// ============================================

let troubleshootHistory: DiagnosisStep[] = [];

function renderTroubleshootStep(step: DiagnosisStep): void {
  const container = document.getElementById('troubleshoot-content')!;

  if (step.solution) {
    container.innerHTML = `
      <button class="back-btn" id="troubleshoot-restart">← Start Over</button>
      <div class="result">
        <h3>${step.solution.title}</h3>
        <p>${step.solution.summary}</p>
        <h4>Steps to fix:</h4>
        <ol>
          ${step.solution.steps.map((s) => `<li>${s}</li>`).join('')}
        </ol>
        ${
          step.solution.tips
            ? `
          <div class="tip">
            <h4>Tips:</h4>
            <ul>
              ${step.solution.tips.map((t) => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
        ${
          step.solution.productRecommendation
            ? `<p><em>💡 ${step.solution.productRecommendation}</em></p>`
            : ''
        }
      </div>
    `;
  } else if (step.diagnosis) {
    container.innerHTML = `
      <button class="back-btn" id="troubleshoot-restart">← Start Over</button>
      <div class="result">
        <p>${step.diagnosis}</p>
      </div>
    `;
  } else if (step.question && step.options) {
    container.innerHTML = `
      ${
        troubleshootHistory.length > 0
          ? `<button class="back-btn" id="troubleshoot-back">← Back</button>`
          : ''
      }
      <h3>${step.question}</h3>
      <div class="options-grid">
        ${step.options
          .map(
            (opt) =>
              `<button class="option-btn" data-value="${opt.value}">${opt.label}</button>`
          )
          .join('')}
      </div>
    `;

    container.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = (btn as HTMLElement).dataset.value!;
        troubleshootHistory.push(step);
        const nextStep = processAnswer(step.id, value);
        renderTroubleshootStep(nextStep);
      });
    });
  }

  document.getElementById('troubleshoot-back')?.addEventListener('click', () => {
    const prevStep = troubleshootHistory.pop();
    if (prevStep) {
      renderTroubleshootStep(prevStep);
    }
  });

  document.getElementById('troubleshoot-restart')?.addEventListener('click', () => {
    troubleshootHistory = [];
    renderTroubleshootCategories();
  });
}

function renderTroubleshootCategories(): void {
  const container = document.getElementById('troubleshoot-content')!;
  const categories = Object.entries(TROUBLESHOOT_CATEGORIES);

  container.innerHTML = `
    <h3>What's the problem?</h3>
    <div class="options-grid">
      ${categories
        .map(
          ([key, cat]) =>
            `<button class="option-btn" data-category="${key}">
            <strong>${cat.label}</strong>
            <br><small>${cat.description}</small>
          </button>`
        )
        .join('')}
    </div>
  `;

  container.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = (btn as HTMLElement).dataset.category!;
      const step = getTroubleshootFlow(category as TroubleshootCategory);
      troubleshootHistory = [];
      renderTroubleshootStep(step);
    });
  });
}

// ============================================
// DETERGENT ADVISOR
// ============================================

function renderDetergent(): void {
  const container = document.getElementById('detergent-content')!;
  const formats = getAllDetergentFormats();
  const powderAdvantage = getWhyPowderBeatsPods();

  container.innerHTML = `
    <div class="section">
      <h3>🏆 Why Powder Beats Pods</h3>
      <div class="tip">
        <p><strong>${powderAdvantage.headline}</strong></p>
        <p>${powderAdvantage.summary}</p>
        <h4>Key Points:</h4>
        <ul>
          ${powderAdvantage.keyPoints.map((p) => `<li><strong>${p.title}</strong>: ${p.explanation}</li>`).join('')}
        </ul>
        <p><em>${powderAdvantage.conclusion}</em></p>
      </div>
    </div>

    <div class="section">
      <h3>Detergent Formats Compared</h3>
      ${formats
        .map(
          (f) => `
        <div class="result">
          <h4>${f.format.charAt(0).toUpperCase() + f.format.slice(1)}</h4>
          <p><strong>Pros:</strong> ${f.pros.join(', ')}</p>
          <p><strong>Cons:</strong> ${f.cons.join(', ')}</p>
          <p><em>Best for: ${f.bestFor}</em></p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>Get a Recommendation</h3>
      <label for="det-hardness">Water hardness:</label>
      <select id="det-hardness">
        <option value="soft">Soft</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>
      <label for="det-usage">Usage pattern:</label>
      <select id="det-usage">
        <option value="daily">Daily</option>
        <option value="regular">Regular (4-6/week)</option>
        <option value="occasional">Occasional (1-3/week)</option>
      </select>
      <label for="det-concern">Main concern:</label>
      <select id="det-concern">
        <option value="clean_dishes">Clean dishes</option>
        <option value="convenience">Convenience</option>
        <option value="cost">Cost</option>
        <option value="eco">Environment</option>
      </select>
      <button class="primary" id="get-detergent-rec">Get Recommendation</button>
      <div id="detergent-result"></div>
    </div>
  `;

  document.getElementById('get-detergent-rec')?.addEventListener('click', () => {
    const rec = getDetergentRecommendation({
      waterHardness: (document.getElementById('det-hardness') as HTMLSelectElement)
        .value as WaterHardness,
      usagePattern: (document.getElementById('det-usage') as HTMLSelectElement)
        .value as UsagePattern,
      mainConcern: (document.getElementById('det-concern') as HTMLSelectElement)
        .value as MainConcern,
      typicalSoilTypes: ['everyday'],
    });

    document.getElementById('detergent-result')!.innerHTML = `
      <div class="result">
        <h4>Recommended: ${rec.recommendedFormat.toUpperCase()}</h4>
        <p>${rec.reasoning}</p>
        ${
          rec.usageInstructions.length > 0
            ? `
          <h4>Usage Instructions:</h4>
          <ul>
            ${rec.usageInstructions.map((t) => `<li>${t}</li>`).join('')}
          </ul>
        `
            : ''
        }
        ${
          rec.warnings && rec.warnings.length > 0
            ? `
          <h4>Warnings:</h4>
          <ul>
            ${rec.warnings.map((w) => `<li>${w}</li>`).join('')}
          </ul>
        `
            : ''
        }
        ${rec.alternativeFormat ? `<p><em>Alternative: ${rec.alternativeFormat} - ${rec.alternativeReason}</em></p>` : ''}
      </div>
    `;
  });
}

// ============================================
// RINSE AID
// ============================================

function renderRinseAid(): void {
  const container = document.getElementById('rinse-aid-content')!;
  const explanation = getRinseAidExplanation();
  const tips = getDryingTips('mixed');

  container.innerHTML = `
    <div class="section">
      <h3>${explanation.title}</h3>
      <p>${explanation.whatItIs}</p>
      <h4>How it works:</h4>
      <ul>
        ${explanation.howItWorks.map((h) => `<li>${h}</li>`).join('')}
      </ul>
      <h4>Benefits:</h4>
      <ul>
        ${explanation.benefits.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h3>Get a Setting Recommendation</h3>
      <label for="ra-hardness">Water hardness:</label>
      <select id="ra-hardness">
        <option value="soft">Soft</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>
      <label for="ra-spots">Spot issues?</label>
      <select id="ra-spots">
        <option value="no">No spots</option>
        <option value="yes">Yes, spots on dishes</option>
      </select>
      <label for="ra-drying">Drying issues?</label>
      <select id="ra-drying">
        <option value="no">No drying issues</option>
        <option value="yes">Yes, dishes still wet</option>
      </select>
      <button class="primary" id="get-rinse-aid-rec">Get Recommendation</button>
      <div id="rinse-aid-result"></div>
    </div>

    <div class="section">
      <h3>Drying Tips</h3>
      <div class="tip">
        <ul>
          ${tips.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  document.getElementById('get-rinse-aid-rec')?.addEventListener('click', () => {
    const rec = getRinseAidRecommendation({
      waterHardness: (document.getElementById('ra-hardness') as HTMLSelectElement)
        .value as WaterHardness,
      hasSpotIssues: (document.getElementById('ra-spots') as HTMLSelectElement).value === 'yes',
      hasDryingIssues: (document.getElementById('ra-drying') as HTMLSelectElement).value === 'yes',
    });

    document.getElementById('rinse-aid-result')!.innerHTML = `
      <div class="result">
        <h4>Recommended Setting: ${rec.settingRecommendation.toUpperCase()}</h4>
        <p>${rec.reasoning}</p>
        <h4>Tips:</h4>
        <ul>
          ${rec.usageTips.map((t) => `<li>${t}</li>`).join('')}
        </ul>
        ${
          rec.urgentActions && rec.urgentActions.length > 0
            ? `
          <h4>Urgent Actions:</h4>
          <ul>
            ${rec.urgentActions.map((a) => `<li>${a}</li>`).join('')}
          </ul>
        `
            : ''
        }
      </div>
    `;
  });
}

// ============================================
// WATER HARDNESS
// ============================================

function renderWaterHardness(): void {
  const container = document.getElementById('water-hardness-content')!;
  const test = getWaterHardnessTest();
  const explanation = getHardnessExplanation();
  const levels = Object.entries(explanation.hardnessScale);

  container.innerHTML = `
    <div class="section">
      <h3>${test.name}</h3>
      <p>${test.description}</p>
      <h4>Steps:</h4>
      <ol>
        ${test.steps.map((s) => `<li>${s}</li>`).join('')}
      </ol>
    </div>

    <div class="section">
      <h3>Australian City Water Hardness</h3>
      <label for="city-select">Select your city:</label>
      <select id="city-select">
        <option value="">Choose a city...</option>
        <option value="sydney">Sydney</option>
        <option value="melbourne">Melbourne</option>
        <option value="brisbane">Brisbane</option>
        <option value="perth">Perth</option>
        <option value="adelaide">Adelaide</option>
        <option value="hobart">Hobart</option>
        <option value="canberra">Canberra</option>
        <option value="darwin">Darwin</option>
      </select>
      <div id="city-result"></div>
    </div>

    <div class="section">
      <h3>Hardness Levels Explained</h3>
      ${levels
        .map(
          ([key, value]) => `
        <div class="result">
          <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
          <p><strong>Range:</strong> ${value.range}</p>
          <p>${value.description}</p>
        </div>
      `
        )
        .join('')}
    </div>
  `;

  document.getElementById('city-select')?.addEventListener('change', (e) => {
    const city = (e.target as HTMLSelectElement).value;
    if (!city) return;

    const result = getAustralianCityHardness(city);
    const recs = getHardnessRecommendations(result.hardness);

    document.getElementById('city-result')!.innerHTML = `
      <div class="result">
        <h4>${result.city}</h4>
        <p><strong>Water Hardness:</strong> ${result.hardness.toUpperCase()}</p>
        ${result.ppmRange ? `<p><strong>PPM Range:</strong> ${result.ppmRange}</p>` : ''}
        ${result.source ? `<p><strong>Source:</strong> ${result.source}</p>` : ''}
        ${result.message ? `<p><em>${result.message}</em></p>` : ''}
        <h4>Recommendations:</h4>
        <ul>
          <li><strong>Detergent:</strong> ${recs.detergentAdjustment}</li>
          <li><strong>Rinse Aid:</strong> ${recs.rinseAidSetting}</li>
          ${recs.useSalt ? `<li><strong>Salt:</strong> Recommended</li>` : ''}
        </ul>
      </div>
    `;
  });
}

// ============================================
// MAINTENANCE
// ============================================

function renderMaintenance(): void {
  const container = document.getElementById('maintenance-content')!;
  const allTasks = getAllMaintenanceTasks();
  const critical = getCriticalTasks();
  const schedule = generateMaintenanceSchedule({ waterHardness: 'moderate', loadsPerWeek: 5 });

  // Group schedule tasks by adjusted frequency
  const tasksByFrequency = new Map<string, typeof schedule.tasks>();
  for (const entry of schedule.tasks) {
    const freq = entry.adjustedFrequency;
    if (!tasksByFrequency.has(freq)) tasksByFrequency.set(freq, []);
    tasksByFrequency.get(freq)!.push(entry);
  }

  container.innerHTML = `
    <div class="section">
      <h3>🚨 Critical Tasks</h3>
      ${critical
        .map(
          (task) => `
        <div class="result warning">
          <h4>${task.name}</h4>
          <p>${task.description}</p>
          <p><strong>Frequency:</strong> ${task.frequency}</p>
          <p><em>Signs you need this: ${task.signsNeeded[0]}</em></p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>📅 Full Maintenance Schedule</h3>
      <p><em>Based on moderate water hardness, ~5 loads/week</em></p>
      ${Array.from(tasksByFrequency.entries())
        .map(
          ([freq, entries]) => `
        <h4>${freq.charAt(0).toUpperCase() + freq.slice(1)}</h4>
        <ul>
          ${entries.map((e) => `<li>${e.task.name}: ${e.task.description}${e.reason ? ` <em>(${e.reason})</em>` : ''}</li>`).join('')}
        </ul>
      `
        )
        .join('')}
      ${
        schedule.nextActions.length > 0
          ? `
        <h4>Next Actions</h4>
        <ul>
          ${schedule.nextActions.map((a) => `<li>${a}</li>`).join('')}
        </ul>
      `
          : ''
      }
    </div>

    <div class="section">
      <h3>All Maintenance Tasks</h3>
      ${allTasks
        .map(
          (task) => `
        <div class="step">
          <strong>${task.name}</strong> (${task.frequency})
          <p>${task.description}</p>
          <details>
            <summary>How to do it</summary>
            <ol>
              ${task.steps.map((step) => `<li>${step}</li>`).join('')}
            </ol>
          </details>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

// ============================================
// CYCLES
// ============================================

function renderCycles(): void {
  const container = document.getElementById('cycles-content')!;
  const cycles = getAllCycles();
  const education = getAllEducationalContent();
  const [enzymes, prewash, temperature] = education;

  container.innerHTML = `
    <div class="section">
      <h3>Cycle Overview</h3>
      ${cycles
        .map(
          (cycle) => `
        <div class="result">
          <h4>${cycle.name}</h4>
          <p>${cycle.description}</p>
          <p><strong>Duration:</strong> ${cycle.duration}</p>
          <p><strong>Temperature:</strong> ${cycle.temperature}</p>
          <p><strong>Best for:</strong> ${cycle.bestFor.join(', ')}</p>
          <p><em>${cycle.detergentNotes}</em></p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section">
      <h3>Understanding Your Dishwasher</h3>

      <h4>🧬 How Enzymes Work</h4>
      <div class="tip">
        <p><strong>${enzymes.title}</strong></p>
        <p>${enzymes.content}</p>
        <p><em>${enzymes.keyTakeaway}</em></p>
      </div>

      <h4>💧 Pre-wash Phase</h4>
      <div class="tip">
        <p><strong>${prewash.title}</strong></p>
        <p>${prewash.content}</p>
        <p><em>${prewash.keyTakeaway}</em></p>
      </div>

      <h4>🌡️ Temperature Effects</h4>
      <div class="tip">
        <p><strong>${temperature.title}</strong></p>
        <p>${temperature.content}</p>
        <p><em>${temperature.keyTakeaway}</em></p>
      </div>
    </div>
  `;
}

// ============================================
// INITIALIZE
// ============================================

renderQuickStart();
renderTroubleshootCategories();
renderDetergent();
renderRinseAid();
renderWaterHardness();
renderMaintenance();
renderCycles();

// Restore tab state after all content is rendered
restoreTabState();
