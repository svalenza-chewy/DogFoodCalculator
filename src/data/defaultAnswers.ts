import type { FinderAnswers } from "../types";

export const defaultAnswers: FinderAnswers = {
  dogProfile: {
    name: "Zion",
    breed: "Labrador Retriever",
    mixedBreed: false,
    currentWeight: 55,
    expectedAdultWeight: 70,
    ageYears: 4,
    lifeStage: "adult",
    sex: "male",
    spayedNeutered: true,
    activityLevel: "moderate",
    bodyCondition: "ideal",
    lifestyle: "mixed",
    householdDogs: 1
  },
  currentDiet: {
    brand: "Current brand",
    product: "Chicken & rice adult dry food",
    format: "dry",
    durationMonths: 14,
    satisfied: "somewhat",
    feedingAmount: "2.5 cups per day",
    mealsPerDay: 2,
    treatLevel: "moderate",
    toppersOrSupplements: false,
    enthusiasm: "medium",
    changeGoal: "switch",
    reasonsForChange: ["skin-coat", "higher-quality-ingredients", "better-stool-quality"]
  },
  health: {
    observed: ["skin-coat", "sensitive-stomach"],
    diagnosed: [],
    preferences: ["grain-inclusive"]
  },
  ingredients: {
    preferredProteins: ["Salmon", "Turkey"],
    avoidIngredients: ["Chicken", "Artificial colors"],
    dietaryPreferences: ["Grain-inclusive", "Limited-ingredient", "High-protein"]
  },
  topPriorities: ["nutritional-fit", "veterinarian-recommendation", "cost-per-day"],
  veterinarianGuidance: {
    hasGuidance: true,
    brand: "",
    formula: "",
    protein: "Salmon",
    nutritionCharacteristic: "Moderate calories with skin and coat support",
    calorieTarget: "",
    weightPlan: "",
    notes: "Our veterinarian suggested trying a salmon-forward food and avoiding chicken while monitoring skin and stool changes."
  },
  therapeuticAcknowledged: false
};
