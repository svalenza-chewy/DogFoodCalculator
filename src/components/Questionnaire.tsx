import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Activity,
  BadgeCheck,
  Bone,
  ClipboardList,
  Dog,
  HeartPulse,
  Home,
  PackageSearch,
  Scale,
  ShieldQuestion,
  Sparkles,
  Stethoscope,
  Utensils
} from "lucide-react";
import {
  activityOptions,
  avoidIngredientOptions,
  bodyConditionOptions,
  customerPriorityOptions,
  diagnosedConcernOptions,
  dietaryPreferenceOptions,
  foodFormatOptions,
  lifeStageOptions,
  observedConcernOptions,
  proteinOptions,
  reasonsForChange,
  sexOptions
} from "../data/options";
import { getTherapeuticConcerns, priorityLabels } from "../logic/recommendationEngine";
import type { FinderAnswers } from "../types";
import { Callout, Chip, Field, OptionCard } from "./ui";

export const steps = [
  { label: "Dog profile", icon: Dog },
  { label: "Current diet", icon: Utensils },
  { label: "Health needs", icon: HeartPulse },
  { label: "Ingredients", icon: Bone },
  { label: "Priorities", icon: Scale },
  { label: "Veterinary guidance", icon: Stethoscope },
  { label: "Recommendations", icon: PackageSearch }
];

function toggleValue(values: string[], value: string, max?: number) {
  if (values.includes(value)) return values.filter((item) => item !== value);
  if (max && values.length >= max) return values;
  return [...values, value];
}

function SectionIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="section-intro">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}

