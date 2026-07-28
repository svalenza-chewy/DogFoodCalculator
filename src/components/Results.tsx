import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCopy,
  Heart,
  LineChart,
  PackageCheck,
  Scale,
  Share2,
  ShoppingCart,
  Stethoscope,
  TriangleAlert
} from "lucide-react";
import {
  calculateFeedingEstimate,
  concernLabels,
  formatCurrency,
  priorityLabels
} from "../logic/recommendationEngine";
import type { FinderAnswers, ProductRecommendation, RecommendationResult, RecommendationScore } from "../types";
import { Button, Callout, MedicalDisclaimer, ProductArtwork, ScoreRing, TrustBadge } from "./ui";

function scoreEntries(score: RecommendationScore) {
  return [
    ["Nutrition match", score.nutrition],
    ["Health-needs match", score.health],
    ["Life-stage and size", score.lifeStageSize],
    ["Ingredient and format", score.ingredientFormat],
    ["Veterinary guidance", score.veterinaryGuidance],
    ["Shopping priorities", score.customerPriority],
    ["Price and convenience", score.priceConvenience]
  ];
}

function RecommendationCard({
  recommendation,
  rank,
  dogName,
  expanded,
  compareSelected,
  saved,
  onToggleExpand,
  onToggleCompare,
  onToggleSaved,
  onSelectPlan
}: {
  recommendation: ProductRecommendation;
  rank: number;
  dogName: string;
  expanded: boolean;
  compareSelected: boolean;
  saved: boolean;
  onToggleExpand: () => void;
  onToggleCompare: () => void;
  onToggleSaved: () => void;
  onSelectPlan: () => void;
}) {
  const product = recommendation.product;
  const autoshipPrice = product.packages[0].price * (1 - product.autoshipDiscountPct / 100);

  return (
    <article className="recommendation-card">
      <div className="rank-badge">#{rank}</div>
      <div className="recommendation-main">
        <ProductArtwork product={product} />
        <div className="recommendation-copy">
          <div className="product-title-row">
            <div>
              <span className="brand">{product.brand}</span>
              <h2>{product.name}</h2>
            </div>
            <ScoreRing score={recommendation.score.overall} label="match" />
          </div>
          <TrustBadge recommendation={recommendation} />
          <div className="product-meta">
            <span>{product.format}</span>
            <span>{product.packages[0].size}</span>
            <span>{product.primaryProtein}</span>
            <span>{product.calories} kcal/{product.feeding.unit}</span>
          </div>
          <div className="commerce-row">
            <div>
              <strong>{formatCurrency(product.packages[0].price)}</strong>
              <span>Autoship {formatCurrency(autoshipPrice)}</span>
            </div>
            <div>
              <strong>{formatCurrency(recommendation.estimatedCostPerDay)}</strong>
              <span>estimated per day</span>
            </div>
            <div>
              <strong>{product.rating.toFixed(1)}</strong>
              <span>{product.reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>
          <div className="action-row">
            <Button>
              <ShoppingCart size={17} aria-hidden="true" />
              Add to Cart
            </Button>
            <Button variant="secondary">
              <PackageCheck size={17} aria-hidden="true" />
              Start Autoship
            </Button>
            <Button variant="ghost" onClick={onToggleCompare}>
              <Scale size={17} aria-hidden="true" />
              {compareSelected ? "Remove Compare" : "Compare"}
            </Button>
            <Button variant="ghost" onClick={onToggleSaved}>
              <Heart size={17} aria-hidden="true" />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="recommendation-details">
        <div>
          <h3>Why this is a strong match for {dogName || "your dog"}</h3>
          <ul className="reason-list">
            {recommendation.reasons.map((reason) => (
              <li key={reason.text}>
                <CheckCircle2 size={16} aria-hidden="true" />
                {reason.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Things to consider</h3>
          <ul className="tradeoff-list">
            {recommendation.tradeoffs.map((tradeoff) => (
              <li key={tradeoff.text} className={`tradeoff-${tradeoff.severity}`}>
                <TriangleAlert size={16} aria-hidden="true" />
                {tradeoff.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-footer">
        <button type="button" onClick={onToggleExpand}>
          {expanded ? "Hide score breakdown" : "View score breakdown"}
        </button>
        <button type="button" onClick={onSelectPlan}>
          Show feeding estimate
        </button>
        <button type="button">
          <Share2 size={15} aria-hidden="true" />
          Share with my veterinarian
        </button>
      </div>

      {expanded ? (
        <div className="score-breakdown">
          <p>
            Overall score is a recommendation aid based on mocked product data. It is not a medical rating, diagnosis, or guarantee.
          </p>
          {scoreEntries(recommendation.score).map(([label, value]) => (
            <div className="score-bar" key={label}>
              <span>{label}</span>
              <div>
                <span style={{ width: `${value}%` }} />
              </div>
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ComparisonTable({ recommendations }: { recommendations: ProductRecommendation[] }) {
  if (!recommendations.length) {
    return (
      <div className="empty-state">
        <Scale size={20} />
        <strong>Select up to three products to compare.</strong>
      </div>
    );
  }

  const rows = [
    ["Overall match", (rec: ProductRecommendation) => `${rec.score.overall}%`],
    ["Price", (rec: ProductRecommendation) => formatCurrency(rec.product.packages[0].price)],
    ["Autoship price", (rec: ProductRecommendation) => formatCurrency(rec.product.packages[0].price * (1 - rec.product.autoshipDiscountPct / 100))],
    ["Cost per day", (rec: ProductRecommendation) => formatCurrency(rec.estimatedCostPerDay)],
    ["Food format", (rec: ProductRecommendation) => rec.product.format],
    ["Primary protein", (rec: ProductRecommendation) => rec.product.primaryProtein],
    ["Calories", (rec: ProductRecommendation) => `${rec.product.calories} kcal/${rec.product.feeding.unit}`],
    ["Protein / fat / fiber", (rec: ProductRecommendation) => `${rec.product.nutrients.proteinPct}% / ${rec.product.nutrients.fatPct}% / ${rec.product.nutrients.fiberPct}%`],
    ["Life stage", (rec: ProductRecommendation) => rec.product.lifeStages.join(", ")],
    ["Breed size", (rec: ProductRecommendation) => rec.product.breedSizes.join(", ")],
    ["Trust signal", (rec: ProductRecommendation) => rec.trustSignal.label],
    ["Availability", (rec: ProductRecommendation) => rec.product.availability],
    ["Prescription required", (rec: ProductRecommendation) => (rec.product.vetAuthorizationRequired ? "Yes" : "No")]
  ] as const;

  return (
    <div className="comparison-table" role="region" aria-label="Product comparison">
      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            {recommendations.map((rec) => (
              <th key={rec.product.id}>{rec.product.brand}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, getValue]) => (
            <tr key={label}>
              <th>{label}</th>
              {recommendations.map((rec) => (
                <td key={rec.product.id}>{getValue(rec)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeedingAndTransition({
  recommendation,
  answers
}: {
  recommendation: ProductRecommendation;
  answers: FinderAnswers;
}) {
  const estimate = calculateFeedingEstimate(recommendation.product, answers);
  const sensitive = answers.health.observed.includes("sensitive-stomach") || recommendation.product.transitionDifficulty === "slow";
  const transition = sensitive
    ? [
        ["Days 1-3", "25% new food / 75% current food"],
        ["Days 4-6", "50% new food / 50% current food"],
        ["Days 7-9", "75% new food / 25% current food"],
        ["Day 10+", "100% new food if stool and appetite are steady"]
      ]
    : [
        ["Days 1-2", "25% new food / 75% current food"],
        ["Days 3-4", "50% new food / 50% current food"],
        ["Days 5-6", "75% new food / 25% current food"],
        ["Day 7", "100% new food"]
      ];

  return (
    <section className="results-module">
      <div className="module-heading">
        <CalendarDays size={20} aria-hidden="true" />
        <div>
          <h2>Feeding estimate and transition plan</h2>
          <p>Based on {answers.dogProfile.currentWeight} lb, {answers.dogProfile.activityLevel} activity, and mocked calorie data.</p>
        </div>
      </div>

      <div className="estimate-grid">
        <div>
          <span>Daily calories</span>
          <strong>{estimate.dailyCalories.toLocaleString()} kcal</strong>
        </div>
        <div>
          <span>Estimated amount</span>
          <strong>
            {estimate.dailyAmount} {estimate.unit}/day
          </strong>
        </div>
        <div>
          <span>Package duration</span>
          <strong>{estimate.packageDurationDays} days</strong>
        </div>
        <div>
          <span>Autoship cadence</span>
          <strong>Every {estimate.autoshipCadenceWeeks} weeks</strong>
        </div>
        <div>
          <span>Monthly cost</span>
          <strong>{formatCurrency(estimate.monthlyCost)}</strong>
        </div>
        <div>
          <span>Annual cost</span>
          <strong>{formatCurrency(estimate.annualCost)}</strong>
        </div>
      </div>

      <div className="timeline">
        {transition.map(([days, mix]) => (
          <div key={days}>
            <strong>{days}</strong>
            <span>{mix}</span>
          </div>
        ))}
      </div>
      <Callout title="Transition note">
        Pause or slow the transition if digestive discomfort appears, and ask a veterinarian about persistent symptoms.
      </Callout>
    </section>
  );
}

function AskVetModal({
  answers,
  result,
  onClose
}: {
  answers: FinderAnswers;
  result: RecommendationResult;
  onClose: () => void;
}) {
  const topProducts = result.recommendations.slice(0, 3).map((rec) => `${rec.product.brand} ${rec.product.name}`);

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ask-vet-title">
        <div className="module-heading">
          <Stethoscope size={22} aria-hidden="true" />
          <div>
            <h2 id="ask-vet-title">Veterinary review summary</h2>
            <p>Prototype summary for a clinic conversation or Chewy veterinary support handoff.</p>
          </div>
        </div>
        <div className="summary-copy">
          <p>
            <strong>Dog:</strong> {answers.dogProfile.name}, {answers.dogProfile.currentWeight} lb {answers.dogProfile.lifeStage}{" "}
            {answers.dogProfile.breed}
          </p>
          <p>
            <strong>Reported concerns:</strong>{" "}
            {[...answers.health.observed, ...answers.health.diagnosed].map((concern) => concernLabels[concern] ?? concern).join(", ") || "None selected"}
          </p>
          <p>
            <strong>Current diet:</strong> {answers.currentDiet.brand} {answers.currentDiet.product}, {answers.currentDiet.feedingAmount}
          </p>
          <p>
            <strong>Ingredient avoids:</strong> {answers.ingredients.avoidIngredients.join(", ") || "None selected"}
          </p>
          <p>
            <strong>Top recommendations:</strong> {topProducts.join("; ")}
          </p>
          <p>
            <strong>Veterinarian guidance entered:</strong> {answers.veterinarianGuidance.notes || "No notes entered"}
          </p>
        </div>
        <div className="action-row">
          <Button>
            <ClipboardCopy size={17} aria-hidden="true" />
            Copy Summary
          </Button>
          <Button variant="secondary">
            <Share2 size={17} aria-hidden="true" />
            Share
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ResultsView({
  answers,
  setAnswers,
  result
}: {
  answers: FinderAnswers;
  setAnswers: Dispatch<SetStateAction<FinderAnswers>>;
  result: RecommendationResult;
}) {
  const [expandedId, setExpandedId] = useState(result.recommendations[0]?.product.id ?? "");
  const [compareIds, setCompareIds] = useState<string[]>(result.recommendations.slice(0, 2).map((rec) => rec.product.id));
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [planProductId, setPlanProductId] = useState(result.recommendations[0]?.product.id ?? "");
  const [vetModalOpen, setVetModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    ateFood: "not-yet",
    stoolQuality: "not-yet",
    vetApproved: "not-yet",
    purchaseAgain: "not-yet"
  });

  const compareRecommendations = useMemo(
    () => result.recommendations.filter((recommendation) => compareIds.includes(recommendation.product.id)),
    [compareIds, result.recommendations]
  );
  const planRecommendation =
    result.recommendations.find((recommendation) => recommendation.product.id === planProductId) ?? result.recommendations[0];

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  return (
    <div className="results-view">
      <section className="results-hero">
        <div>
          <span className="eyebrow">Personalized recommendations</span>
          <h1>{answers.dogProfile.name || "Your dog"}'s dog food matches</h1>
          <p>
            Ranked from {result.evaluatedCount} mocked products using nutrition, health needs, life stage, ingredient compatibility,
            veterinarian guidance, priorities, and commerce fit.
          </p>
          <div className="hero-tags">
            <span>{answers.dogProfile.currentWeight} lb</span>
            <span>{answers.dogProfile.activityLevel} activity</span>
            <span>{answers.dogProfile.bodyCondition} body condition</span>
            {answers.topPriorities.map((priority) => (
              <span key={priority}>{priorityLabels[priority]}</span>
            ))}
          </div>
        </div>
        <div className="results-stats">
          <ScoreRing score={result.recommendations[0]?.score.overall ?? 0} label="top match" />
          <div>
            <strong>{result.recommendations.length}</strong>
            <span>ranked options</span>
          </div>
          <div>
            <strong>{result.evaluatedCount}</strong>
            <span>products evaluated</span>
          </div>
        </div>
      </section>

      {result.requiresTherapeuticDiet ? (
        <section className="prescription-notice">
          <div className="module-heading">
            <TriangleAlert size={22} aria-hidden="true" />
            <div>
              <h2>Therapeutic nutrition may be needed</h2>
              <p>
                You selected {result.therapeuticConcerns.map((concern) => concernLabels[concern] ?? concern).join(", ")}. Some
                surfaced products require veterinary authorization.
              </p>
            </div>
          </div>
          <label className="check-row check-row-large">
            <input
              type="checkbox"
              checked={answers.therapeuticAcknowledged}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  therapeuticAcknowledged: event.target.checked
                }))
              }
            />
            I understand the final food choice should be confirmed with a veterinarian
          </label>
        </section>
      ) : null}

      {result.noPerfectMatch ? (
        <Callout tone="warning" title="Closest available options">
          No product met every hard filter. The list below shows the closest mocked options and explains which requirements could not be
          met.
        </Callout>
      ) : null}

      <div className="recommendation-list">
        {result.recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.product.id}
            recommendation={recommendation}
            rank={index + 1}
            dogName={answers.dogProfile.name}
            expanded={expandedId === recommendation.product.id}
            compareSelected={compareIds.includes(recommendation.product.id)}
            saved={savedIds.includes(recommendation.product.id)}
            onToggleExpand={() => setExpandedId((current) => (current === recommendation.product.id ? "" : recommendation.product.id))}
            onToggleCompare={() => toggleCompare(recommendation.product.id)}
            onToggleSaved={() =>
              setSavedIds((current) =>
                current.includes(recommendation.product.id)
                  ? current.filter((item) => item !== recommendation.product.id)
                  : [...current, recommendation.product.id]
              )
            }
            onSelectPlan={() => setPlanProductId(recommendation.product.id)}
          />
        ))}
      </div>

      <section className="results-module">
        <div className="module-heading">
          <Scale size={20} aria-hidden="true" />
          <div>
            <h2>Compare selected products</h2>
            <p>Highlighted differences are intended for shopping confidence, not medical superiority.</p>
          </div>
        </div>
        <ComparisonTable recommendations={compareRecommendations} />
      </section>

      {planRecommendation ? <FeedingAndTransition recommendation={planRecommendation} answers={answers} /> : null}

      <section className="results-grid">
        <div className="results-module">
          <div className="module-heading">
            <Stethoscope size={20} aria-hidden="true" />
            <div>
              <h2>Ask a vet</h2>
              <p>Prepare a concise summary of the pet profile, concerns, preferences, and top recommendations.</p>
            </div>
          </div>
          <div className="action-row">
            <Button onClick={() => setVetModalOpen(true)}>
              <Stethoscope size={17} aria-hidden="true" />
              Review With a Vet
            </Button>
            <Button variant="secondary">
              <ClipboardCopy size={17} aria-hidden="true" />
              Prepare Questions
            </Button>
          </div>
        </div>

        <div className="results-module">
          <div className="module-heading">
            <BadgeCheck size={20} aria-hidden="true" />
            <div>
              <h2>Saved pet profile</h2>
              <p>Prototype retention moments for profile, preferences, recommendations, and Autoship cadence.</p>
            </div>
          </div>
          <div className="saved-profile-list">
            <span>Profile saved</span>
            <span>{savedIds.length} saved recommendations</span>
            <span>Recalculate at adulthood or senior stage</span>
            <span>Recalculate if weight changes or product becomes unavailable</span>
          </div>
        </div>
      </section>

      <section className="results-module">
        <div className="module-heading">
          <LineChart size={20} aria-hidden="true" />
          <div>
            <h2>Recommendation feedback loop</h2>
            <p>Future recommendations could improve with structured post-purchase feedback.</p>
          </div>
        </div>
        <div className="feedback-grid">
          {[
            ["ateFood", "Did your dog eat the food?"],
            ["stoolQuality", "How was stool quality?"],
            ["vetApproved", "Did your veterinarian approve the food?"],
            ["purchaseAgain", "Would you purchase this food again?"]
          ].map(([key, label]) => (
            <label key={key} className="field">
              <span className="field-label">{label}</span>
              <select
                value={feedback[key as keyof typeof feedback]}
                onChange={(event) =>
                  setFeedback((current) => ({
                    ...current,
                    [key]: event.target.value
                  }))
                }
              >
                <option value="not-yet">Not yet</option>
                <option value="yes">Yes</option>
                <option value="mixed">Mixed</option>
                <option value="no">No</option>
              </select>
            </label>
          ))}
        </div>
        <Callout title="Feedback standard">
          Customer-reported improvement should help tune fit and satisfaction. It should not be treated as proof of medical
          effectiveness.
        </Callout>
      </section>

      <MedicalDisclaimer />

      {vetModalOpen ? <AskVetModal answers={answers} result={result} onClose={() => setVetModalOpen(false)} /> : null}
    </div>
  );
}
