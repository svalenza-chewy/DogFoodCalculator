import { products } from "../data/products";
import type {
  BreedSize,
  DogFoodProduct,
  FeedingEstimate,
  FinderAnswers,
  ProductRecommendation,
  RecommendationReason,
  RecommendationResult,
  RecommendationScore
} from "../types";

export const concernLabels: Record<string, string> = {
  "no-known": "No known health concerns",
  "sensitive-stomach": "Sensitive stomach",
  "food-sensitivities": "Food sensitivities",
  "suspected-allergy": "Suspected food allergy",
  "skin-coat": "Skin or coat concerns",
  "joint-mobility": "Joint or mobility concerns",
  "weight-gain": "Weight gain",
  "weight-loss": "Weight loss",
  dental: "Dental concerns",
  kidney: "Kidney concerns",
  urinary: "Urinary concerns",
  heart: "Heart concerns",
  diabetes: "Diabetes",
  pancreatitis: "Pancreatitis",
  "digestive-disease": "Digestive disease",
  liver: "Liver concerns",
  "pregnancy-nursing": "Pregnancy or nursing",
  "other-diagnosed": "Other veterinarian-diagnosed condition"
};

export const priorityLabels: Record<string, string> = {
  "nutritional-fit": "Overall nutritional fit",
  "veterinarian-recommendation": "Veterinarian recommendation",
  "ingredient-quality": "Ingredient quality",
  price: "Price",
  "cost-per-day": "Cost per day",
  "customer-ratings": "Customer ratings",
  "brand-reputation": "Brand reputation",
  sustainability: "Sustainability",
  "food-format": "Food format",
  convenience: "Convenience",
  autoship: "Autoship availability",
  "made-usa": "Made in the USA",
  "sourcing-transparency": "Sourcing transparency",
  palatability: "Palatability",
  "minimal-ingredients": "Minimal ingredients",
  "high-meat": "High meat content",
  "easy-transition": "Easy transition",
  "fast-inventory": "Local or fast-shipping inventory"
};

const therapeuticConcernSet = new Set([
  "kidney",
  "urinary",
  "heart",
  "diabetes",
  "pancreatitis",
  "digestive-disease",
  "liver",
  "other-diagnosed"
]);

const lower = (value: string) => value.trim().toLowerCase();
const cap = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const intersects = (left: string[], right: string[]) => {
  const rightLower = right.map(lower);
  return left.some((item) => rightLower.includes(lower(item)));
};

const containsToken = (source: string, token: string) => lower(source).includes(lower(token));

const hasAttribute = (product: DogFoodProduct, attribute: string) =>
  product.healthAttributes.includes(attribute) ||
  product.dietaryAttributes.map(lower).includes(lower(attribute)) ||
  product.therapeuticCategories.includes(attribute);

export function getTherapeuticConcerns(answers: FinderAnswers) {
  return answers.health.diagnosed.filter((concern) => therapeuticConcernSet.has(concern));
}

export function inferBreedSize(weight: number): BreedSize {
  if (weight < 22) return "small";
  if (weight < 55) return "medium";
  if (weight < 100) return "large";
  return "giant";
}

export function estimateCostPerDay(product: DogFoodProduct, answers: FinderAnswers) {
  const estimate = calculateFeedingEstimate(product, answers);
  return estimate.monthlyCost / 30;
}

