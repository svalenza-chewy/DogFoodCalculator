import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Save, Sparkles } from "lucide-react";
import { Questionnaire, steps } from "./components/Questionnaire";
import { ResultsView } from "./components/Results";
import { Button, Callout, MedicalDisclaimer } from "./components/ui";
import { defaultAnswers } from "./data/defaultAnswers";
import { concernLabels, getRecommendations, priorityLabels } from "./logic/recommendationEngine";
import type { FinderAnswers } from "./types";

const storageKey = "chewy-dog-food-finder-answers-v1";

function loadAnswers(): FinderAnswers {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultAnswers;
    return { ...defaultAnswers, ...JSON.parse(stored) };
  } catch {
    return defaultAnswers;
  }
}

function getValidationMessage(step: number, answers: FinderAnswers) {
  if (step === 0) {
    if (!answers.dogProfile.name.trim()) return "Add a dog name to personalize the recommendations.";
    if (!answers.dogProfile.breed.trim() && !answers.dogProfile.mixedBreed) return "Add a breed or select mixed breed/not sure.";
    if (!answers.dogProfile.currentWeight || answers.dogProfile.currentWeight <= 0) return "Add a current weight greater than zero.";
  }

  if (step === 4 && answers.topPriorities.length !== 3) {
    return "Choose exactly three priorities so commercial factors can be used as tie-breakers.";
  }

  return "";
}

function SummaryRail({
  answers,
  activeStep
}: {
  answers: FinderAnswers;
  activeStep: number;
}) {
  const concerns = [...answers.health.observed, ...answers.health.diagnosed].filter((concern) => concern !== "no-known");

  return (
    <aside className="summary-rail" aria-label="Current pet profile summary">
      <div className="summary-card profile-summary">
        <span className="eyebrow">Pet profile</span>
        <h2>{answers.dogProfile.name || "New dog"}</h2>
        <p>
          {answers.dogProfile.currentWeight} lb {answers.dogProfile.lifeStage} · {answers.dogProfile.activityLevel} activity ·{" "}
          {answers.dogProfile.bodyCondition}
        </p>
        <div className="mini-tags">
          <span>{answers.dogProfile.breed || "Breed not set"}</span>
          <span>{answers.currentDiet.format} food now</span>
          <span>{answers.currentDiet.mealsPerDay} meals/day</span>
        </div>
      </div>

      <div className="summary-card">
        <span className="eyebrow">Needs and preferences</span>
        <div className="summary-list">
          <div>
            <strong>Health</strong>
            <span>{concerns.map((concern) => concernLabels[concern] ?? concern).join(", ") || "No concerns selected"}</span>
          </div>
          <div>
            <strong>Avoids</strong>
            <span>{answers.ingredients.avoidIngredients.join(", ") || "None selected"}</span>
          </div>
          <div>
            <strong>Priorities</strong>
            <span>{answers.topPriorities.map((priority) => priorityLabels[priority] ?? priority).join(", ") || "Not selected"}</span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <span className="eyebrow">Progress saved</span>
        <p>Answers persist in local storage for refreshes during stakeholder demos.</p>
        <div className="save-indicator">
          <Save size={16} aria-hidden="true" />
          Step {Math.min(activeStep + 1, steps.length)} of {steps.length}
        </div>
      </div>

      <MedicalDisclaimer />
    </aside>
  );
}

export default function App() {
  const [answers, setAnswers] = useState<FinderAnswers>(loadAnswers);
  const [activeStep, setActiveStep] = useState(0);
  const [isScoring, setIsScoring] = useState(false);
  const result = useMemo(() => getRecommendations(answers), [answers]);
  const validationMessage = getValidationMessage(activeStep, answers);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers]);

  const goNext = () => {
    if (validationMessage) return;
    if (activeStep === steps.length - 2) {
      setIsScoring(true);
      window.setTimeout(() => {
        setActiveStep(steps.length - 1);
        setIsScoring(false);
      }, 450);
      return;
    }
    setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goBack = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const resetPrototype = () => {
    setAnswers(defaultAnswers);
    setActiveStep(0);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark">C</div>
          <div>
            <span>Chewy prototype</span>
            <strong>Dog Food Finder</strong>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={resetPrototype}>
            <RefreshCw size={17} aria-hidden="true" />
            Reset Demo
          </Button>
        </div>
      </header>

      <nav className="progress-nav" aria-label="Recommendation progress">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = index < activeStep;
          const isActive = index === activeStep;

          return (
            <button
              key={step.label}
              className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
              type="button"
              onClick={() => setActiveStep(index)}
            >
              <span>
                <Icon size={16} aria-hidden="true" />
              </span>
              {step.label}
            </button>
          );
        })}
      </nav>

      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }} />
      </div>

      {isScoring ? (
        <main className="loading-state">
          <div className="loading-card">
            <Sparkles size={28} aria-hidden="true" />
            <h1>Building ranked recommendations</h1>
            <p>Evaluating nutrition, health considerations, ingredients, veterinarian guidance, price, availability, and Autoship fit.</p>
            <div className="loading-bar">
              <span />
            </div>
          </div>
        </main>
      ) : activeStep === steps.length - 1 ? (
        <main className="results-main">
          <ResultsView answers={answers} setAnswers={setAnswers} result={result} />
        </main>
      ) : (
        <main className="main-layout">
          <section className="question-panel">
            {validationMessage ? <Callout tone="warning">{validationMessage}</Callout> : null}
            <Questionnaire answers={answers} setAnswers={setAnswers} activeStep={activeStep} />
            <div className="navigation-row">
              <Button variant="secondary" onClick={goBack} disabled={activeStep === 0}>
                <ArrowLeft size={17} aria-hidden="true" />
                Back
              </Button>
              <Button onClick={goNext} disabled={Boolean(validationMessage)}>
                {activeStep === steps.length - 2 ? "See Recommendations" : "Continue"}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </section>
          <SummaryRail answers={answers} activeStep={activeStep} />
        </main>
      )}
    </div>
  );
}
