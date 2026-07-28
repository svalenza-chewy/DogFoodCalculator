import type { ActivityLevel, BodyCondition, FoodFormat, LifeStage, Lifestyle, Sex } from "../types";

export const lifeStageOptions: Array<{ value: LifeStage; label: string; description: string }> = [
  { value: "puppy", label: "Puppy", description: "Still growing or under expected adult maturity" },
  { value: "adult", label: "Adult", description: "Fully grown with steady nutrition needs" },
  { value: "senior", label: "Senior", description: "Older dog with changing activity and support needs" }
];

export const activityOptions: Array<{ value: ActivityLevel; label: string; description: string }> = [
  { value: "low", label: "Low", description: "Short walks, mostly relaxed days" },
  { value: "moderate", label: "Moderate", description: "Daily walks and regular play" },
  { value: "high", label: "High", description: "Long walks, runs, hikes, or sport" },
  { value: "working", label: "Working dog", description: "High-output work, sport, or training" }
];

export const bodyConditionOptions: Array<{ value: BodyCondition; label: string; description: string }> = [
  { value: "underweight", label: "Underweight", description: "Ribs or hips are too easy to see or feel" },
  { value: "ideal", label: "Ideal weight", description: "Visible waist and ribs easy to feel" },
  { value: "overweight", label: "Overweight", description: "Less visible waist or extra body fat" }
];

export const lifestyleOptions: Array<{ value: Lifestyle; label: string }> = [
  { value: "indoor", label: "Mostly indoor" },
  { value: "outdoor", label: "Mostly outdoor" },
  { value: "mixed", label: "Indoor and outdoor" }
];

export const sexOptions: Array<{ value: Sex; label: string }> = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" }
];

export const foodFormatOptions: Array<{ value: FoodFormat; label: string }> = [
  { value: "dry", label: "Dry" },
  { value: "wet", label: "Wet" },
  { value: "fresh", label: "Fresh" },
  { value: "raw", label: "Raw" },
  { value: "freeze-dried", label: "Freeze-dried" },
  { value: "mixed", label: "Mixed" }
];

export const reasonsForChange = [
  { value: "dislikes-current-food", label: "Dog does not like current food" },
  { value: "digestive-concerns", label: "Digestive concerns" },
  { value: "skin-coat", label: "Skin or coat concerns" },
  { value: "weight-management", label: "Weight management" },
  { value: "lower-cost", label: "Lower cost" },
  { value: "higher-quality-ingredients", label: "Higher-quality ingredients" },
  { value: "veterinarian-recommendation", label: "Veterinarian recommendation" },
  { value: "new-life-stage", label: "New life stage" },
  { value: "allergy-sensitivity", label: "Food allergy or sensitivity concerns" },
  { value: "better-stool-quality", label: "Better stool quality" },
  { value: "more-energy", label: "More energy" },
  { value: "easier-routine", label: "Easier feeding routine" },
  { value: "better-availability", label: "Better availability" },
  { value: "different-format", label: "Different food format" }
];

export const observedConcernOptions = [
  { value: "no-known", label: "No known health concerns" },
  { value: "sensitive-stomach", label: "Sensitive stomach" },
  { value: "food-sensitivities", label: "Food sensitivities" },
  { value: "suspected-allergy", label: "Suspected food allergy" },
  { value: "skin-coat", label: "Skin or coat concerns" },
  { value: "joint-mobility", label: "Joint or mobility concerns" },
  { value: "weight-gain", label: "Weight gain" },
  { value: "weight-loss", label: "Weight loss" },
  { value: "dental", label: "Dental concerns" }
];

export const diagnosedConcernOptions = [
  { value: "kidney", label: "Kidney concerns" },
  { value: "urinary", label: "Urinary concerns" },
  { value: "heart", label: "Heart concerns" },
  { value: "diabetes", label: "Diabetes" },
  { value: "pancreatitis", label: "Pancreatitis" },
  { value: "digestive-disease", label: "Digestive disease" },
  { value: "liver", label: "Liver concerns" },
  { value: "pregnancy-nursing", label: "Pregnancy or nursing" },
  { value: "other-diagnosed", label: "Other veterinarian-diagnosed condition" }
];

export const proteinOptions = [
  "Chicken",
  "Beef",
  "Lamb",
  "Turkey",
  "Salmon",
  "Whitefish",
  "Duck",
  "Venison",
  "Pork",
  "Rabbit",
  "Insect protein",
  "Plant-based protein",
  "No preference"
];

export const avoidIngredientOptions = [
  "Chicken",
  "Beef",
  "Dairy",
  "Egg",
  "Wheat",
  "Corn",
  "Soy",
  "Peas",
  "Lentils",
  "Potatoes",
  "Artificial colors",
  "Artificial flavors",
  "Artificial preservatives",
  "Other"
];

export const dietaryPreferenceOptions = [
  "Grain-inclusive",
  "Grain-free",
  "Limited-ingredient",
  "Single-protein",
  "High-protein",
  "Low-fat",
  "High-fiber",
  "Weight-management",
  "Natural ingredients",
  "Organic ingredients",
  "Human-grade",
  "Minimally processed",
  "No preference"
];

export const customerPriorityOptions = [
  { value: "nutritional-fit", label: "Overall nutritional fit" },
  { value: "veterinarian-recommendation", label: "Veterinarian recommendation" },
  { value: "ingredient-quality", label: "Ingredient quality" },
  { value: "price", label: "Price" },
  { value: "cost-per-day", label: "Cost per day" },
  { value: "customer-ratings", label: "Customer ratings" },
  { value: "brand-reputation", label: "Brand reputation" },
  { value: "sustainability", label: "Sustainability" },
  { value: "food-format", label: "Food format" },
  { value: "convenience", label: "Convenience" },
  { value: "autoship", label: "Autoship availability" },
  { value: "made-usa", label: "Made in the USA" },
  { value: "sourcing-transparency", label: "Sourcing transparency" },
  { value: "palatability", label: "Palatability" },
  { value: "minimal-ingredients", label: "Minimal ingredients" },
  { value: "high-meat", label: "High meat content" },
  { value: "easy-transition", label: "Easy transition" },
  { value: "fast-inventory", label: "Local or fast-shipping inventory" }
];