export function calculateFeedingEstimate(product: DogFoodProduct, answers: FinderAnswers): FeedingEstimate {
  const weightKg = answers.dogProfile.currentWeight / 2.205;
  const rer = 70 * Math.pow(weightKg, 0.75);
  const lifeStageFactor = answers.dogProfile.lifeStage === "puppy" ? 2 : answers.dogProfile.lifeStage === "senior" ? 1.1 : 1.35;
  const activityFactor = {
    low: 0.9,
    moderate: 1,
    high: 1.18,
    working: 1.35
  }[answers.dogProfile.activityLevel];
  const bodyFactor = {
    underweight: 1.12,
    ideal: 1,
    overweight: 0.82
  }[answers.dogProfile.bodyCondition];
  const dailyCalories = rer * lifeStageFactor * activityFactor * bodyFactor;
  const dailyAmount = dailyCalories / product.feeding.caloriesPerUnit;
  const firstPackage = product.packages[0];
  const packageDurationDays = Math.max(1, product.feeding.packageUnits / dailyAmount);
  const packageCostPerDay = firstPackage.price / packageDurationDays;
  const autoshipCadenceWeeks = Math.max(1, Math.round(packageDurationDays / 7));

  return {
    dailyCalories: Math.round(dailyCalories),
    dailyAmount: Number(dailyAmount.toFixed(product.feeding.unit === "oz" ? 1 : 2)),
    unit: product.feeding.unit,
    mealsPerDay: answers.currentDiet.mealsPerDay,
    packageDurationDays: Math.round(packageDurationDays),
    autoshipCadenceWeeks,
    monthlyCost: Number((packageCostPerDay * 30).toFixed(2)),
    annualCost: Number((packageCostPerDay * 365).toFixed(2))
  };
}

function getWeights(answers: FinderAnswers) {
  const hasTherapeuticNeed = getTherapeuticConcerns(answers).length > 0;

  // Scoring assumptions:
  // - Nutrition and health are the foundation and cannot be outweighed by price, reviews, or commerce signals.
  // - Diagnosed medical conditions shift more weight toward health suitability and veterinarian guidance.
  // - Shopping preferences are meaningful tie-breakers, not replacements for nutritional fit.
  return hasTherapeuticNeed
    ? {
        nutrition: 25,
        health: 35,
        lifeStageSize: 10,
        ingredientFormat: 7,
        veterinaryGuidance: 15,
        customerPriority: 4,
        priceConvenience: 4
      }
    : {
        nutrition: 30,
        health: 25,
        lifeStageSize: 15,
        ingredientFormat: 10,
        veterinaryGuidance: 10,
        customerPriority: 5,
        priceConvenience: 5
      };
}

function getHardFilters(product: DogFoodProduct, answers: FinderAnswers) {
  const filters: string[] = [];
  const allergySensitive =
    answers.health.observed.includes("suspected-allergy") ||
    answers.health.observed.includes("food-sensitivities") ||
    answers.health.diagnosed.includes("food-sensitivities");
  const breedSize = inferBreedSize(answers.dogProfile.currentWeight);

  if (!product.lifeStages.includes("all") && !product.lifeStages.includes(answers.dogProfile.lifeStage)) {
    filters.push(`Not formulated for ${answers.dogProfile.lifeStage} life stage`);
  }

  if (!product.breedSizes.includes("all") && !product.breedSizes.includes(breedSize)) {
    filters.push(`Not aligned to ${breedSize}-breed sizing`);
  }

  if (product.availability === "out-of-stock") {
    filters.push("Currently out of stock");
  }

  if (allergySensitive) {
    const blockedIngredients = answers.ingredients.avoidIngredients.filter((ingredient) =>
      product.ingredientsToFlag.some((flag) => containsToken(flag, ingredient))
    );

    if (blockedIngredients.length > 0) {
      filters.push(`Contains selected allergy or sensitivity ingredient: ${blockedIngredients.join(", ")}`);
    }
  }

  if (answers.veterinarianGuidance.hasGuidance && answers.veterinarianGuidance.protein) {
    const requested = answers.veterinarianGuidance.protein;
    const isTherapeutic = product.vetAuthorizationRequired;
    const productMatches = containsToken(product.primaryProtein, requested) || product.therapeuticCategories.length > 0;

    if (!productMatches && isTherapeutic) {
      filters.push(`Conflicts with veterinarian-entered protein guidance: ${requested}`);
    }
  }

  return filters;
}