export function Questionnaire({
  answers,
  setAnswers,
  activeStep
}: {
  answers: FinderAnswers;
  setAnswers: Dispatch<SetStateAction<FinderAnswers>>;
  activeStep: number;
}) {
  const setDog = <K extends keyof FinderAnswers["dogProfile"]>(key: K, value: FinderAnswers["dogProfile"][K]) => {
    setAnswers((current) => ({
      ...current,
      dogProfile: { ...current.dogProfile, [key]: value }
    }));
  };

  const setDiet = <K extends keyof FinderAnswers["currentDiet"]>(key: K, value: FinderAnswers["currentDiet"][K]) => {
    setAnswers((current) => ({
      ...current,
      currentDiet: { ...current.currentDiet, [key]: value }
    }));
  };

  const setVet = <K extends keyof FinderAnswers["veterinarianGuidance"]>(
    key: K,
    value: FinderAnswers["veterinarianGuidance"][K]
  ) => {
    setAnswers((current) => ({
      ...current,
      veterinarianGuidance: { ...current.veterinarianGuidance, [key]: value }
    }));
  };

  const toggleObserved = (value: string) => {
    setAnswers((current) => {
      const nextObserved =
        value === "no-known"
          ? current.health.observed.includes("no-known")
            ? []
            : ["no-known"]
          : toggleValue(current.health.observed.filter((item) => item !== "no-known"), value);

      return {
        ...current,
        health: { ...current.health, observed: nextObserved }
      };
    });
  };

  const toggleDiagnosed = (value: string) => {
    setAnswers((current) => ({
      ...current,
      health: { ...current.health, diagnosed: toggleValue(current.health.diagnosed, value) },
      therapeuticAcknowledged: false
    }));
  };

  const toggleProtein = (value: string) => {
    setAnswers((current) => ({
      ...current,
      ingredients: {
        ...current.ingredients,
        preferredProteins: value === "No preference" ? ["No preference"] : toggleValue(current.ingredients.preferredProteins.filter((item) => item !== "No preference"), value)
      }
    }));
  };

  const toggleAvoid = (value: string) => {
    setAnswers((current) => ({
      ...current,
      ingredients: { ...current.ingredients, avoidIngredients: toggleValue(current.ingredients.avoidIngredients, value) }
    }));
  };

  const toggleDietaryPreference = (value: string) => {
    setAnswers((current) => ({
      ...current,
      ingredients: {
        ...current.ingredients,
        dietaryPreferences:
          value === "No preference"
            ? ["No preference"]
            : toggleValue(current.ingredients.dietaryPreferences.filter((item) => item !== "No preference"), value)
      }
    }));
  };

  const togglePriority = (value: string) => {
    setAnswers((current) => ({
      ...current,
      topPriorities: toggleValue(current.topPriorities, value, 3)
    }));
  };

  if (activeStep === 0) {
    return (
      <div className="step-shell">
        <SectionIntro eyebrow="Step 1" title={`Create ${answers.dogProfile.name || "your dog"}'s profile`}>
          A few profile details help the calculator separate life-stage, size, activity, and body-condition needs.
        </SectionIntro>

        <div className="profile-hero">
          <div className="dog-portrait" aria-hidden="true">
            <div className="dog-head" />
            <div className="dog-body" />
            <div className="dog-bandana" />
          </div>
          <div>
            <strong>{answers.dogProfile.name || "New dog"}</strong>
            <span>
              {answers.dogProfile.breed || "Breed not entered"} · {answers.dogProfile.currentWeight} lb ·{" "}
              {answers.dogProfile.lifeStage}
            </span>
          </div>
        </div>

        <div className="form-grid two">
          <Field label="Dog's name">
            <input value={answers.dogProfile.name} onChange={(event) => setDog("name", event.target.value)} />
          </Field>
          <Field label="Breed" helper="Choose mixed breed if the exact breed is not known.">
            <input value={answers.dogProfile.breed} onChange={(event) => setDog("breed", event.target.value)} />
          </Field>
          <label className="check-row">
            <input
              type="checkbox"
              checked={answers.dogProfile.mixedBreed}
              onChange={(event) => setDog("mixedBreed", event.target.checked)}
            />
            Mixed breed or not sure
          </label>
          <Field label="Current weight">
            <div className="input-with-unit">
              <input
                type="number"
                min={1}
                value={answers.dogProfile.currentWeight}
                onChange={(event) => setDog("currentWeight", Number(event.target.value))}
              />
              <span>lb</span>
            </div>
          </Field>
          <Field label="Age">
            <div className="input-with-unit">
              <input
                type="number"
                min={0}
                step={0.1}
                value={answers.dogProfile.ageYears}
                onChange={(event) => setDog("ageYears", Number(event.target.value))}
              />
              <span>years</span>
            </div>
          </Field>
          {answers.dogProfile.lifeStage === "puppy" ? (
            <Field label="Expected adult weight" helper="Helpful for large-breed puppy nutrition.">
              <div className="input-with-unit">
                <input
                  type="number"
                  min={1}
                  value={answers.dogProfile.expectedAdultWeight ?? answers.dogProfile.currentWeight}
                  onChange={(event) => setDog("expectedAdultWeight", Number(event.target.value))}
                />
                <span>lb</span>
              </div>
            </Field>
          ) : null}
        </div>

        <div className="card-group">
          <h2>Life stage</h2>
          <div className="card-grid three">
            {lifeStageOptions.map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                description={option.description}
                selected={answers.dogProfile.lifeStage === option.value}
                icon={<BadgeCheck size={18} />}
                onClick={() => setDog("lifeStage", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-grid two">
          <Field label="Sex">
            <select value={answers.dogProfile.sex} onChange={(event) => setDog("sex", event.target.value as FinderAnswers["dogProfile"]["sex"])}>
              {sexOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <label className="check-row">
            <input
              type="checkbox"
              checked={answers.dogProfile.spayedNeutered}
              onChange={(event) => setDog("spayedNeutered", event.target.checked)}
            />
            Spayed or neutered
          </label>
        </div>

        <div className="card-group">
          <h2>Activity level</h2>
          <div className="card-grid four">
            {activityOptions.map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                description={option.description}
                selected={answers.dogProfile.activityLevel === option.value}
                icon={<Activity size={18} />}
                onClick={() => setDog("activityLevel", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="card-group">
          <h2>Body condition</h2>
          <div className="card-grid three">
            {bodyConditionOptions.map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                description={option.description}
                selected={answers.dogProfile.bodyCondition === option.value}
                icon={<Scale size={18} />}
                onClick={() => setDog("bodyCondition", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-grid two">
          <Field label="Lifestyle">
            <select
              value={answers.dogProfile.lifestyle}
              onChange={(event) => setDog("lifestyle", event.target.value as FinderAnswers["dogProfile"]["lifestyle"])}
            >
              <option value="indoor">Mostly indoor</option>
              <option value="outdoor">Mostly outdoor</option>
              <option value="mixed">Indoor and outdoor</option>
            </select>
          </Field>
          <Field label="Dogs in household">
            <div className="input-with-unit">
              <input
                type="number"
                min={1}
                value={answers.dogProfile.householdDogs}
                onChange={(event) => setDog("householdDogs", Number(event.target.value))}
              />
              <span>dogs</span>
            </div>
          </Field>
        </div>
      </div>
    );
  }

  if (activeStep === 1) {
    return (
      <div className="step-shell">
        <SectionIntro eyebrow="Step 2" title="Understand the current feeding routine">
          Current diet details help distinguish a full switch from a better plan around food, treats, toppers, and meals.
        </SectionIntro>

        <div className="form-grid two">
          <Field label="Current food brand">
            <input value={answers.currentDiet.brand} onChange={(event) => setDiet("brand", event.target.value)} />
          </Field>
          <Field label="Current product">
            <input value={answers.currentDiet.product} onChange={(event) => setDiet("product", event.target.value)} />
          </Field>
          <Field label="Food format">
            <select value={answers.currentDiet.format} onChange={(event) => setDiet("format", event.target.value as FinderAnswers["currentDiet"]["format"])}>
              {foodFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Months on this food">
            <input
              type="number"
              min={0}
              value={answers.currentDiet.durationMonths}
              onChange={(event) => setDiet("durationMonths", Number(event.target.value))}
            />
          </Field>
          <Field label="Current feeding amount">
            <input value={answers.currentDiet.feedingAmount} onChange={(event) => setDiet("feedingAmount", event.target.value)} />
          </Field>
          <Field label="Meals per day">
            <input
              type="number"
              min={1}
              max={6}
              value={answers.currentDiet.mealsPerDay}
              onChange={(event) => setDiet("mealsPerDay", Number(event.target.value))}
            />
          </Field>
        </div>

        <div className="card-group">
          <h2>How is the current food working?</h2>
          <div className="card-grid three">
            {[
              { value: "yes", label: "Satisfied", description: "Mainly validating or fine-tuning" },
              { value: "somewhat", label: "Somewhat", description: "Some things work, some could improve" },
              { value: "no", label: "Not satisfied", description: "Looking for a more meaningful change" }
            ].map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                description={option.description}
                selected={answers.currentDiet.satisfied === option.value}
                icon={<ShieldQuestion size={18} />}
                onClick={() => setDiet("satisfied", option.value as FinderAnswers["currentDiet"]["satisfied"])}
              />
            ))}
          </div>
        </div>

        <div className="form-grid three">
          <Field label="Treat consumption">
            <select
              value={answers.currentDiet.treatLevel}
              onChange={(event) => setDiet("treatLevel", event.target.value as FinderAnswers["currentDiet"]["treatLevel"])}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Food enthusiasm">
            <select
              value={answers.currentDiet.enthusiasm}
              onChange={(event) => setDiet("enthusiasm", event.target.value as FinderAnswers["currentDiet"]["enthusiasm"])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <label className="check-row">
            <input
              type="checkbox"
              checked={answers.currentDiet.toppersOrSupplements}
              onChange={(event) => setDiet("toppersOrSupplements", event.target.checked)}
            />
            Uses toppers or supplements
          </label>
        </div>

        <div className="card-group">
          <h2>Feeding goal</h2>
          <div className="card-grid two">
            <OptionCard
              title="Completely switch foods"
              description="Find a new primary food"
              selected={answers.currentDiet.changeGoal === "switch"}
              icon={<PackageSearch size={18} />}
              onClick={() => setDiet("changeGoal", "switch")}
            />
            <OptionCard
              title="Improve the current plan"
              description="Tune format, amount, cadence, or add-ons"
              selected={answers.currentDiet.changeGoal === "improve"}
              icon={<Sparkles size={18} />}
              onClick={() => setDiet("changeGoal", "improve")}
            />
          </div>
        </div>

        <div className="card-group">
          <h2>Reasons for considering a change</h2>
          <div className="chip-cloud">
            {reasonsForChange.map((reason) => (
              <Chip
                key={reason.value}
                selected={answers.currentDiet.reasonsForChange.includes(reason.value)}
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    currentDiet: {
                      ...current.currentDiet,
                      reasonsForChange: toggleValue(current.currentDiet.reasonsForChange, reason.value)
                    }
                  }))
                }
              >
                {reason.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 2) {
    const therapeuticConcerns = getTherapeuticConcerns(answers);

    return (
      <div className="step-shell">
        <SectionIntro eyebrow="Step 3" title="Identify health and dietary considerations">
          Separate what you have observed from what a veterinarian has diagnosed so the calculator can respond responsibly.
        </SectionIntro>

        <Callout title="Medical safety standard">
          For conditions that may require therapeutic nutrition, the results prioritize veterinary diet options and explain when
          authorization may be required.
        </Callout>

        <div className="card-group">
          <h2>Customer-observed concerns</h2>
          <div className="chip-cloud">
            {observedConcernOptions.map((concern) => (
              <Chip key={concern.value} selected={answers.health.observed.includes(concern.value)} onClick={() => toggleObserved(concern.value)}>
                {concern.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="card-group">
          <h2>Veterinarian-diagnosed conditions</h2>
          <div className="chip-cloud">
            {diagnosedConcernOptions.map((concern) => (
              <Chip key={concern.value} selected={answers.health.diagnosed.includes(concern.value)} onClick={() => toggleDiagnosed(concern.value)}>
                {concern.label}
              </Chip>
            ))}
          </div>
        </div>

        {therapeuticConcerns.length ? (
          <Callout tone="warning" title="Therapeutic diet guidance">
            Because you selected a veterinarian-diagnosed health condition, {answers.dogProfile.name || "your dog"} may need a
            therapeutic diet. We can help explore appropriate options, but the final food choice should be confirmed with your
            veterinarian.
          </Callout>
        ) : null}
      </div>
    );
  }

  if (activeStep === 3) {
    return (
      <div className="step-shell">
        <SectionIntro eyebrow="Step 4" title="Ingredient preferences and sensitivities">
          Preferences can shape recommendations, but a preference is different from a diagnosed food allergy.
        </SectionIntro>

        {answers.health.observed.includes("suspected-allergy") ? (
          <Callout tone="warning" title="Suspected allergy">
            If an allergy has not been diagnosed, discuss elimination diets and testing with a veterinarian before treating
            ingredients as medical requirements.
          </Callout>
        ) : null}

        <div className="card-group">
          <h2>Preferred proteins</h2>
          <div className="chip-cloud">
            {proteinOptions.map((protein) => (
              <Chip key={protein} selected={answers.ingredients.preferredProteins.includes(protein)} onClick={() => toggleProtein(protein)}>
                {protein}
              </Chip>
            ))}
          </div>
        </div>

        <div className="card-group">
          <h2>Ingredients to avoid</h2>
          <div className="chip-cloud">
            {avoidIngredientOptions.map((ingredient) => (
              <Chip key={ingredient} selected={answers.ingredients.avoidIngredients.includes(ingredient)} onClick={() => toggleAvoid(ingredient)}>
                {ingredient}
              </Chip>
            ))}
          </div>
        </div>

        <div className="card-group">
          <h2>Dietary preferences</h2>
          <div className="chip-cloud">
            {dietaryPreferenceOptions.map((preference) => (
              <Chip
                key={preference}
                selected={answers.ingredients.dietaryPreferences.includes(preference)}
                onClick={() => toggleDietaryPreference(preference)}
              >
                {preference}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 4) {
    return (
      <div className="step-shell">
        <SectionIntro eyebrow="Step 5" title="Choose the top three shopping priorities">
          The model uses these as tie-breakers after nutrition, health, and life-stage suitability are accounted for.
        </SectionIntro>

        <div className="priority-meter">
          <strong>{answers.topPriorities.length}/3 selected</strong>
          <span>{answers.topPriorities.map((priority) => priorityLabels[priority]).join(" · ") || "No priorities selected"}</span>
        </div>

        <div className="priority-grid">
          {customerPriorityOptions.map((priority) => (
            <button
              key={priority.value}
              className={`priority-item ${answers.topPriorities.includes(priority.value) ? "selected" : ""}`}
              type="button"
              onClick={() => togglePriority(priority.value)}
              disabled={!answers.topPriorities.includes(priority.value) && answers.topPriorities.length >= 3}
            >
              <span>{answers.topPriorities.includes(priority.value) ? answers.topPriorities.indexOf(priority.value) + 1 : ""}</span>
              {priority.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="step-shell">
      <SectionIntro eyebrow="Step 6" title="Add veterinary guidance and trust context">
        Enter any guidance already received from your veterinarian. Matching products receive a visible boost, but final medical
        decisions still belong with your veterinarian.
      </SectionIntro>

      <label className="check-row check-row-large">
        <input
          type="checkbox"
          checked={answers.veterinarianGuidance.hasGuidance}
          onChange={(event) => setVet("hasGuidance", event.target.checked)}
        />
        My veterinarian has already given food guidance
      </label>

      <div className="form-grid two">
        <Field label="Specific brand">
          <input
            value={answers.veterinarianGuidance.brand}
            onChange={(event) => setVet("brand", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
        <Field label="Specific formula">
          <input
            value={answers.veterinarianGuidance.formula}
            onChange={(event) => setVet("formula", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
        <Field label="Protein source">
          <input
            value={answers.veterinarianGuidance.protein}
            onChange={(event) => setVet("protein", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
        <Field label="Calorie target">
          <input
            value={answers.veterinarianGuidance.calorieTarget}
            onChange={(event) => setVet("calorieTarget", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
        <Field label="Nutrition characteristic">
          <input
            value={answers.veterinarianGuidance.nutritionCharacteristic}
            onChange={(event) => setVet("nutritionCharacteristic", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
        <Field label="Weight-management plan">
          <input
            value={answers.veterinarianGuidance.weightPlan}
            onChange={(event) => setVet("weightPlan", event.target.value)}
            disabled={!answers.veterinarianGuidance.hasGuidance}
          />
        </Field>
      </div>

      <Field label="Veterinarian notes">
        <textarea
          rows={4}
          value={answers.veterinarianGuidance.notes}
          onChange={(event) => setVet("notes", event.target.value)}
          disabled={!answers.veterinarianGuidance.hasGuidance}
        />
      </Field>

      <div className="trust-signal-grid">
        <div>
          <BadgeCheck size={18} />
          <strong>Veterinarian-informed match</strong>
          <span>Based on general nutritional criteria and feeding considerations.</span>
        </div>
        <div>
          <Stethoscope size={18} />
          <strong>Reviewed by veterinary experts</strong>
          <span>Shown only when mocked product data includes that review signal.</span>
        </div>
        <div>
          <Home size={18} />
          <strong>Recommended by your veterinarian</strong>
          <span>Shown when recommendations align with guidance entered here.</span>
        </div>
      </div>

      <Callout title="Claim standard">
        The prototype avoids broad claims like "vet approved." Veterinary signals are labels with specific meanings, and all product
        data is mocked.
      </Callout>
    </div>
  );
}
