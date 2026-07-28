export type LifeStage = "puppy" | "adult" | "senior";
export type Sex = "female" | "male";
export type ActivityLevel = "low" | "moderate" | "high" | "working";
export type BodyCondition = "underweight" | "ideal" | "overweight";
export type Lifestyle = "indoor" | "outdoor" | "mixed";
export type BreedSize = "small" | "medium" | "large" | "giant" | "all";
export type FoodFormat = "dry" | "wet" | "fresh" | "raw" | "freeze-dried" | "mixed";
export type ProductAvailability = "in-stock" | "limited" | "out-of-stock";
export type VetReviewStatus = "none" | "veterinarian-informed" | "reviewed";

export interface DogProfile {
  name: string;
  breed: string;
  mixedBreed: boolean;
  currentWeight: number;
  expectedAdultWeight?: number;
  ageYears: number;
  lifeStage: LifeStage;
  sex: Sex;
  spayedNeutered: boolean;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  lifestyle: Lifestyle;
  householdDogs: number;
}

export interface CurrentDiet {
  brand: string;
  product: string;
  format: FoodFormat;
  durationMonths: number;
  satisfied: "yes" | "somewhat" | "no";
  feedingAmount: string;
  mealsPerDay: number;
  treatLevel: "low" | "moderate" | "high";
  toppersOrSupplements: boolean;
  enthusiasm: "low" | "medium" | "high";
  changeGoal: "switch" | "improve";
  reasonsForChange: string[];
}

export interface HealthSelections {
  observed: string[];
  diagnosed: string[];
  preferences: string[];
}

export interface IngredientPreferences {
  preferredProteins: string[];
  avoidIngredients: string[];
  dietaryPreferences: string[];
}

export interface VeterinarianGuidance {
  hasGuidance: boolean;
  brand: string;
  formula: string;
  protein: string;
  nutritionCharacteristic: string;
  calorieTarget: string;
  weightPlan: string;
  notes: string;
}

export interface FinderAnswers {
  dogProfile: DogProfile;
  currentDiet: CurrentDiet;
  health: HealthSelections;
  ingredients: IngredientPreferences;
  topPriorities: string[];
  veterinarianGuidance: VeterinarianGuidance;
  therapeuticAcknowledged: boolean;
}

export interface NutritionalProfile {
  proteinPct: number;
  fatPct: number;
  fiberPct: number;
  moisturePct: number;
}

export interface FeedingGuideline {
  unit: "cup" | "can" | "tray" | "patty" | "oz";
  caloriesPerUnit: number;
  packageUnits: number;
  notes: string;
}

export interface PackageOption {
  size: string;
  price: number;
}

export interface DogFoodProduct {
  id: string;
  brand: string;
  name: string;
  format: FoodFormat;
  recipe: string;
  primaryProtein: string;
  ingredients: string[];
  ingredientsToFlag: string[];
  lifeStages: Array<LifeStage | "all">;
  breedSizes: BreedSize[];
  healthAttributes: string[];
  dietaryAttributes: string[];
  calories: number;
  nutrients: NutritionalProfile;
  feeding: FeedingGuideline;
  packages: PackageOption[];
  autoshipDiscountPct: number;
  rating: number;
  reviewCount: number;
  availability: ProductAvailability;
  shippingEstimate: string;
  vetAuthorizationRequired: boolean;
  vetReviewStatus: VetReviewStatus;
  vetRecommendationClaim?: string;
  therapeuticCategories: string[];
  aafcoStatement: string;
  countryOfManufacture: string;
  sourcing: string;
  sustainability: string[];
  palatabilityScore: number;
  transitionDifficulty: "easy" | "moderate" | "slow";
  cautions: string[];
  imagePalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface RecommendationScore {
  nutrition: number;
  health: number;
  lifeStageSize: number;
  ingredientFormat: number;
  veterinaryGuidance: number;
  customerPriority: number;
  priceConvenience: number;
  overall: number;
}

export interface RecommendationReason {
  type: "positive" | "neutral";
  text: string;
}

export interface RecommendationTradeoff {
  severity: "low" | "medium" | "high";
  text: string;
}

export interface ProductRecommendation {
  product: DogFoodProduct;
  score: RecommendationScore;
  reasons: RecommendationReason[];
  tradeoffs: RecommendationTradeoff[];
  hardFilters: string[];
  trustSignal: {
    label: string;
    description: string;
    tone: "default" | "reviewed" | "warning";
  };
  estimatedCostPerDay: number;
}

export interface RecommendationResult {
  evaluatedCount: number;
  recommendations: ProductRecommendation[];
  closestOptions: ProductRecommendation[];
  requiresTherapeuticDiet: boolean;
  therapeuticConcerns: string[];
  noPerfectMatch: boolean;
  summary: string[];
}

export interface FeedingEstimate {
  dailyCalories: number;
  dailyAmount: number;
  unit: FeedingGuideline["unit"];
  mealsPerDay: number;
  packageDurationDays: number;
  autoshipCadenceWeeks: number;
  monthlyCost: number;
  annualCost: number;
}