function scoreNutrition(product: DogFoodProduct, answers: FinderAnswers) {
  let score = 72;
  const body = answers.dogProfile.bodyCondition;

  if (product.aafcoStatement) score += 8;
  if (answers.dogProfile.activityLevel === "high" || answers.dogProfile.activityLevel === "working") {
    score += product.nutrients.proteinPct >= 26 ? 10 : -4;
    score += product.calories >= 380 ? 5 : -2;
  }
  if (body === "overweight") {
    score += product.dietaryAttributes.includes("Weight-management") || product.nutrients.fatPct <= 11 ? 14 : -7;
  }
  if (body === "underweight") {
    score += product.calories >= 380 || product.nutrients.fatPct >= 15 ? 10 : -4;
  }
  if (answers.dogProfile.lifeStage === "senior") {
    score += product.healthAttributes.includes("senior-support") || product.nutrients.fiberPct >= 5 ? 6 : 0;
  }
  if (answers.dogProfile.lifeStage === "puppy") {
    score += product.healthAttributes.includes("puppy-growth") ? 12 : -12;
  }

  return cap(score);
}

function scoreHealth(product: DogFoodProduct, answers: FinderAnswers) {
  const observed = answers.health.observed.filter((concern) => concern !== "no-known");
  const diagnosed = answers.health.diagnosed;
  const therapeuticConcerns = getTherapeuticConcerns(answers);

  if (therapeuticConcerns.length > 0) {
    const matchingTherapeutic = therapeuticConcerns.filter((concern) => product.therapeuticCategories.includes(concern));
    if (matchingTherapeutic.length > 0) return cap(93 + matchingTherapeutic.length * 4);
    if (product.vetAuthorizationRequired) return 68;
    return 48;
  }

  let score = observed.length || diagnosed.length ? 64 : 84;
  for (const concern of [...observed, ...diagnosed]) {
    if (hasAttribute(product, concern)) score += 11;
    if (concern === "skin-coat" && product.ingredients.includes("Fish oil")) score += 4;
    if (concern === "weight-gain" && product.dietaryAttributes.includes("Weight-management")) score += 6;
  }
  if (product.vetAuthorizationRequired && therapeuticConcerns.length === 0) score -= 12;
  if (product.vetReviewStatus === "reviewed") score += 4;

  return cap(score);
}

function scoreLifeStageAndSize(product: DogFoodProduct, answers: FinderAnswers) {
  const breedSize = inferBreedSize(answers.dogProfile.currentWeight);
  const stageScore = product.lifeStages.includes(answers.dogProfile.lifeStage) ? 100 : product.lifeStages.includes("all") ? 88 : 30;
  const sizeScore = product.breedSizes.includes("all") ? 88 : product.breedSizes.includes(breedSize) ? 100 : 45;
  return Math.round((stageScore + sizeScore) / 2);
}

function scoreIngredientAndFormat(product: DogFoodProduct, answers: FinderAnswers) {
  let score = 64;
  const preferred = answers.ingredients.preferredProteins.filter((protein) => protein !== "No preference");
  const avoided = answers.ingredients.avoidIngredients;

  if (preferred.length && preferred.some((protein) => containsToken(product.primaryProtein, protein))) score += 18;
  if (answers.currentDiet.changeGoal === "improve" && product.format === answers.currentDiet.format) score += 5;
  if (answers.currentDiet.changeGoal === "switch" && product.format !== answers.currentDiet.format) score += 4;

  for (const preference of answers.ingredients.dietaryPreferences) {
    if (preference === "No preference") continue;
    if (product.dietaryAttributes.map(lower).includes(lower(preference))) score += 5;
  }

  for (const ingredient of avoided) {
    if (product.ingredientsToFlag.some((flag) => containsToken(flag, ingredient))) score -= 14;
  }

  if (
    answers.ingredients.dietaryPreferences.includes("Grain-free") &&
    !answers.health.observed.includes("food-sensitivities") &&
    !answers.health.observed.includes("suspected-allergy")
  ) {
    score -= product.dietaryAttributes.includes("Grain-free") ? 4 : 0;
  }

  return cap(score);
}

function scoreVeterinaryGuidance(product: DogFoodProduct, answers: FinderAnswers) {
  const guidance = answers.veterinarianGuidance;
  let score = guidance.hasGuidance ? 58 : 70;

  if (product.vetReviewStatus === "reviewed") score += 10;
  if (product.vetReviewStatus === "veterinarian-informed") score += 6;
  if (product.vetRecommendationClaim) score += 7;
  if (guidance.hasGuidance) {
    if (guidance.brand && containsToken(product.brand, guidance.brand)) score += 18;
    if (guidance.formula && containsToken(product.name, guidance.formula)) score += 18;
    if (guidance.protein && containsToken(product.primaryProtein, guidance.protein)) score += 18;
    if (
      guidance.nutritionCharacteristic &&
      product.dietaryAttributes.some((attribute) => containsToken(guidance.nutritionCharacteristic, attribute))
    ) {
      score += 10;
    }
    if (guidance.notes && product.healthAttributes.some((attribute) => containsToken(guidance.notes, attribute.replace("-", " ")))) {
      score += 8;
    }
  }

  return cap(score);
}

function scorePriority(product: DogFoodProduct, answers: FinderAnswers, estimatedCostPerDay: number) {
  const priorities = answers.topPriorities.length ? answers.topPriorities : ["nutritional-fit"];
  const factorScores = priorities.map((priority) => {
    switch (priority) {
      case "nutritional-fit":
        return 86;
      case "veterinarian-recommendation":
        return product.vetReviewStatus === "reviewed" || product.vetRecommendationClaim ? 92 : 70;
      case "ingredient-quality":
        return product.dietaryAttributes.includes("Natural ingredients") || product.dietaryAttributes.includes("Human-grade") ? 90 : 72;
      case "price":
      case "cost-per-day":
        return estimatedCostPerDay < 2 ? 95 : estimatedCostPerDay < 3 ? 82 : estimatedCostPerDay < 4.5 ? 66 : 48;
      case "customer-ratings":
        return product.rating * 20;
      case "sustainability":
        return product.sustainability.length ? 86 : 62;
      case "food-format":
        return product.format === answers.currentDiet.format ? 80 : 72;
      case "convenience":
      case "fast-inventory":
        return product.availability === "in-stock" ? 92 : product.availability === "limited" ? 62 : 30;
      case "autoship":
        return product.autoshipDiscountPct > 0 ? 94 : 55;
      case "made-usa":
        return product.countryOfManufacture === "USA" ? 95 : 65;
      case "sourcing-transparency":
        return product.sourcing.length > 25 ? 86 : 62;
      case "palatability":
        return product.palatabilityScore;
      case "minimal-ingredients":
        return product.dietaryAttributes.includes("Limited-ingredient") ? 94 : 64;
      case "high-meat":
        return product.dietaryAttributes.includes("High meat content") || product.nutrients.proteinPct >= 30 ? 92 : 66;
      case "easy-transition":
        return product.transitionDifficulty === "easy" ? 94 : product.transitionDifficulty === "moderate" ? 74 : 52;
      default:
        return 72;
    }
  });

  return Math.round(factorScores.reduce((sum, score) => sum + score, 0) / factorScores.length);
}

function scorePriceConvenience(product: DogFoodProduct, estimatedCostPerDay: number) {
  let score = 68;
  if (estimatedCostPerDay < 2) score += 20;
  else if (estimatedCostPerDay < 3) score += 12;
  else if (estimatedCostPerDay > 4.5) score -= 12;
  if (product.autoshipDiscountPct > 0) score += 8;
  if (product.availability === "in-stock") score += 10;
  if (product.availability === "limited") score -= 10;
  if (product.format === "fresh") score -= 4;
  return cap(score);
}

function calculateOverall(score: Omit<RecommendationScore, "overall">, answers: FinderAnswers) {
  const weights = getWeights(answers);
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const weighted =
    score.nutrition * weights.nutrition +
    score.health * weights.health +
    score.lifeStageSize * weights.lifeStageSize +
    score.ingredientFormat * weights.ingredientFormat +
    score.veterinaryGuidance * weights.veterinaryGuidance +
    score.customerPriority * weights.customerPriority +
    score.priceConvenience * weights.priceConvenience;
  return Math.round(weighted / totalWeight);
}

function getTrustSignal(product: DogFoodProduct, answers: FinderAnswers) {
  if (answers.veterinarianGuidance.hasGuidance) {
    return {
      label: "Aligned with your veterinarian guidance",
      description: "We boosted foods that match guidance you entered from your veterinarian.",
      tone: "reviewed" as const
    };
  }

  if (product.vetRecommendationClaim) {
    return {
      label: "Veterinarian-recommended claim",
      description: `${product.vetRecommendationClaim}. Mocked product data only.`,
      tone: product.vetAuthorizationRequired ? ("warning" as const) : ("reviewed" as const)
    };
  }

  if (product.vetReviewStatus === "reviewed") {
    return {
      label: "Reviewed by veterinary experts",
      description: "Product information and suitability criteria have been reviewed as mocked prototype data.",
      tone: "reviewed" as const
    };
  }

  return {
    label: "Veterinarian-informed match",
    description: "Based on nutritional criteria and feeding considerations reviewed using veterinary principles.",
    tone: "default" as const
  };
}

function buildReasons(product: DogFoodProduct, answers: FinderAnswers, score: RecommendationScore) {
  const dogName = answers.dogProfile.name || "your dog";
  const reasons: RecommendationReason[] = [
    { type: "positive", text: `Formulated for ${answers.dogProfile.lifeStage} dogs or an appropriate all-life-stage use case.` },
    {
      type: "positive" as const,
      text: `Calorie level is a ${score.nutrition >= 80 ? "strong" : "reasonable"} fit for a ${answers.dogProfile.activityLevel} ${answers.dogProfile.currentWeight}-lb dog.`
    }
  ];

  if (answers.ingredients.preferredProteins.some((protein) => containsToken(product.primaryProtein, protein))) {
    reasons.push({ type: "positive", text: `Uses ${product.primaryProtein} as a primary protein, matching a selected preference.` });
  }

  if (answers.health.observed.some((concern) => hasAttribute(product, concern))) {
    reasons.push({ type: "positive", text: `Includes attributes related to ${dogName}'s reported needs.` });
  }

  if (product.dietaryAttributes.includes("Grain-inclusive")) {
    reasons.push({ type: "positive", text: "Grain-inclusive formula supports your selected ingredient philosophy." });
  }

  if (product.autoshipDiscountPct > 0) {
    reasons.push({ type: "positive", text: "Eligible for Autoship savings and cadence planning." });
  }

  if (product.vetAuthorizationRequired) {
    reasons.push({ type: "neutral", text: "Therapeutic diet option surfaced because selected needs may require veterinary involvement." });
  }

  return reasons.slice(0, 6);
}

function buildTradeoffs(product: DogFoodProduct, answers: FinderAnswers, estimatedCostPerDay: number) {
  const tradeoffs = [];
  const avoided = answers.ingredients.avoidIngredients.filter((ingredient) =>
    product.ingredientsToFlag.some((flag) => containsToken(flag, ingredient))
  );

  if (avoided.length > 0) {
    tradeoffs.push({ severity: "high" as const, text: `Contains selected ingredient to avoid: ${avoided.join(", ")}.` });
  }
  if (estimatedCostPerDay > 4) {
    tradeoffs.push({ severity: "medium" as const, text: "Higher estimated cost per day than many dry-food options." });
  }
  if (product.transitionDifficulty === "slow") {
    tradeoffs.push({ severity: "medium" as const, text: "May need a slower transition, especially for sensitive stomachs." });
  }
  if (product.availability === "limited") {
    tradeoffs.push({ severity: "medium" as const, text: "Limited availability could affect repeat purchasing or Autoship timing." });
  }
  if (product.vetAuthorizationRequired) {
    tradeoffs.push({ severity: "high" as const, text: "Veterinary authorization is required before purchase." });
  }
  if (
    product.dietaryAttributes.includes("Grain-free") &&
    !answers.health.observed.includes("food-sensitivities") &&
    !answers.health.observed.includes("suspected-allergy")
  ) {
    tradeoffs.push({ severity: "low" as const, text: "Grain-free is not automatically healthier; confirm fit with your veterinarian if unsure." });
  }
  if (getTherapeuticConcerns(answers).length > 0 && !product.vetAuthorizationRequired) {
    tradeoffs.push({
      severity: "high" as const,
      text: "Not a therapeutic diet; final food choice should be confirmed with your veterinarian."
    });
  }
  if (product.cautions.length > 0) {
    tradeoffs.push({ severity: "low" as const, text: product.cautions[0] });
  }

  return tradeoffs.slice(0, 5);
}

export function scoreProduct(product: DogFoodProduct, answers: FinderAnswers): ProductRecommendation {
  const estimatedCostPerDay = estimateCostPerDay(product, answers);
  const partialScore = {
    nutrition: scoreNutrition(product, answers),
    health: scoreHealth(product, answers),
    lifeStageSize: scoreLifeStageAndSize(product, answers),
    ingredientFormat: scoreIngredientAndFormat(product, answers),
    veterinaryGuidance: scoreVeterinaryGuidance(product, answers),
    customerPriority: scorePriority(product, answers, estimatedCostPerDay),
    priceConvenience: scorePriceConvenience(product, estimatedCostPerDay)
  };
  const score = {
    ...partialScore,
    overall: calculateOverall(partialScore, answers)
  };
  const therapeuticConcerns = getTherapeuticConcerns(answers);

  if (therapeuticConcerns.length > 0 && !product.vetAuthorizationRequired) {
    score.overall = Math.min(score.overall, 74);
  }

  return {
    product,
    score,
    reasons: buildReasons(product, answers, score),
    tradeoffs: buildTradeoffs(product, answers, estimatedCostPerDay),
    hardFilters: getHardFilters(product, answers),
    trustSignal: getTrustSignal(product, answers),
    estimatedCostPerDay
  };
}

export function getRecommendations(answers: FinderAnswers, limit = 5): RecommendationResult {
  const scored = products.map((product) => scoreProduct(product, answers));
  const eligible = scored.filter((recommendation) => recommendation.hardFilters.length === 0);
  const rankedEligible = [...eligible].sort((a, b) => b.score.overall - a.score.overall);
  const rankedClosest = [...scored].sort((a, b) => {
    if (a.hardFilters.length !== b.hardFilters.length) return a.hardFilters.length - b.hardFilters.length;
    return b.score.overall - a.score.overall;
  });
  const therapeuticConcerns = getTherapeuticConcerns(answers);
  const recommendations = (rankedEligible.length ? rankedEligible : rankedClosest).slice(0, limit);
  const summary = [
    `${answers.dogProfile.name || "Your dog"} is a ${answers.dogProfile.lifeStage} ${answers.dogProfile.currentWeight}-lb dog with ${answers.dogProfile.activityLevel} activity.`,
    therapeuticConcerns.length
      ? `Veterinarian-diagnosed considerations selected: ${therapeuticConcerns.map((concern) => concernLabels[concern] ?? concern).join(", ")}.`
      : "No veterinarian-diagnosed therapeutic diet need was selected.",
    answers.topPriorities.length
      ? `Top priorities: ${answers.topPriorities.map((priority) => priorityLabels[priority] ?? priority).join(", ")}.`
      : "No shopping priorities selected yet."
  ];

  return {
    evaluatedCount: products.length,
    recommendations,
    closestOptions: rankedClosest.slice(0, limit),
    requiresTherapeuticDiet: therapeuticConcerns.length > 0,
    therapeuticConcerns,
    noPerfectMatch: rankedEligible.length === 0,
    summary
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}
